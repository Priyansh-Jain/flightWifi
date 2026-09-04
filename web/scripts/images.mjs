// Generates the AVIF/WebP/JPEG derivatives <Shot> selects between. Run via prebuild so the set can
// never drift from the source screenshots.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const SOURCES = ["screenshot-results", "screenshot-tooltip", "screenshot-compare", "screenshot-without", "screenshot-with"];
const WIDTHS = [640, 960, 1440, 1920, 2880];
const missing = SOURCES.flatMap((b) =>
  WIDTHS.flatMap((w) => ["avif", "webp", "jpg"].map((e) => `public/${b}-${w}.${e}`))
).filter((f) => !existsSync(f));

if (!missing.length) {
  console.log("images: derivatives present");
} else {
  const py = `
from PIL import Image
for name in ${JSON.stringify(SOURCES)}:
    im = Image.open(f"public/{name}.jpg").convert("RGB")
    for w in ${JSON.stringify(WIDTHS)}:
        if w > im.width: continue
        r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        r.save(f"public/{name}-{w}.webp", "WEBP", quality=82, method=6)
        r.save(f"public/{name}-{w}.avif", "AVIF", quality=58)
        r.save(f"public/{name}-{w}.jpg", "JPEG", quality=82, optimize=True, progressive=True)
print("images: regenerated")
`;
  execFileSync("python3", ["-c", py], { stdio: "inherit" });
}
