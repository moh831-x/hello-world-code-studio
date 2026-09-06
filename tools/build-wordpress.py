"""Build an uploadable plugin ZIP from the standalone app sources."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import shutil

root = Path(__file__).resolve().parent.parent
plugin = root / 'wordpress/hello-world-code-studio'
assets = plugin / 'assets'
assets.mkdir(exist_ok=True)
for name in ['index.html', 'style.css', 'app.js', 'run-worker.js', 'run-sandbox.js', 'firebase-config.js', 'firestore.mjs']:
    # Never distribute a local project's Firebase configuration in a release ZIP.
    if name == 'firebase-config.js':
        (assets / name).write_text('window.HELLO_WORLD_FIREBASE = window.HELLO_WORLD_FIREBASE || null;\n')
    else:
        shutil.copy2(root / name, assets / name)
for name in ['firestore.rules', 'firebase.json']:
    shutil.copy2(root / name, plugin / name)
shutil.copy2(root / 'WORDPRESS-SETUP.md', plugin / 'SETUP.md')
output = root / 'dist/hello-world-code-studio.zip'
output.parent.mkdir(exist_ok=True)
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for path in sorted(plugin.rglob('*')):
        if path.is_file():
            archive.write(path, path.relative_to(plugin.parent))
print(f'Created {output} ({output.stat().st_size:,} bytes)')
