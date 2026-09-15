export type SourceKind = "airline" | "provider" | "trade" | "news" | "blog" | "reference" | "other";

export const PROVIDER_DOMAINS = [
  "starlink.com", "spacex.com", "viasat.com", "panasonic.aero", "panasonic.com", "intelsat.com",
  "ses.com", "anuvu.com", "sita.aero", "oneweb.net", "eutelsat.com", "inmarsat.com",
  "gogoair.com", "aboutamazon.com", "thalesgroup.com", "hughes.com", "nsg.com.sa",
  "neospacegroup.com", "thinkom.com", "immfly.com", "airfi.aero", "blueboxaviation.com",
  "inflightdublin.com", "adonisone.com", "telesat.com", "kymetacorp.com", "safran-group.com", "ntplc.co.th"
];

const TRADE_DOMAINS = [
  "paxex.aero", "runwaygirlnetwork.com", "apex.aero", "pax-intl.com", "futuretravelexperience.com",
  "aerotime.aero", "centreforaviation.com", "aerospaceglobalnews.com", "simpleflying.com",
  "aviationweek.com", "flightglobal.com", "ch-aviation.com", "aviacionline.com",
  "executivetraveller.com", "businesstraveller.com", "businesstravelnews.com",
  "businesstravelnewseurope.com", "travelweekly.com.au", "travelweekly.com",
  "aircraftinteriorsinternational.com", "aviationtoday.com", "satellitetoday.com", "satnews.com",
  "skift.com", "aviation24.be", "airlineratings.com", "aerospacetechreview.com", "avitrader.com",
  "passengerselfservice.com", "inflight-online.com", "airdatanews.com", "aviationnewsonline.com",
  "aviation.direct", "airlinegeeks.com", "airspace-africa.com", "exyuaviation.com", "avioradar.net",
  "ttnworldwide.com", "freightweek.org", "traveltalk.nz", "panrotas.com.br", "sky-budget.com",
  "aviation21.ru", "terravia.ru", "airwaysmag.com", "theaviationist.com", "aeroroutes.com"
];

const NEWS_DOMAINS = [
  "cnbc.com", "bloomberg.com", "reuters.com", "cnn.com", "forbes.com", "bbc.com", "ft.com",
  "scmp.com", "koreaherald.com", "sedaily.com", "yna.co.kr", "gulfnews.com", "qz.com",
  "xinhuanet.com", "news.cn", "chinanews.com.cn", "chinadaily.com.cn", "caacnews.com.cn",
  "ccaonline.cn", "qq.com", "sohu.com", "163.com", "jiemian.com", "pingwest.com", "21jingji.com",
  "kankanews.com", "ascii.jp", "mybroadband.co.za", "phoneworld.com.pk", "propakistani.pk",
  "thedailystar.net", "philstar.com", "abs-cbn.com", "tuoitre.vn", "vietnamplus.vn",
  "egyptindependent.com", "medias24.com", "allafrica.com", "sokodirectory.com",
  "thebusinesswatch.com", "guardian.co.tt", "postcourier.com.pg", "emol.com", "df.cl",
  "correiobraziliense.com.br", "mexicobusiness.news", "ladevi.info", "newswire.ca",
  "mobilesyrup.com", "t-online.de", "investing.com", "finance.yahoo.com", "actmedia.eu",
  "traveltomorrow.com", "travelandtourworld.com", "citizendailypost.com", "uzdaily.uz",
  "kursiv.media", "digitalnewsasia.com", "globenewswire.com", "spa.gov.sa", "turkmenistan.gov.tm",
  "koreaairport.com", "moment.tech", "iim.com.sg", "telus.com", "att.com"
];

