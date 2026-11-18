# IGA interest form setup

The public page is a three-step interest form. Submissions are disabled until the Sheet receiver is deployed and configured. It posts directly to the Apps Script web app and displays confirmation only after the server saves the row.

1. Create a private Google Sheet for responses. In the Sheet, open Extensions > Apps Script and replace the script with `google-apps-script.gs` from this folder.
2. Save, run `setup` in the editor, and authorize the requested access. This stores the destination Sheet ID in script properties.
3. Deploy > New deployment > Web app. Execute as the owner and allow anonymous visitors ("Anyone") so prospective students can submit without signing in. The endpoint accepts public submissions, so keep the Sheet private, monitor for spam, and restrict its editors. Do not put a credential in the repository.
4. Copy the deployed `/exec` URL into `interest/config.js` as `IGA_SUBMISSION_URL`, commit and push. Open the public form and perform a test submission, verify its row in the Sheet and then remove the test row.

The web app creates an `Interest` tab if needed. Student input is stored as text to prevent spreadsheet formula interpretation. Entries are subject to Google Apps Script quotas; this minimal receiver has no spam protection or duplicate suppression. Avoid sharing the Sheet publicly.

The country calling-code list is generated from the phonenumbers library (a Python port of Google libphonenumber). Country names are displayed by the browser’s Intl API. The form sends the selected calling code and local number as one phone field.
