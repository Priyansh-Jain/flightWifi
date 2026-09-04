import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";
import { stats } from "../lib/extension.ts";

// Renders public/og.png from scripts/og.html with the system Chrome, so no extra dependency.
// The panels are crops of the slider frames: the share card only ever shows verdicts the
// registry actually holds. Run: node scripts/og.mjs
const root = path.resolve(import.meta.dirname, "..");
const pub = path.join(root, "public");
const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium"
].find((p) => fs.existsSync(p));
if (!CHROME) throw new Error("No Chrome or Chromium found to render the OG image");

const s = stats();
const b64 = (p) => "data:image/png;base64," + fs.readFileSync(p).toString("base64");
const tmp = fs.mkdtempSync(path.join(root, ".og-"));
try {
  for (const [src, out] of [
    ["screenshot-without.jpg", "wo.png"],
    ["screenshot-with.jpg", "wi.png"]
  ]) {
    const input = path.join(pub, src);
    const { height } = await sharp(input).metadata();
    await sharp(input).extract({ left: 0, top: 0, width: 1000, height }).png().toFile(path.join(tmp, out));
  }
  const html = fs
    .readFileSync(path.join(root, "scripts", "og.html"), "utf8")
    .replaceAll("__LOGO__", b64(path.join(pub, "logo.png")))
    .replace("__WITHOUT__", b64(path.join(tmp, "wo.png")))
    .replace("__WITH__", b64(path.join(tmp, "wi.png")))
    .replace("__AIRLINES__", String(s.airlines))
    .replace("__SOURCES__", `${Math.floor(s.sources / 50) * 50}+`);
  const page = path.join(tmp, "og.html");
  fs.writeFileSync(page, html);
  const out = path.join(pub, "og.png");
  execFileSync(CHROME, [
    "--headless=new",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--window-size=1200,630",
    "--virtual-time-budget=6000",
    `--screenshot=${out}`,
    `file://${page}`
  ], { stdio: "ignore" });
  console.log(`og.png rendered: ${s.airlines} airlines, ${s.sources} sources`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
