#!/usr/bin/env node
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

// Use the Tailwind CLI directly
const command = `npx tailwindcss -i ${inputPath} -o ${outputPath} --minify`;

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