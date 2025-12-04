#!/usr/bin/env bun
'use strict';

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const inputPath = path.resolve(__dirname, '../src/css/tailwind.css');
const outputPath = path.resolve(__dirname, '../docs/css/tailwind.css');

// Ensure output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Use PostCSS for GitHub Actions compatibility (avoids @parcel/watcher issues)
const command = `bunx postcss ${inputPath} -o ${outputPath} --env production`;

console.log('Building Tailwind CSS...');

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error('❌ Error building Tailwind CSS:', error);
        process.exit(1);
    }
    
    if (stderr) {
        console.error('Warnings:', stderr);
    }
    
    if (stdout) {
        console.log(stdout);
    }
    
    console.log('✅ Tailwind CSS built successfully');
});