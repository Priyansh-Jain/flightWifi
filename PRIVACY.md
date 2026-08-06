# FlightWifi Privacy Policy

Last updated: 7 August 2026

FlightWifi is a browser extension that shows in-flight wifi quality verdicts on flight search results on Google Flights and Skyscanner.

## Data collection

FlightWifi collects **no data of any kind**.

- No personal information, no account, no sign-up
- No analytics, no telemetry, no crash reporting
- No cookies and no local storage: the extension does not request the storage permission at all
- No browsing history: the extension only runs on the flight search pages listed in its manifest

## How it works

All processing happens locally in your browser. The extension reads the flight information already displayed in your own tab (airline, aircraft type, departure and arrival times) and, on Google Flights, the search response the page itself already fetched. It compares that against a wifi registry bundled inside the extension package and draws a small verdict chip next to each flight.

Nothing you search for, view, or hover over ever leaves your machine. The extension makes **no network requests of its own** to any server, including ours; it has no server.

## Permissions

The extension requests no API permissions. Its only access is content scripts on the flight search pages it annotates:

- `www.google.com/travel/flights*`
- `www.skyscanner.net`, `www.skyscanner.com`, `www.skyscanner.co.uk`, `www.skyscanner.co.in` under `/transport/flights/*`

## Third parties

No data is sold, shared, or transferred to anyone, because no data is collected in the first place.

## Changes

If a future version ever changes any of the above, this policy and the extension's Chrome Web Store privacy disclosures will be updated before that version ships.

## Contact

Questions: open an issue at https://github.com/Priyansh-Jain/flightWifi/issues
