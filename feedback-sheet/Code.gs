var SHEET_NAME = "Feedback";
var NOTIFY_EMAIL = "";

function reply_() {
  var out = ContentService.createTextOutput('{"ok":true}');
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}

function sheet_() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Received", "Reason", "Detail", "Version", "Source"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Control characters are stripped with charCodeAt rather than a regex so the source stays free of
// escape sequences a paste can mangle. A note opening with = + - @ is a formula to Sheets rather
// than text, so it gets an apostrophe before it ever reaches a cell.
function clean_(value, max) {
  var text = (value === null || value === undefined) ? "" : String(value);
  var out = "";
  var i;
  var code;
  for (i = 0; i < text.length; i++) {
    code = text.charCodeAt(i);
    if (code < 32 || code === 127) {
      out = out + " ";
    } else {
      out = out + text.charAt(i);
    }
  }
  out = out.replace(/^\s+/, "");
  out = out.replace(/\s+$/, "");
  if (out.length > max) {
    out = out.substring(0, max);
  }
  var first = out.charAt(0);
  if (first === "=" || first === "+" || first === "-" || first === "@") {
    out = "'" + out;
  }
  return out;
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return reply_();
    }
    var data = JSON.parse(e.postData.contents);
    if (data.source !== "uninstall") {
      return reply_();
    }
    var reason = clean_(data.reason, 200);
    var detail = clean_(data.detail, 2000);
    if (!reason && !detail) {
      return reply_();
    }
    var version = clean_(data.version, 20);
    var source = clean_(data.source, 40);
    sheet_().appendRow([new Date(), reason, detail, version, source]);
    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        "FlightWifi uninstall: " + (reason || "no reason"),
        detail || "(no written detail)"
      );
    }
  } catch (err) {
    // The browser posts this opaquely and cannot read a reply, so a failure has nowhere to
    // surface; the sheet staying empty is the only signal, which is what SETUP.md tests for.
  }
  return reply_();
}

function doGet() {
  return reply_();
}
