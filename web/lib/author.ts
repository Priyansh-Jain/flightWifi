import fs from "node:fs";
import path from "node:path";
import { GITHUB_URL } from "./site";

const IMAGE = "/images/authors/priyansh-jain.jpg";

export const AUTHOR = {
  slug: "priyansh-jain",
  name: "Priyansh Jain",
  initials: "PJ",
  role: "Founder, FlightWifi",
  bio: "Priyansh builds FlightWifi: the airline Wi-Fi registry, this site, and the browser extension that every article here is written from.",
  topics: ["Starlink", "Free Wi-Fi", "Working in the air"],
  links: {
    x: "https://x.com/priyansh0327",
    github: GITHUB_URL
  },
  image: fs.existsSync(path.join(process.cwd(), "public", IMAGE)) ? IMAGE : null
};
