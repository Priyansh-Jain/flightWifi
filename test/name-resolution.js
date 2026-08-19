// node test/name-resolution.js
// Guards carrier resolution against the two ways airline-name matching goes wrong:
// a shorter registered name winning over the longer one that actually flew the leg,
// and a short name matching inside an unrelated word. Also pins the verdict rollup,
// where the failure mode is quieter: reporting a confident answer for a trip we only
// half know about.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const registrySrc = fs.readFileSync(path.join(root, "extension/data/registry.js"), "utf8");
global.WIFI_REGISTRY = JSON.parse(
  registrySrc.slice(registrySrc.indexOf("{"), registrySrc.lastIndexOf("};", registrySrc.indexOf("const VERDICTS")) + 1)
);

const contentSrc = fs.readFileSync(path.join(root, "extension/core.js"), "utf8");
// everything above the hover card is pure logic: declarations plus two index builds over the
// registry, nothing that touches the DOM at load, so it evaluates as-is
const head = contentSrc.slice(0, contentSrc.indexOf("/* ---------- hover card ----------"));
eval(head);

const CASES = [
  // longer registered name must beat the shorter one it contains
  ["Thai AirAsia", "FD"],
  ["AirAsia", "AK"],
  ["Air India Express", "IX"],
  ["Air India", "AI"],
  ["Thai Lion Air", "SL"],
  ["Lion Air", "JT"],
  ["Thai VietJet Air", "VZ"],
  ["Jetstar Japan", "GK"],
  ["Jetstar", "JQ"],
  ["Avianca Ecuador", "2K"],
  ["Avianca", "AV"],
  ["Tianjin Airlines", "GS"],
  ["Jin Air", "LJ"],
  ["Arajet", "DM"],
  ["AJet", "VF"],
  ["TAAG Angola Airlines", "DT"],
  ["GOL", "G3"],
  ["ASKY Airlines", "KP"],
  ["Sky Airline", "H2"],
  // "ANA" must not be read out of the middle of another word
  ["ANA", "NH"],
  ["Air Canada", "AC"],
  ["Ryanair", "FR"],
  ["Air Astana", "KC"],
  ["Loganair", "LM"],
  ["Canadian North", null],
  ["Air Panama", null],
  ["Ghana Airways", null]
];

// Google prints a shorter name than the registry stores, so the collapsed row resolves by exact
// match against a suffix-stripped alias. Exactness is the safety property: a bare "Singapore" must
// resolve to the airline only when it is the whole string, never inside "Singapore Changi Airport".
const EXACT_CASES = [
  ["Vietjet", "VJ"],
  ["Vietjet Air", "VJ"],
  ["Thai VietJet Air", "VZ"],
  ["Batik Air", "ID"],
  ["Singapore Airlines", "SQ"],
  ["Singapore", "SQ"],
  ["Singapore Changi Airport", null],
  ["Air India Express", "IX"],
  ["Air India", "AI"],
  ["IndiGo", "6E"],
  ["Korean Air", "KE"],
  ["Korean", "KE"],
  // Google spaces and capitalises names its own way, and trades some under a different name entirely
  ["Air Baltic", "BT"],
  ["airBaltic", "BT"],
  ["Scandinavian Airlines", "SK"],
  ["SAS", "SK"],
  ["LOT", "LO"],
  ["LOT Polish Airlines", "LO"],
  ["a lot of legroom", null],
  ["Tokyo Haneda Airport", null],
  ["", null]
];

// The rollup decides what a multi-leg trip reports. Two rules it must never break: a trip that
// mixes wifi with no-wifi is a coin toss rather than either answer, and a leg we never verified
// cannot be overruled by one we did.
const ROLLUP_CASES = [
  [["GEO", "GEO"], "GEO"],
  [["LEO", "GEO"], "GEO"],
  [["NONE", "NONE"], "NONE"],
  [["NONE", "GEO"], "PARTIAL"],
  [["NONE", "LEO"], "PARTIAL"],
  [["PARTIAL", "LEO"], "PARTIAL"],
  [["UNKNOWN", "UNKNOWN"], "UNKNOWN"],
  [["UNKNOWN", "GEO"], "UNKNOWN"],
  [["UNKNOWN", "NONE"], "UNKNOWN"],
  [["NONE", "UNKNOWN"], "UNKNOWN"],
  [["VARIES", "GEO"], "GEO"],
  [["LEO"], "LEO"]
];

