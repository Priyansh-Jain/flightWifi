# FlightWifi Privacy Policy

Last updated: 29 September 2026

FlightWifi is a browser extension that shows in-flight wifi quality verdicts on flight search results on Google Flights, Skyscanner and Rift.

## Data collection

FlightWifi collects **no data of any kind**.

- No personal information, no account, no sign-up
- No analytics, no telemetry, no crash reporting
- No cookies. The only things it stores are your per-site on/off switches and your light or dark theme choice, on this device
- No browsing history: the extension only runs on the flight search pages listed in its manifest

## How it works

All processing happens locally in your browser. The extension reads the flight information already displayed in your own tab (airline, aircraft type, departure and arrival times) and, on Google Flights, the search response the page itself already fetched. It compares that against a wifi registry bundled inside the extension package and draws a small verdict chip next to each flight.

The extension never contacts our servers while you browse; it has no server. On Skyscanner only, to name the plane on each flight in the results list, it asks Skyscanner for that flight's details, the same request Skyscanner's own page makes when you open a flight. That request goes only to Skyscanner and carries nothing beyond the search you are already looking at.

## Uninstalling

The one moment the extension reaches our site is the moment it stops running. If you uninstall it, Chrome opens `https://flightwifi.app/uninstall/` and passes the version number you had, so we can ask what went wrong.

- Answering is optional
- The site records which reason was chosen as an anonymous tally, using the cookieless page-view counter described at https://flightwifi.app/privacy/
- The form has an optional box for writing what went wrong; only what you type there is sent, only when you press Submit, and it lands in a private Google Sheet we own
- Nothing on that page is tied to you, to your searches, or to any flight you looked at
- Closing the tab sends nothing at all

Setting that page requires no additional permissions.

## Permissions

The extension requests three permissions, plus one optional site you can allow later. None of them reads, stores or sends anything about you:

- `storage` keeps your per-site on/off switches (Google Flights, Skyscanner, Rift) on this device only. The popup also remembers your light or dark theme choice on this device
- `activeTab` and `scripting` let the toolbar popup restart the extension on a flight search tab that was already open when the extension last updated. On Rift they are also how the verdicts appear when you click the icon there. They apply only to the tab you clicked the icon on, only at that moment, and never grant standing access to any site
- `rift.co` is an optional host permission. The extension runs on Rift by itself only if you allow it from the popup, and that access covers rift.co pages and nothing else. You can take it back at any time in Chrome's extension settings

Beyond that, its only access is content scripts on the flight search pages it annotates:

- `www.google.com/travel/flights*`
- `www.skyscanner.net`, `www.skyscanner.com`, `www.skyscanner.co.uk`, `www.skyscanner.co.in` under `/transport/flights/*`
- `rift.co`, only after you allow it from the popup

## Third parties

Nothing is ever sold, and the extension itself transfers nothing to anyone, because it collects nothing in the first place.

The uninstall page above is the one exception worth naming. Its anonymous reason tally goes to Vercel Web Analytics, and a note you choose to write goes into a Google Sheet we own. Both are storage providers acting for us, neither is an advertiser, and neither receives anything tying a submission to you.

## Changes

If a future version ever changes any of the above, this policy and the extension's Chrome Web Store privacy disclosures will be updated before that version ships.

## Contact

Questions: open an issue at https://github.com/Priyansh-Jain/flightWifi/issues
