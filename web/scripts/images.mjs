// Generates the AVIF/WebP/JPEG derivatives <Shot> selects between. Runs in prebuild so the set can
// never drift from the source screenshots.
//
// Only widths at or below a source's own width are expected: upscaling a screenshot would add bytes
// and no detail, so <Shot> filters those out too. Getting that wrong made every build think the set
// was incomplete and try to rebuild it.
//
// Resizing goes through sharp rather than a Python helper, because the build machine is only
// guaranteed to have Node.
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCES = ["screenshot-results", "screenshot-tooltip", "screenshot-compare", "screenshot-without", "screenshot-with"];
const WIDTHS = [640, 960, 1440, 1920, 2880];
const FORMATS = ["avif", "webp", "jpg"];
const force = process.argv.includes("--force");
const pub = path.join(import.meta.dirname, "..", "public");

let written = 0;
for (const base of SOURCES) {
  const src = path.join(pub, `${base}.jpg`);
  if (!existsSync(src)) throw new Error(`images: missing source public/${base}.jpg`);
  const image = sharp(src);
  const { width, height } = await image.metadata();
  const widths = WIDTHS.filter((w) => w <= width);
  const srcTime = statSync(src).mtimeMs;

  for (const w of widths) {
    const targets = FORMATS.map((ext) => path.join(pub, `${base}-${w}.${ext}`));
    // A derivative older than its source is stale, which is the case a plain existence check misses
    // when a screenshot is replaced in place.
    const stale = targets.some((t) => !existsSync(t) || statSync(t).mtimeMs < srcTime);
    if (!stale && !force) continue;
    const resized = sharp(src).resize({ width: w, height: Math.round((height * w) / width), kernel: "lanczos3" });
    await resized.clone().avif({ quality: 58 }).toFile(path.join(pub, `${base}-${w}.avif`));
    await resized.clone().webp({ quality: 82, effort: 6 }).toFile(path.join(pub, `${base}-${w}.webp`));
    await resized.clone().jpeg({ quality: 82, progressive: true, mozjpeg: true }).toFile(path.join(pub, `${base}-${w}.jpg`));
    written += FORMATS.length;
  }
}
console.log(written ? `images: wrote ${written} derivatives` : "images: derivatives up to date");