// classifyOrbit is what turns the registry's prose orbit field into one of those keys
const ORBIT_CASES = [
  ["NONE", "NONE"],
  ["UNKNOWN", "UNKNOWN"],
  ["A2G", "A2G"],
  ["GEO", "GEO"],
  ["LEO", "LEO"],
  ["mixed GEO/LEO", "VARIES"],
  ["mixed GEO/MEO", "VARIES"],
  ["GEO, moving to LEO", "VARIES"],
  ["mixed GEO/none", "PARTIAL"],
  ["mixed LEO/none", "PARTIAL"]
];

// A connection whose legs disagree must not borrow a fleet-level word. DEL-DOH-FRA-STN on IndiGo,
// Qatar and Ryanair reported "Not guaranteed", which reads as one uncertain aircraft while two of
// the three legs are certainly dark.
const FLEET_CASES = [
  [["6E", "QR", "FR"], "LEG_PARTIAL"],
  [["IX", "AI"], "LEG_PARTIAL"],
  [["6E", "FR"], "NONE"],
  [["AK", "AK"], "GEO"],
  [["QR"], "PARTIAL"],
  [["EK"], "VARIES"],
  [["BT"], "LEO"],
  [["SQ", "EY"], "GEO"],
  [["ZZ"], null]
];

// Where two type rules cover the same aircraft and disagree, the cautious one must win. Qatar's
// 787 matched both "Starlink" and "rollout completing end of 2026", and the optimistic rule was
// promising a video call on an aircraft that may not be fitted.
const AIRCRAFT_CASES = [
  ["QR", "Boeing 787", "VARIES"],
  ["QR", "Boeing 777", "LEO"],
  ["QR", "Airbus A320", "NONE"],
  ["QW", "Airbus A320", "PARTIAL"],
  ["SQ", "Airbus A350", "GEO"],
  ["6E", "Airbus A321", "NONE"],
  ["BT", "Airbus A220", "LEO"]
];

let failed = 0;
for (const [code, aircraft, want] of AIRCRAFT_CASES) {
  const got = verdictFor(code, aircraft, "nodata").key;
  if (got !== want) {
    failed++;
    console.error(`FAIL verdictFor ${code} ${aircraft}: want ${want}, got ${got}`);
  }
}
for (const [codes, want] of FLEET_CASES) {
  const got = fleetVerdict(codes);
  const key = got ? got.key : null;
  if (key !== want) {
    failed++;
    console.error(`FAIL fleetVerdict [${codes}]: want ${want}, got ${key}`);
  }
}
{
  // duplicate codes collapse to the single-carrier path, which carries provider and cost detail
  const dup = fleetVerdict(["AK", "AK"]);
  if (!dup || dup.legs.length !== 1 || !dup.entry) {
    failed++;
    console.error(`FAIL fleetVerdict [AK,AK] dedupe: legs=${dup && dup.legs.length}, entry=${!!(dup && dup.entry)}`);
  }
}
for (const [keys, want] of ROLLUP_CASES) {
  const got = rollup(keys);
  if (got !== want) {
    failed++;
    console.error(`FAIL rollup [${keys}]: want ${want}, got ${got}`);
  }
}
for (const [orbit, want] of ORBIT_CASES) {
  const got = classifyOrbit(orbit);
  if (got !== want) {
    failed++;
    console.error(`FAIL classifyOrbit ${JSON.stringify(orbit)}: want ${want}, got ${got}`);
  }
}
for (const [name, want] of CASES) {
  const got = carrierByName(`Boeing 737 ${name} 1234`);
  if (got !== want) {
    failed++;
    console.error(`FAIL substring ${JSON.stringify(name)}: want ${want}, got ${got}`);
  }
}
for (const [name, want] of EXACT_CASES) {
  const got = carrierExact(name);
  if (got !== want) {
    failed++;
    console.error(`FAIL exact ${JSON.stringify(name)}: want ${want}, got ${got}`);
  }
}
const total = CASES.length + EXACT_CASES.length + ROLLUP_CASES.length + ORBIT_CASES.length + FLEET_CASES.length + AIRCRAFT_CASES.length;
console.log(`${total - failed}/${total} passed`);
process.exit(failed ? 1 : 0);
