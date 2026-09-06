<?php
/**
 * Plugin Name: Hello World Code Studio
 * Description: Programming-language search and editor with JavaScript execution and optional private Firestore drafts. Embed with [hello_world_code_studio].
 * Version: 1.1.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: Hello World Code Studio
 * License: GPL-2.0-or-later
 * Text Domain: hello-world-code-studio
 */
if (!defined('ABSPATH')) { exit; }

function hwcs_sanitize_config($input) {
    $old = get_option('hwcs_firebase_config', '');
    if (!is_string($input)) { return $old; }
    $input = trim($input);
    if ($input === '') { return ''; }
    $decoded = json_decode($input, true);
    if (!is_array($decoded)) {
        add_settings_error('hwcs_firebase_config', 'invalid_json', 'Enter a valid JSON object, not JavaScript or a service-account file.');
        return $old;
    }
    $allowed = array('apiKey', 'authDomain', 'projectId', 'appId', 'storageBucket', 'messagingSenderId', 'measurementId');
    foreach ($decoded as $key => $value) {
        if (!in_array($key, $allowed, true) || !is_string($value) || strlen($value) > 512 || strpos($value, 'PRIVATE KEY') !== false) {
            add_settings_error('hwcs_firebase_config', 'invalid_field', 'Only public Firebase web app configuration fields are allowed. Never enter private keys or service-account credentials.');
            return $old;
        }
    }
    foreach (array('apiKey', 'authDomain', 'projectId', 'appId') as $required) {
        if (empty($decoded[$required]) || trim($decoded[$required]) === '') {
            add_settings_error('hwcs_firebase_config', 'missing_field', 'Configuration requires apiKey, authDomain, projectId, and appId.');
            return $old;
        }
    }
    return wp_json_encode($decoded, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
}
add_action('admin_init', function () {
    register_setting('hwcs_settings', 'hwcs_firebase_config', array(
        'type' => 'string', 'sanitize_callback' => 'hwcs_sanitize_config', 'default' => '', 'show_in_rest' => false,
    ));
});
add_action('admin_menu', function () {
    add_options_page('Hello World Code Studio', 'Hello World Code Studio', 'manage_options', 'hello-world-code-studio', 'hwcs_settings_page');
});
function hwcs_settings_page() {
    if (!current_user_can('manage_options')) { return; }
    ?>
    <div class="wrap">
        <h1>Hello World Code Studio</h1>
        <p>The app is served directly at your site homepage, without the WordPress theme wrapper. The old query-string address redirects to the homepage.</p>
        <h2>Firebase setup</h2>
        <ol>
            <li>Create a Firebase web app and a Cloud Firestore database.</li>
            <li>Enable Anonymous sign-in under Firebase Authentication. Add this site's domain to authorized domains.</li>
            <li>Deploy the included <code>firestore.rules</code> to your project before enabling cloud storage.</li>
            <li>Paste the public web app configuration below as JSON. Empty configuration disables cloud storage.</li>
        </ol>
        <p>Only public Firebase web configuration belongs here. It is sent to visitors' browsers. Never paste a service-account file or private key.</p>
        <?php settings_errors('hwcs_firebase_config'); ?>
        <form method="post" action="options.php">
            <?php settings_fields('hwcs_settings'); ?>
            <label for="hwcs-config"><strong>Firebase web configuration (JSON)</strong></label><br>
            <textarea id="hwcs-config" name="hwcs_firebase_config" rows="12" class="large-text code" spellcheck="false"><?php echo esc_textarea(get_option('hwcs_firebase_config', '')); ?></textarea>
            <?php submit_button(); ?>
        </form>
        <h2>Privacy and hosting</h2>
        <p>Local drafts stay in browser storage. Cloud Save sends the selected draft to your Firebase project after authenticating with an anonymous Firebase identity. Cloud Load retrieves only that identity's drafts. This is separate from WordPress login, and is not cross-device sync. Clearing browser data can lose access to anonymous cloud drafts.</p>
        <p>Firebase libraries are loaded from Google's CDN only when a visitor uses a cloud control. Google Fonts is used for typography. Document these third-party services in your privacy policy. Firestore usage is billed to your Firebase project under its plan.</p>
        <p><a href="<?php echo esc_url(home_url('/')); ?>" target="_blank" rel="noopener">Open full-page app</a></p>
    </div>
    <?php
}
add_shortcode('hello_world_code_studio', function ($attributes) {
    $attributes = shortcode_atts(array('height' => '1100'), $attributes, 'hello_world_code_studio');
    $height = max(600, min(2400, absint($attributes['height'])));
    $src = home_url('/');
    return '<iframe title="Hello World programming language search and code editor" src="' . esc_url($src) . '" width="100%" height="' . esc_attr($height) . '" style="display:block;width:100%;border:0;border-radius:12px;" loading="lazy" allow="clipboard-write"></iframe>';
});
// Serve the app itself at the homepage, without a theme wrapper or iframe.
add_action('template_redirect', function () {
    if (isset($_GET['hello_world_app'])) {
        $target = home_url('/');
        foreach (array('q', 'category', 'sort') as $key) {
            if (isset($_GET[$key]) && is_string($_GET[$key])) {
                $target = add_query_arg($key, sanitize_text_field(wp_unslash($_GET[$key])), $target);
            }
        }
        wp_safe_redirect($target, 301);
        exit;
    }
    if (!is_front_page() || is_feed()) { return; }
    if (!defined('DONOTCACHEPAGE')) { define('DONOTCACHEPAGE', true); }
    $file = plugin_dir_path(__FILE__) . 'assets/index.html';
    if (!is_readable($file)) { wp_die('Code Studio assets are missing. Reinstall the complete plugin ZIP.'); }
    $html = file_get_contents($file);
    $assets = plugin_dir_url(__FILE__) . 'assets/';
    $url = home_url('/');
    $html = str_replace('href="./"', 'href="' . esc_url($url) . '"', $html);
    $html = str_replace('href="style.css"', 'href="' . esc_url($assets . 'style.css') . '"', $html);
    foreach (array('firebase-config.js', 'run-sandbox.js', 'app.js') as $script) {
        $html = str_replace('src="' . $script . '"', 'src="' . esc_url($assets . $script) . '"', $html);
    }
    $config = json_decode(get_option('hwcs_firebase_config', ''), true);
    $encoded = wp_json_encode($config ?: null, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
    $html = str_replace('</head>', '<link rel="canonical" href="' . esc_url(home_url('/')) . '"><script>window.HELLO_WORLD_FIREBASE=' . $encoded . ';</script></head>', $html);
    status_header(200);
    nocache_headers();
    header('Content-Type: text/html; charset=UTF-8');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    // This is the bundled document, with all dynamic URLs and JSON escaped above.
    echo $html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    exit;
}, 0);
