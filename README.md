# Hello World Code Studio

Programming-language search and code editor, published at **https://zip1.ai/**.

- Search 40 languages by name, alias, extension, category, or syntax.
- Edit examples with per-language local drafts; copy or download files.
- Run JavaScript in an isolated worker with output, errors, and a five-second timeout.
- Save and load private Firestore drafts using an anonymous Firebase identity.
- Publish as a WordPress plugin that renders the app directly at the site homepage.

## Local preview

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open http://127.0.0.1:8080. There is no frontend build step.

## Checks

```sh
node --test tests/firestore.test.mjs
node --check app.js
node --check run-sandbox.js
node --check run-worker.js
```

## Build the WordPress plugin

```sh
python3 tools/build-wordpress.py
```

Upload the generated `dist/hello-world-code-studio.zip` to WordPress. Generated plugin assets and ZIPs are excluded from Git; rebuild them from these sources.

See [WORDPRESS-SETUP.md](WORDPRESS-SETUP.md) for installation, Firebase configuration, and Firestore security rules.

## Firebase

`firebase-config.js` and `firebase-config.json` contain public web app configuration, not administrative credentials. WordPress stores the same public configuration in Settings → Hello World Code Studio. Never commit service-account keys or other private credentials.

Cloud drafts require Firebase Authentication with Anonymous sign-in enabled and deployed `firestore.rules`. The current project is `code-f58c5`; the last live connection check reported `auth/configuration-not-found`, so Authentication setup is still required. Local editing and JavaScript execution work without Firebase.

Anonymous cloud identity is specific to browser storage. It is separate from WordPress login and does not provide cross-device sync or account recovery.
