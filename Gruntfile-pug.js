module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-pug-i18n');
grunt.initConfig({
    pug: {
      templates: {
        options: {
          // Pug i18n specific options
          i18n: {
            locales: 'locales/*.json',
            namespace: '$i18n'
          },
          // Pug specific options
          pretty: true,
          localeExtension: true,
        },
        files: {
          "html": ["src/pug/*.pug", "src/pug/includes/*.pug"]
        }
      }
    }
  });
}
