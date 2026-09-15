// Bundles the registry and the extension's verdict logic for the MCP route.
//
// Every other registry-backed surface on this site is rendered at build time, so it can read
// ../extension off the disk. The MCP endpoint cannot: it is a POST JSON-RPC route, so it runs in a
// serverless function where that directory does not exist. Rather than re-implement the verdict
// rules in TypeScript and let the two copies drift, this snapshots the same two files the site
// already evaluates and writes them into the bundle. The route rebuilds the bridge from this string
// exactly as lib/extension.ts rebuilds it from disk, so there is still one source of truth.
import fs from "node:fs";
import path from "node:path";

const ext = path.join(process.cwd(), "..", "extension");

const registrySrc = fs.readFileSync(path.join(ext, "data", "registry.js"), "utf8");
const registry = JSON.parse(
  registrySrc.slice(
    registrySrc.indexOf("{"),
    registrySrc.lastIndexOf("};", registrySrc.search(/\b(?:const|let|var)\s+VERDICTS\b/)) + 1
  )
);

const coreSrc = fs.readFileSync(path.join(ext, "core.js"), "utf8");
const marker = "/* ---------- hover card ----------";
const cut = coreSrc.indexOf(marker);
if (cut < 0) {
  console.error("gen-mcp: hover-card marker missing from core.js; refusing to write a partial bridge");
  process.exit(1);
}
const core = coreSrc.slice(0, cut);

for (const name of ["verdictFor", "fleetVerdict", "accessPoints", "costOf", "VERDICT_UI", "CALL_POLICY", "CAPABILITY"]) {
  if (!core.includes(name)) {
    console.error(`gen-mcp: ${name} is not in the sliced core.js head; the marker may have moved`);
    process.exit(1);
  }
}

const asOf = Object.values(registry)
  .map((e) => e.as_of)
  .filter(Boolean)
  .sort()
  .pop();

const out = { compiled: new Date().toISOString().slice(0, 10), as_of: asOf, registry, core };
const dest = path.join(process.cwd(), "lib", "mcp", "bridge.json");
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, JSON.stringify(out));
console.log(
  `bridge.json: ${Object.keys(registry).length} airlines, core head ${Math.round(core.length / 1024)} KB, verified ${asOf}`
);
