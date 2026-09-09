#!/bin/zsh
# Packages the extension for Chrome Web Store review.
# The dev tree keeps its hot-reloader and debug instrumentation; this stages a
# stripped copy under dist/staging and zips it, so the dev workflow never breaks.
# The background entry is swapped rather than dropped: the shipped worker is
# uninstall.js alone, which needs no permissions.
set -e
cd "$(dirname "$0")"

VERSION=$(python3 -c "import json;print(json.load(open('extension/manifest.json'))['version'])")
STAGE="dist/staging"
rm -rf dist
mkdir -p "$STAGE"

cp -R extension/data extension/icons extension/popup extension/chip.css extension/core.js extension/google.js extension/google-bridge.js extension/skyscanner.js extension/soar.js extension/uninstall.js "$STAGE/"

python3 - "$STAGE" <<'PY'
import json, re, sys
stage = sys.argv[1]

m = json.load(open("extension/manifest.json"))
# alarms exists only for the dev hot-reloader, which does not ship. The other three are load-bearing
# in production: storage holds the per-site toggles, and activeTab plus scripting let the popup put
# a content script back into a tab that an extension update orphaned. None of the three raises an
# install warning, so the install dialog still shows nothing beyond the content-script hosts.
m["permissions"] = ["storage", "activeTab", "scripting"]
m["background"] = {"service_worker": "uninstall.js"}
m["name"] = m["name"].replace(" (working title)", "")
json.dump(m, open(f"{stage}/manifest.json", "w"), indent=2)

FILES = ["core.js", "google.js", "google-bridge.js", "skyscanner.js", "soar.js"]
for fname in FILES:
    src = open(f"{stage}/{fname}").read()

    # dev-only stat instrumentation in the bridge becomes a no-op
    src = re.sub(r"  // FW-DEVSTAT-START[\s\S]*?// FW-DEVSTAT-END", "  const stat = () => {};", src)

    # whole debug-attribute block in sweep()
    src = re.sub(
        r"\n  if \(sweepCount % 25 === 0 \|\| processed\) \{\n"
        r"    document\.documentElement\.setAttribute\(\n"
        r"      \"data-fw-debug\",\n"
        r"[^\n]*\n"
        r"    \);\n"
        r"  \}\n",
        "\n",
        src,
    )

    # single-line instrumentation: trace pushes, data-fw-* attributes, the error attribute
    lines = [
        l
        for l in src.split("\n")
        if "FW_TRACE" not in l and 'setAttribute("data-fw-' not in l and "data-fw-err" not in l
    ]
    src = "\n".join(lines)

    open(f"{stage}/{fname}", "w").write(src)
PY

node -e "
const fs = require('fs');
const m = JSON.parse(fs.readFileSync('$STAGE/manifest.json', 'utf8'));
// Pinned rather than merely 'absent': this catches the dev-only alarms permission leaking through
// as well as a production permission going missing, which would fail silently at runtime.
const WANT = ['storage', 'activeTab', 'scripting'];
if (JSON.stringify(m.permissions) !== JSON.stringify(WANT)) throw new Error('permissions are ' + JSON.stringify(m.permissions) + ', expected ' + JSON.stringify(WANT));
if (m.host_permissions) throw new Error('host_permissions must stay absent; activeTab is the point');
if (m.action) {
  const popup = m.action.default_popup;
  if (!popup || !fs.existsSync('$STAGE/' + popup)) throw new Error('manifest declares a popup that is not staged: ' + popup);
  for (const f of ['popup/popup.html', 'popup/popup.css', 'popup/popup.js']) {
    if (!fs.existsSync('$STAGE/' + f)) throw new Error('missing ' + f);
  }
}
if (m.background.service_worker !== 'uninstall.js') throw new Error('background is not the uninstall worker');
if (fs.readFileSync('$STAGE/uninstall.js', 'utf8').includes('importScripts')) throw new Error('dev reloader reached the shipped worker');
for (const f of ['core.js', 'google.js', 'google-bridge.js', 'skyscanner.js', 'soar.js', 'uninstall.js', 'popup/popup.js']) {
  new Function(fs.readFileSync('$STAGE/' + f, 'utf8'));
  const s = fs.readFileSync('$STAGE/' + f, 'utf8');
  for (const bad of ['FW_TRACE', 'data-fw-', 'FW-DEVSTAT']) if (s.includes(bad)) throw new Error(bad + ' survived the strip in ' + f);
}
console.log('staging verified: parses, popup staged, permissions pinned, instrumentation gone');
"

(cd "$STAGE" && zip -qr "../flightwifi-$VERSION.zip" .)
unzip -l "dist/flightwifi-$VERSION.zip"
echo "-> dist/flightwifi-$VERSION.zip"
