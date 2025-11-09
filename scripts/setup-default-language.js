/**
 * Setup Default Language Script
 * Copies English version files to root level after build
 */

const fs = require('fs');
const path = require('path');

// Files to copy from /en/ to root
const filesToCopy = [
    'index.html',
    'documentation.html',
    'pricing.html',
    'challenge.html',
    'faq.html',
    'support.html',
    'privacy-ios.html',
    'terms.html',
    'post-register.html',
    'offline.html',
    'press.html'
];

// Source and destination directories
const sourceDir = path.join(__dirname, '../docs/en');
const destDir = path.join(__dirname, '../docs');

console.log('Setting up English as default language...');

// Copy each file and fix canonical URLs for root versions
filesToCopy.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);

    if (fs.existsSync(sourcePath)) {
        try {
            let content = fs.readFileSync(sourcePath, 'utf8');

            // Fix canonical URL: /en/[file] → /[file] for root versions
            if (file === 'index.html') {
                // Homepage: /en/ → / (root)
                content = content.replace(
                    '<link rel="canonical" href="https://sealf.ie/en/">',
                    '<link rel="canonical" href="https://sealf.ie/">'
                );
            } else {
                // Other pages: /en/[file].html → /[file].html
                content = content.replace(
                    `<link rel="canonical" href="https://sealf.ie/en/${file}">`,
                    `<link rel="canonical" href="https://sealf.ie/${file}">`
                );
            }

            fs.writeFileSync(destPath, content);
            console.log(`✓ Copied ${file} to root`);
        } catch (error) {
            console.error(`✗ Error copying ${file}:`, error.message);
        }
    } else {
        console.warn(`⚠ Source file not found: ${file}`);
    }
});

console.log('English default language setup complete!');