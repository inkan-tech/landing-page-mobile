'use strict';

const fs = require('fs');
const path = require('path');
const packageJSON = require('../package.json');

const srcPath = path.resolve(__dirname, '../src/css/styles.css');
const destPath = path.resolve(__dirname, '../docs/css/styles.css');

// Ensure destination directory exists
const destDir = path.dirname(destPath);
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// Read source CSS file
const cssContent = fs.readFileSync(srcPath, 'utf8');

// Add header comment
const header = `/*!
* ${packageJSON.title} v${packageJSON.version} - Tailwind Migration (${packageJSON.homepage})
* Copyright 2013-${new Date().getFullYear()} ${packageJSON.author}
* Licensed under ${packageJSON.license}
* Minimal legacy CSS - Bootstrap-free
*/

`;

// Write to destination
fs.writeFileSync(destPath, header + cssContent);

console.log('✅ CSS copied successfully (Bootstrap-free)');