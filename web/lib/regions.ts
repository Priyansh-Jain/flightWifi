export type Region =
  | "European"
  | "North American"
  | "Latin American"
  | "Middle Eastern"
  | "African"
  | "South Asian"
  | "East Asian"
  | "Southeast Asian"
  | "Oceanian"
  | "Central Asian"
  | "Russian";

const BY_REGION: Record<Region, string[]> = {
  European: [
    "TK", "PC", "XQ", "VF", "BA", "LH", "AF", "KL", "IB", "VS", "LX", "OS", "SN", "SK", "AY", "TP",
    "LO", "A3", "EI", "AZ", "U2", "FR", "W6", "VY", "DY", "N0", "HV", "EW", "DE", "X3", "LS", "BT",
    "FI", "JU", "RO", "OU", "UX", "V7", "QS", "XC", "KM", "LG", "WK", "4Y", "WF", "LM", "BF", "SS",
    "S4", "NT", "FB", "OA"
  ],
  "North American": [
    "UA", "DL", "AA", "AS", "B6", "WN", "F9", "HA", "AC", "WS", "SY", "G4", "MX", "PD", "TS", "F8",
    "XP", "3M"
  ],
  "Latin American": [
    "AM", "CM", "AV", "LA", "G3", "AR", "Y4", "VB", "AD", "H2", "JA", "P5", "DM", "2K", "BW", "WM"
  ],
  "Middle Eastern": ["EK", "QR", "EY", "SV", "GF", "WY", "KU", "RJ", "ME", "LY", "G9", "FZ", "J9", "OV", "XY"],
  African: [
    "ET", "MS", "AT", "KQ", "WB", "SA", "MK", "AH", "4Z", "FA", "HM", "DT", "HC", "HF", "P4", "W3",
    "TC", "UR", "KP", "TM", "Q9", "TU", "BJ", "QI"
  ],
  "South Asian": ["AI", "6E", "SG", "UL", "QP", "IX", "PK", "PA", "ER", "9P", "BG", "BS", "RA", "H9", "KB", "Q2"],
  "East Asian": [
    "CA", "MU", "CZ", "HU", "JL", "NH", "KE", "OZ", "BR", "CI", "CX", "MF", "HO", "9C", "3U", "UO",
    "HX", "NX", "BX", "ZG", "MM", "TW", "LJ", "7C", "GK", "IJ", "BC", "7G", "6J", "HD", "JH", "NQ",
    "RS", "ZE", "YP", "JX", "IT", "AE", "B7", "HB", "ZH", "GS", "JD", "8L", "PN", "QW", "G5", "AQ",
    "Y8", "SC", "EU"
  ],
  "Southeast Asian": [
    "SQ", "TG", "MH", "GA", "VN", "PR", "TR", "AK", "5J", "VJ", "JT", "ID", "PG", "DD", "FD", "SL",
    "VZ", "QH", "QG", "IP"
  ],
  Oceanian: ["QF", "VA", "NZ", "FJ", "JQ", "ZL", "PX", "TN", "SB"],
  "Central Asian": ["HY", "J2", "KC", "T5", "SZ"],
  Russian: ["SU", "S7", "FV", "DP", "U6", "UT", "N4", "5N", "B2"]
};

const INDEX: Record<string, Region> = {};
for (const [region, list] of Object.entries(BY_REGION) as [Region, string[]][]) {
  for (const code of list) INDEX[code] = region;
}

export function regionOf(code: string): Region | null {
  return INDEX[code.toUpperCase()] ?? null;
}
