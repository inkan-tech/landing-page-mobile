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
    'press.html',
    'challenge.html',
    'support.html',
    'privacy-ios.html',
    'terms.html',
    'post-register.html',
    'offline.html'
];

// Source and destination directories
const sourceDir = path.join(__dirname, '../docs/en');
const destDir = path.join(__dirname, '../docs');

console.log('Setting up English as default language...');

// Copy each file
filesToCopy.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    
    if (fs.existsSync(sourcePath)) {
        try {
            const content = fs.readFileSync(sourcePath, 'utf8');
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