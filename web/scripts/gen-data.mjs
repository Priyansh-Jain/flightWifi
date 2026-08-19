// Publishes the registry as open JSON. Runs before every build so /data.json can never lag the
// pages rendered from the same file.
import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "..");
const src = fs.readFileSync(path.join(root, "extension", "data", "registry.js"), "utf8");
const registry = JSON.parse(
  src.slice(src.indexOf("{"), src.lastIndexOf("};", src.indexOf("const VERDICTS")) + 1)
);

const out = {
  name: "FlightWifi airline wifi registry",
  license: "CC-BY-4.0",
  attribution: "FlightWifi, https://flightwifi.io",
  compiled: new Date().toISOString().slice(0, 10),
  airlines: registry
};

fs.writeFileSync(path.join(process.cwd(), "public", "data.json"), JSON.stringify(out, null, 1));
console.log("data.json:", Object.keys(registry).length, "airlines");
