const sh = require('shelljs');
const upath = require('upath');

const destPath = upath.resolve(upath.dirname(__filename), '../docs');

sh.rm('-rf', `${destPath}/*`)
console.log('✅ Build directory cleaned');

