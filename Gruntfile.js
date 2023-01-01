module.exports = grunt => {

  grunt.initConfig({
    // pug task src: https://github.com/yussan/grunt-pug-sass-skeleton/

    pug: {
        templates: {
            options: {
              // Pug i18n specific options
              i18n: {
                locales: 'locales/*.json',
                namespace: '$i18n',
                defaultExt: '.html'
              },
              // Pug specific options
              pretty: true,
              localeExtension: true,
            },
            files: {
              "docs/index.html": ["src/pug/index.pug"],
              "docs/privacy-ios.html": ["src/pug/privacy-ios.pug"],
              "docs/support.html": ["src/pug/support.pug"],
            }
          }
        },

    //    //sass task
    run: {
        run: {
            options: {
                failOnError: true,
                itterable: true
              // Task-specific options go here.
            },
//            cmd: 'node',
          args: [
                'scripts/build-scss.js'
              ]
            }

    },

    // copy task (copy src/libraries to docs/libraries)
    copy: {
      library: {
        expand: true,
        cwd: 'src',
        src: ['assets/**'],
        dest: 'docs/'
      },
      redirect: {
        expand: true,
        cwd: 'src',
        src: ['index.html'],
        dest: 'docs/'
      },

    },

    // image compress task (compress all image src/images to docs/images)
    imagemin : {
      dynamic: {
          files: [{
              expand: true,
              cwd: 'src/',
              src: ['assets/**/*.{png,jpg,gif}'],
              dest: 'docs'
          }]
      }
    },

    //minify css (only tun in production)
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'docs/css',
          src: ['*.css', '!*.min.css'],
          dest: 'docs/css',
          ext: '.css'
        }]
      }
    },

    // auto refresh view on change in docs directory
    browserSync: {
      dev: {
        bsFiles: {
            src : [
                'docs/**.*',  'docs/**/index.html'
            ]
        },
        options: {
            watchTask: true,
            server: './docs/'
        }
      }
    },

    // watch change inside directory to run task
    watch: {
      pug: {
        files: ['src/pug/**/*.pug', 'locales/*.json'],
        tasks: ['pug']
      },
      run: {
        files: ['src/scss/**/*.scss'],
        tasks: ['run']
      },
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['babel']
      },
      babel: {
         files: ['src/js/**/*.js'],
         tasks: ['babel']
       },
      copy: {
        files: ['src/assets/**'],
        tasks: ['copy']
      },
      imagemin: {
        files: ['src/assets/**'],
        tasks: ['imagemin']
      }
    },

    // babel
    babel: {
      options: {
        sourceMap: false
      },
      docs: {
        files: {
          'docs/js/scripts.js': 'src/js/scripts.js'
        }
      }
    },
    pugi18n: {
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
            "docs": ["src/pug/*.pug", "src/pug/includes/*.pug"]
          }
        }
      }
  });

  // initial
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-pug-i18n');
  //register default task
  if(process.env.NODE_ENV == 'production')
  {
    grunt.registerTask('default', ['pug', 'run', 'copy', 'imagemin', 'cssmin', 'babel'])
  }else
  {
    grunt.registerTask('default', ['pug', 'run', 'copy', 'imagemin', 'browserSync', 'babel', 'watch'])
  }
};

