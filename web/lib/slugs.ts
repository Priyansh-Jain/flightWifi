import { codes, entryFor, registry } from "./extension";

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

let bySlug: Map<string, string> | null = null;
let byCode: Map<string, string> | null = null;

// Slugs must be stable and unique across all 235 airlines; a name collision gets the IATA code
// appended rather than silently shadowing another carrier's page.
function maps() {
  if (bySlug && byCode) return { bySlug, byCode };
  bySlug = new Map();
  byCode = new Map();
  for (const code of codes()) {
    const entry = entryFor(code)!;
    let slug = slugify(entry.airline);
    if (bySlug.has(slug)) slug = `${slug}-${code.toLowerCase()}`;
    bySlug.set(slug, code);
    byCode.set(code, slug);
  }
  return { bySlug, byCode };
}

export function airlineSlugs(): string[] {
  return Array.from(maps().bySlug.keys());
}

export function codeForSlug(slug: string): string | undefined {
  return maps().bySlug.get(slug);
}

export function slugForCode(code: string): string {
  return maps().byCode.get(code.toUpperCase()) ?? slugify(registry()[code]?.airline ?? code);
}
