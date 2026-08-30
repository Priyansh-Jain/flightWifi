# Uninstall feedback → Google Sheet

Written feedback from `/uninstall/` appends a row to a Google Sheet through an Apps Script web app.
The site is a static export with no API route, so this script is the only server involved.

Until `NEXT_PUBLIC_FEEDBACK_ENDPOINT` is set, the form falls back to opening a prefilled mail draft,
which only reaches you if the person presses send. Everything below replaces that with a real store.

## 1. Create the sheet and script

1. Create a Google Sheet. Name it anything; the script creates a `Feedback` tab itself.
2. In that sheet: **Extensions → Apps Script**.
3. Delete the placeholder `myFunction`, paste all of `Code.gs`, and save.
4. Optional: set `NOTIFY_EMAIL` at the top to your address to get an email per submission. Leave it
   as `""` and nothing is emailed.

## 2. Deploy it

1. **Deploy → New deployment**, and pick type **Web app**.
2. Set **Execute as: Me**.
3. Set **Who has access: Anyone**.
4. Deploy, then approve the permission prompt. It asks for Sheets access, plus Gmail if you set
   `NOTIFY_EMAIL`. The "unverified app" warning is expected for your own script: choose **Advanced →
   Go to (project)**.
5. Copy the **Web app URL**. It ends in `/exec`.

**Who has access must be "Anyone", not "Anyone with a Google account".** Uninstallers are anonymous
browsers, and the stricter setting silently rejects every submission.

## 3. Point the site at it

Set the URL as an environment variable in Vercel (Project → Settings → Environment Variables):

```
NEXT_PUBLIC_FEEDBACK_ENDPOINT=https://script.google.com/macros/s/AKfy.../exec
```

It is `NEXT_PUBLIC_` because the form posts from the browser, so treat the URL as public. Redeploy
the site afterwards: the value is inlined at build time, so an existing deployment will not pick it
up.

For local testing, put the same line in `web/.env.local` and restart `npm run dev`.

## 4. Test it

Open `/uninstall/`, choose **Something else**, type a sentence, and submit. A row should appear in
the `Feedback` tab within a few seconds.

If it does not, work through these in order:

- The deployment's access is **Anyone**, not "Anyone with a Google account".
- The URL ends in `/exec`, not `/dev`. The `/dev` URL requires a logged-in editor.
- The site was redeployed after the variable was set.
- You edited `Code.gs` after deploying. Apps Script keeps serving the deployed version: use
  **Deploy → Manage deployments → edit → Version: New version** to publish changes.

## How the request works, and what it costs you

The browser sends the POST as `text/plain` in `no-cors` mode. That is deliberate: Apps Script cannot
answer a CORS preflight, and `application/json` would trigger one and fail before the script ever
runs. `text/plain` is CORS-safelisted, so no preflight happens.

The trade-off is that the reply comes back opaque. **The page cannot tell whether the script
accepted the row.** It only detects an outright network failure, and falls back to the mail draft in
that case. A wrong URL or a mis-scoped deployment therefore looks like success to the user, which is
why step 4 is worth doing once for real.

## Notes

- The endpoint is public. Anyone who reads the site bundle can find the URL and post to it, so the
  script drops anything without `source: "uninstall"` and caps field lengths. Expect the occasional
  junk row rather than a clean feed.
- Text starting with `=`, `+`, `-` or `@` is prefixed with an apostrophe before it reaches a cell, so
  a submission cannot smuggle a live formula into your spreadsheet.
- The reason tally is separate and does not depend on any of this: it goes to Vercel Web Analytics
  as the `uninstall_reason` event, and still records when someone submits without writing anything.