const BLOG_DOMAINS = [
  "onemileatatime.com", "thepointsguy.com", "headforpoints.com", "upgradedpoints.com",
  "loyaltylobby.com", "awardwallet.com", "milesopedia.com", "liveandletsfly.com",
  "viewfromthewing.com", "mainlymiles.com", "livefromalounge.com", "happyfares.in",
  "flyforpoints.com", "2paxfly.com", "wandr.me", "jesselin.com", "flight-report.com",
  "cestee.com", "cestee.es", "cestee.de", "thealviator.com", "cabincrewhq.com",
  "aviationclubcenter.com", "businessclassjournal.com", "promociones-aereas.com.ar",
  "infoviajera.com", "passageirodeprimeira.com", "algerienomades.com", "voyagerdz.com",
  "lavoiedalgerie.dz", "seatwifi.com", "inflightwifi.one", "starlinkflights.com",
  "unitedstarlinktracker.com", "alternativeairlines.com", "aerolopa.com", "seatguru.com", "blog.naver.com", "naver.com", "zhihu.com", "bilibili.com"
];

const REFERENCE_DOMAINS = ["wikipedia.org", "wikidata.org", "wikivoyage.org", "britannica.com"];

// Carriers whose own domain does not contain their name, plus the parent-group newsrooms that
// publish for them. Without these the classifier files an airline's own press release as
// unattributed, which understates how much of the registry rests on primary sources.
const AIRLINE_DOMAINS: Record<string, string[]> = {
  AA: ["aa.com"],
  HA: ["alaskaair.com"],
  G3: ["voegol.com.br"],
  MU: ["ceair.com"],
  CZ: ["csair.com"],
  HU: ["hnair.com"],
  JL: ["jal.co.jp"],
  NH: ["anahd.co.jp"],
  SK: ["sasgroup.net", "flysas.com"],
  TP: ["flytap.com"],
  AZ: ["ita-airways.com"],
  PC: ["flypgs.com"],
  VF: ["flypgs.com"],
  "9C": ["ch.com"],
  IJ: ["ch.com"],
  EW: ["lufthansagroup.com"],
  "4Y": ["lufthansagroup.com", "discover-airlines.com"],
  LH: ["lufthansagroup.com"],
  LX: ["lufthansagroup.com"],
  OS: ["lufthansagroup.com"],
  SN: ["lufthansagroup.com"],
  WK: ["flyedelweiss.com"],
  HY: ["uzairways.com"],
  HF: ["aircotedivoire.com"],
  JD: ["jdair.net"],
  B7: ["evaair.com"],
  KM: ["kmmaltairlines.com"],
  OA: ["aegeanair.com"],
  A3: ["aegeanair.com"],
  "9P": ["airarabia.com"],
  BS: ["usbair.com"],
  FD: ["airasia.com"],
  AK: ["airasia.com"],
  SL: ["lionairthai.com"],
  SC: ["sda.cn"],
  QP: ["akasaair.com"],
  DD: ["nokair.com"],
  MM: ["flypeach.com"],
  ZG: ["zipair.net"],
  VJ: ["vietjetair.com"],
  UO: ["hkexpress.com"],
  NX: ["airmacau.com.mo"],
  BX: ["airbusan.com"],
  RS: ["flyairseoul.com"],
  ZE: ["eastarjet.com"],
  LJ: ["jinair.com"],
  "7C": ["jejuair.net"],
  TW: ["twayair.com"],
  MK: ["airmauritius.com"],
  AH: ["airalgerie.dz"],
  "4Z": ["flyairlink.com"],
  HM: ["airseychelles.com"],
  DT: ["flytaag.com"],
  HC: ["flyairsenegal.com"],
  TM: ["lam.co.mz"],
  ZL: ["rex.com.au"],
  PX: ["airniugini.com.pg"],
  SB: ["aircalin.com"],
  "3M": ["silverairways.com"],
  MX: ["flybreeze.com"],
  PD: ["flyporter.com"],
  SY: ["suncountry.com"],
  F9: ["flyfrontier.com"],
  WN: ["southwest.com"],
  B6: ["jetblue.com"],
  XP: ["aveloair.com"],
  F8: ["flyflair.com"],
  TS: ["airtransat.com"],
  Y4: ["volaris.com", "volaristv.com"],
  VB: ["vivaaerobus.com"],
  AD: ["voeazul.com.br"],
  H2: ["skyairline.com"],
  JA: ["jetsmart.com"],
  P5: ["wingo.com"],
  DM: ["arajet.com"],
  "2K": ["avianca.com"],
  AV: ["avianca.com"],
  BW: ["caribbean-airlines.com"],
  WM: ["winair.sx"],
  QI: ["ibomair.com"],
  P4: ["flyairpeace.com"],
  W3: ["arikair.com"],
  Q9: ["greenafrica.com"],
  UR: ["ugandairlines.com"],
  TC: ["airtanzania.co.tz"],
  KP: ["flyasky.com"],
  FA: ["flysafair.co.za"],
  SA: ["flysaa.com"],
  ET: ["ethiopianairlines.com"],
  AT: ["royalairmaroc.com"],
  TU: ["tunisair.com"],
  BJ: ["nouvelair.com"],
  QG: ["citilink.co.id"],
  IP: ["pelita-air.com"],
  EU: ["chengduair.cn"],
  PN: ["westair.cn"],
  "8L": ["luckyair.net"],
  QW: ["qingdao-airlines.com"],
  AQ: ["9air.com"],
  GS: ["tianjin-air.com"],
  "3U": ["sichuanair.com"],
  HO: ["juneyaoair.com"],
  MF: ["xiamenair.com", "xiamenair.cn"],
  ZH: ["shenzhenair.com"],
  KB: ["drukair.com.bt"],
  Q2: ["maldivian.aero"],
  RA: ["nepalairlines.com.np"],
  H9: ["himalaya-airlines.com"],
  PA: ["airblue.com"],
  ER: ["sereneair.com"],
  BG: ["biman-airlines.com"],
  PK: ["piac.com.pk"],
  UL: ["srilankan.com"],
  IX: ["airindiaexpress.com"],
  TR: ["flyscoot.com"],
  JQ: ["jetstar.com"],
  GK: ["jetstar.com"],
  BC: ["skymark.co.jp"],
  "7G": ["starflyer.jp"],
  "6J": ["solaseedair.jp"],
  HD: ["airdo.jp"],
  JH: ["fujidream.co.jp"],
  NQ: ["airjapan.com"],
  YP: ["airpremia.com"],
  JX: ["starlux-airlines.com"],
  AE: ["mandarin-airlines.com"],
  IT: ["tigerairtw.com"],
  HB: ["greaterbay-airlines.com"],
  UX: ["aireuropa.com"],
  V7: ["volotea.com"],
  QS: ["smartwings.com"],
  XC: ["corendon.nl", "corendonairlines.com"],
  LG: ["luxair.lu"],
  WF: ["wideroe.no"],
  LM: ["loganair.co.uk"],
  BF: ["frenchbee.com"],
  SS: ["flycorsair.com"],
  S4: ["azoresairlines.pt"],
  NT: ["bintercanarias.com"],
  FB: ["air.bg"],
  DY: ["norwegian.com"],
  N0: ["flynorse.com"],
  HV: ["transavia.com"],
  DE: ["condor.com"],
  X3: ["tuifly.com"],
  LS: ["jet2.com"],
  BT: ["airbaltic.com"],
  FI: ["icelandair.com"],
  JU: ["airserbia.com"],
  RO: ["tarom.ro"],
  OU: ["croatiaairlines.com"],
  G9: ["airarabia.com"],
  FZ: ["flydubai.com"],
  J9: ["jazeeraairways.com"],
  OV: ["salamair.com"],
  XY: ["flynas.com"],
  J2: ["azal.az"],
  KC: ["airastana.com"],
  T5: ["turkmenistanairlines.tm"],
  SZ: ["somonair.com"],
  B2: ["belavia.by"],
  SU: ["aeroflot.ru"],
  S7: ["s7.ru"],
  FV: ["rossiya-airlines.ru"],
  DP: ["flypobeda.ru"],
  U6: ["uralairlines.ru"],
  UT: ["utair.ru"],
  "5N": ["flysmartavia.com"],
  U2: ["easyjet.com"],
  FR: ["ryanair.com"],
  W6: ["wizzair.com"],
  VY: ["vueling.com"],
  EI: ["aerlingus.com"],
  VS: ["virginatlantic.com"],
  BA: ["britishairways.com"],
  AF: ["airfrance.com", "airfranceklm.com"],
  KL: ["klm.com", "airfranceklm.com"],
  IB: ["iberia.com"],
  AY: ["finnair.com"],
  LO: ["lot.com"],
  ME: ["mea.com.lb"],
  LY: ["elal.com"],
  RJ: ["rj.com"],
  KU: ["kuwaitairways.com"],
  WY: ["omanair.com"],
  GF: ["gulfair.com"],
  SV: ["saudia.com", "saudiairlines.com"],
  MS: ["egyptair.com"],
  KQ: ["kenya-airways.com"],
  WB: ["rwandair.com"],
  CM: ["copaair.com"],
  AM: ["aeromexico.com"],
  AR: ["aerolineas.com.ar"],
  LA: ["latamairlines.com"],
  NZ: ["airnewzealand.com", "airnewzealandnewsroom.com"],
  QF: ["qantas.com", "qantasnewsroom.com.au"],
  VA: ["virginaustralia.com"],
  FJ: ["fijiairways.com"],
  TN: ["airtahitinui.com"],
  CA: ["airchina.com.cn"],
  CI: ["china-airlines.com"],
  BR: ["evaair.com"],
  OZ: ["flyasiana.com"],
  KE: ["koreanair.com"],
  TG: ["thaiairways.com"],
  MH: ["malaysiaairlines.com"],
  GA: ["garuda-indonesia.com"],
  VN: ["vietnamairlines.com"],
  PR: ["philippineairlines.com"],
  "5J": ["cebupacificair.com"],
  JT: ["lionair.co.id"],
  ID: ["batikair.com"],
  PG: ["bangkokair.com"],
  QH: ["bambooairways.com"],
  VZ: ["vietjetair.com"],
  AC: ["aircanada.com"],
  WS: ["westjet.com"],
  G4: ["allegiantair.com"],
  AS: ["alaskaair.com"],
  DL: ["delta.com"],
  UA: ["united.com"],
  EK: ["emirates.com"],
  EY: ["etihad.com"],
  QR: ["qatarairways.com"],
  TK: ["turkishairlines.com"],
  AI: ["airindia.com"],
  "6E": ["goindigo.in"],
  SG: ["spicejet.com"],
  SQ: ["singaporeair.com"],
  CX: ["cathaypacific.com"],
  HX: ["hongkongairlines.com"],
  Y8: ["suparna.cn"],
  G5: ["cexpressair.com"],
  N4: ["nordwindairlines.ru"]
};

