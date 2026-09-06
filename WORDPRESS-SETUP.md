# Version 1.1: standalone homepage

The plugin now renders the app directly at the WordPress homepage with no theme header, footer, or outer iframe. Keep Hello World Code Studio selected as the static homepage in Settings → Reading. It remains the single published WordPress page backing the clean root URL. Legacy `?hello_world_app=1` links redirect to `/`, preserving search filters. Exclude the homepage from host/CDN full-page caching if configured; the plugin sets `DONOTCACHEPAGE` and no-cache response headers. Purge any pre-existing cached homepage after updating.

The original installation and Firebase instructions follow. The clean homepage supersedes instructions below about the iframe/query-string full-page route.

# Publish Hello World Code Studio on WordPress

## What is included

An installable plugin that embeds the programming-language search, 40-language editor, JavaScript runner, local draft autosave, and optional Firestore cloud save/load. It works through a shortcode and keeps the application in its own iframe to avoid theme CSS conflicts. No theme replacement is needed.

This is a plugin ZIP for a WordPress installation that permits custom plugin uploads. It is not a WordPress.org directory submission or an automatically published site. Firebase resources and WordPress hosting must already exist or be created by the site owner.

## Install and publish

1. Upload `dist/hello-world-code-studio.zip` under **Plugins → Add New Plugin → Upload Plugin** and activate it.
2. Open **Settings → Hello World Code Studio**.
3. To publish without cloud storage, leave Firebase configuration blank; the editor and JavaScript runner still work.
4. Add a **Shortcode** block to a WordPress page and enter `[hello_world_code_studio]`.
5. Preview the page, then publish it. Optional iframe height: `[hello_world_code_studio height="1200"]` (600–2400 pixels).
6. The settings page also links to a full-page app at `https://YOUR-SITE/?hello_world_app=1`.

## Configure Firestore

1. Create or select a Firebase project. Register a **Web app** in Project Settings.
2. Create a Cloud Firestore **default database**. Enable **Anonymous** under Authentication → Sign-in method. Add your WordPress hostname to Authentication's authorized domains.
3. In Firestore → Rules, deploy the contents of `firestore.rules`. If your project already hosts other apps, merge the `helloWorldUsers` match into your existing rules rather than replacing them blindly. Remove any overlapping broad allow-all rule: Firestore permissions are additive.
4. Alternatively, from a directory containing `firebase.json` and `firestore.rules`, use an already-installed Firebase CLI: `firebase deploy --only firestore:rules --project YOUR_PROJECT_ID`.
5. Paste your Firebase **public web configuration as JSON** into the plugin settings and save. Example structure (replace every placeholder):

```json
{
  "apiKey": "YOUR_PUBLIC_WEB_API_KEY",
  "authDomain": "YOUR_PROJECT.firebaseapp.com",
  "projectId": "YOUR_PROJECT_ID",
  "appId": "YOUR_WEB_APP_ID",
  "messagingSenderId": "YOUR_SENDER_ID",
  "storageBucket": "YOUR_BUCKET"
}
```

Do not paste `const firebaseConfig = ...`, a service-account JSON file, or private keys. The plugin rejects unknown fields and publishes only web configuration. Security comes from Firebase Authentication and Firestore rules, not from hiding the public API key.

## Cloud storage behavior

- Cloud Save and Cloud Load are explicit actions. Local edits continue autosaving locally and are not automatically uploaded.
- First cloud use lazily loads Firebase SDK 12.18.0 from Google's CDN and signs into an anonymous Firebase identity. Existing persisted identity is reused.
- Each language has one latest cloud draft under `helloWorldUsers/{firebaseUid}/drafts/{encodedLanguageName}` with `language`, `filename`, `code`, and server `updatedAt` fields.
- Rules permit access only to the matching authenticated UID and validate fields and a 100,000-character code limit. Other collections remain denied by this file.
- Successful saves are reported only after server acknowledgement. Load requests read from the server, so an offline cache is not presented as a fresh cloud copy.
- Loading a different cloud draft asks before replacing the editor. Edits or language switches during the request cancel replacement.
- Anonymous identity is **not a WordPress user account**. There is no email login, account recovery, sharing, or cross-device sync. Clearing browser data or deleting anonymous accounts can lose access. Download important work.
- Cloud use sends code and anonymous identity data to your Firebase project. Add Firebase and Google Fonts to your site's privacy disclosures. No Firebase Analytics is initialized.
- Configure usage monitoring and appropriate Firebase protections for your traffic before public launch. The shipped rules restrict ownership, but do not impose per-user billing quotas.

## Verify before launch

1. Install on a WordPress staging site (PHP 7.4+; WordPress 6.0+), add the shortcode, and check desktop/mobile display.
2. Run JavaScript: confirm `Hello, World!`, an exception, and the 5-second infinite-loop timeout.
3. Save a unique draft to cloud, change local code, then load and confirm the original returns.
4. Reload and confirm the persisted anonymous identity can load its draft.
5. In another browser/private session, confirm there is no access to the original identity's cloud draft. Validate cross-user denial in the Firebase Rules Playground or emulator.
6. Disable connectivity and check cloud error feedback; local editing and downloads should continue.
7. Confirm your security/cache plugins do not block the `hello_world_app` document, `run-worker.js`, `.mjs` JavaScript assets, or Firebase endpoints. Serve `.mjs` as JavaScript (`text/javascript` or `application/javascript`). Exclude `?hello_world_app=1` from full-page caching after configuration changes.
8. JavaScript runs inside an opaque-origin sandbox and worker with network requests blocked. It cannot access the WordPress DOM, cookies, or storage. Only JavaScript runs in-browser. Other languages download for execution with their own runtimes.

## Standalone development and rebuilding

For standalone cloud setup, edit `firebase-config.js` to set `window.HELLO_WORLD_FIREBASE` to your public configuration. Serve this folder over HTTP, e.g. `python3 -m http.server 8080 --bind 127.0.0.1`.

Run local checks with `node --test tests/firestore.test.mjs`. Build the release ZIP with `python3 tools/build-wordpress.py`. Application assets are copied into the plugin at build time. The builder substitutes an empty config so local Firebase settings are not distributed. Rebuild after changes.

Live WordPress installation, a real Firestore round-trip, and deployed security-rule behavior require your hosting and Firebase project; mock tests do not establish those deployment checks.

## Primary documentation

- WordPress shortcode API: https://developer.wordpress.org/apis/shortcode/
- WordPress Settings API: https://developer.wordpress.org/plugins/settings/using-settings-api/
- Firebase modular CDN setup: https://firebase.google.com/docs/web/alt-setup
- Firebase anonymous authentication: https://firebase.google.com/docs/auth/web/anonymous-auth
- Firestore field validation: https://firebase.google.com/docs/firestore/security/rules-fields
