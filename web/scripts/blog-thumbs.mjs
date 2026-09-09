import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

// Renders public/images/blog/<slug>.jpg from the SVG scenes in scripts/blog-thumbs.html with the
// system Chrome. Add a scene with data-scene="<article slug>" and run: node scripts/blog-thumbs.mjs
const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "scripts", "blog-thumbs.html");
const outDir = path.join(root, "public", "images", "blog");
const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium"
].find((p) => fs.existsSync(p));
if (!CHROME) throw new Error("No Chrome or Chromium found to render the thumbnails");

const html = fs.readFileSync(src, "utf8");
const scenes = [...html.matchAll(/data-scene="([a-z0-9-]+)"/g)].map((m) => m[1]).filter((s) => s !== "defs");
const only = process.argv.slice(2);
const todo = only.length ? scenes.filter((s) => only.includes(s)) : scenes;
if (!todo.length) throw new Error("No scenes matched");

fs.mkdirSync(outDir, { recursive: true });
const tmp = fs.mkdtempSync(path.join(root, ".thumbs-"));
try {
  for (const slug of todo) {
    const png = path.join(tmp, `${slug}.png`);
    execFileSync(
      CHROME,
      [
        "--headless=new",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--window-size=1200,760",
        "--virtual-time-budget=3000",
        `--screenshot=${png}`,
        `file://${src}?scene=${slug}`
      ],
      { stdio: "ignore" }
    );
    const jpg = path.join(outDir, `${slug}.jpg`);
    await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toFile(jpg);
    await sharp(png).webp({ quality: 80 }).toFile(path.join(outDir, `${slug}.webp`));
    const { size } = fs.statSync(jpg);
    console.log(`${slug}.jpg ${(size / 1024).toFixed(0)} KB`);
  }
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
