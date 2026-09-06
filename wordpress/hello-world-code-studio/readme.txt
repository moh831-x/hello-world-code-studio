=== Hello World Code Studio ===
Requires at least: 6.0
Requires PHP: 7.4
Stable tag: 1.1.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Language search and code editor with JavaScript execution and optional private Firestore drafts.

== Installation ==
Upload and activate this plugin. Configure Firebase in Settings > Hello World Code Studio, then add [hello_world_code_studio] to a Shortcode block. See SETUP.md for security rules and setup instructions.

== External services ==
Optional cloud controls load Firebase JavaScript SDKs from www.gstatic.com and use Firebase Authentication and Cloud Firestore in the configured project. Code is uploaded only when Save to cloud is clicked. Cloud drafts are private to an anonymous Firebase identity. Google Fonts loads typography when the app opens. Firebase Analytics is not used.
Firebase terms: https://firebase.google.com/terms
Google privacy: https://policies.google.com/privacy

== Limitations ==
Only JavaScript executes in-browser. Other languages can be edited and downloaded. Anonymous cloud identity is browser-specific, separate from WordPress login, and cannot be recovered after browser storage is cleared. No live Firebase connection exists until the site administrator supplies configuration and deploys rules.

== Changelog ==
= 1.1.0 =
Serve the standalone app directly at the homepage; redirect legacy query-string links to the clean URL.
