/** Run setup once from the Sheet-bound editor before deploying. */
function setup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!sheet) throw new Error('Open this script from the destination spreadsheet.');
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', sheet.getId());
}

function doPost(e) {
  const p = e.parameter || {};
  const exam = ['NRE','USMLE','PLAB','SMLE','EMREE','MOH','DHA','AMC'];
  const years = ['Year 1','Year 2','Year 3','Year 4','Year 5','Year 6','Year 7 or above','Graduated'];
  const clean = (value, max) => String(value || '').trim().slice(0, max);
  const name = clean(p.name,120), university = clean(p.university,160), level = clean(p.level,20), year = clean(p.year,20), phone = clean(p.phone,35), country = clean(p.country,100), email = clean(p.email,254);
  const valid = name && university && country && ['Undergraduate','Postgraduate'].includes(level) && years.includes(year) && exam.includes(p.exam) && /^[+0-9() .-]{7,35}$/.test(phone) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!valid) return HtmlService.createHtmlOutput('<h1>Unable to submit</h1><p>Please go back and check your details.</p>');
  // Force user-provided values to text so spreadsheet formulas cannot execute.
  const safe = value => "'" + value;
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    const ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
    const sheet = ss.getSheetByName('Interest') || ss.insertSheet('Interest');
    if (sheet.getLastRow() === 0) sheet.appendRow(['Received (UTC)','Exam','Name','University','Study level','Year of study','Phone','Country','Email']);
    sheet.appendRow([new Date(),p.exam,safe(name),safe(university),level,year,safe(phone),safe(country),safe(email)]);
    SpreadsheetApp.flush();
    return HtmlService.createHtmlOutput('<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Thank you | IGA</title><div style="font-family:system-ui;max-width:600px;margin:12vh auto;padding:24px;color:#14254a"><h1>Thank you!</h1><p>Your interest has been received. IGA can now follow up with you about your exam preparation.</p><a href="https://bryantfriend.github.io/DrJunaid/interest/">Return to the interest form</a></div>');
  } catch (error) {
    return HtmlService.createHtmlOutput('<h1>Unable to submit</h1><p>We could not save your response. Please go back and try again.</p>');
  } finally { if (lock.hasLock()) lock.releaseLock(); }
}
