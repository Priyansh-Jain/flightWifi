export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flightwifi.app";
export const SITE_NAME = "FlightWifi";
export const TAGLINE = "Know your flight's Wi-Fi before you book.";
export const CHROME_STORE_URL =
  process.env.NEXT_PUBLIC_CHROME_STORE_URL ??
  "https://chromewebstore.google.com/detail/flightwifi-%E2%80%93-in-flight-wi/omoclebljmjljikaoaogdpahjlbmdbin";
export const GITHUB_URL = "https://github.com/Priyansh-Jain/flightWifi";
export const CONTACT_EMAIL = "priyansh0327@gmail.com";
export const SITE_LAUNCH = "2026-08-18";

// Next replaces the whole openGraph object per segment rather than merging it, so a page that
// declares only a url silently drops the image, siteName and type inherited from the layout.
// Every page spreads this instead.
export function og(path: string, extra: Record<string, unknown> = {}) {
  return {
    url: path,
    siteName: SITE_NAME,
    type: "website" as const,
    images: ["/og.png"],
    ...extra
  };
}

// Read from the extension manifest so the published version and the site cannot drift.
export const EXTENSION_VERSION: string = JSON.parse(
  require("node:fs").readFileSync(
    require("node:path").join(process.cwd(), "..", "extension", "manifest.json"),
    "utf8"
  )
).version;