function bare(url: string): string {
  const m = url.match(/^https?:\/\/([^/]+)/i);
  return m ? m[1].toLowerCase().replace(/^www\./, "").replace(/^m\./, "") : "";
}

// An archive.org citation is only as good as the page it captured, so classify the captured URL.
function unwrap(url: string): string {
  const m = url.match(/^https?:\/\/web\.archive\.org\/web\/[^/]+\/(https?:\/\/.+)$/i);
  return m ? m[1] : url;
}

export function hostOf(url: string): string {
  return bare(unwrap(url));
}

function on(list: string[], host: string): boolean {
  return list.some((d) => host === d || host.endsWith(`.${d}`));
}

// "Turkish Airlines" -> ["turkishairlines", "turkish"], so turkishairlines.com counts and a blog
// that merely mentions the airline does not.
function airlineTokens(name: string): string[] {
  const clean = name.toLowerCase().replace(/[^a-z0-9 ]/g, "");
  const joined = clean.replace(/ /g, "");
  const first = clean.split(" ")[0];
  return [joined, first].filter((t) => t.length >= 4);
}

export function sourceKind(url: string, airline: string, code?: string): SourceKind {
  const host = hostOf(url);
  if (!host) return "other";
  const owned = code ? AIRLINE_DOMAINS[code.toUpperCase()] : undefined;
  if (owned && on(owned, host)) return "airline";
  if (on(PROVIDER_DOMAINS, host)) return "provider";
  if (on(REFERENCE_DOMAINS, host)) return "reference";
  if (on(TRADE_DOMAINS, host)) return "trade";
  if (on(BLOG_DOMAINS, host)) return "blog";
  if (on(NEWS_DOMAINS, host)) return "news";
  const label = host.split(".")[0];
  if (airlineTokens(airline).some((t) => host.includes(t) || t.includes(label))) return "airline";
  return "other";
}

export const PRIMARY: SourceKind[] = ["airline", "provider"];
export const CORROBORATING: SourceKind[] = ["trade", "news"];
