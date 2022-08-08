const sass = require('node-sass');
module.exports = grunt => {

  grunt.initConfig({
    // pug task src: https://github.com/yussan/grunt-pug-sass-skeleton/
    pug: {
      compile: {
        options: {
          data: {
            debug: true
          },
          pretty: true
        },
        files: [{
          src: '[^_]*.pug',
          cwd: 'src/pug/',
          dest: 'dist',
          expand: true,
          ext: '.html'
        }]
      }
    },

    sass: { // Task
        dist: {
            options: {
                      style: 'inline',
                      implementation: sass,
                     },
          files: [{
              // Set to true for recursive search
              expand: true,
              cwd: 'scss/',
              src: ['**/*.scss'],
              dest: 'css/',
              ext: '.css'
          }]
        }
     },
    //    // sass task
    // sass: {
    //   dist: {
    //     options: {
    //       style: 'inline',
    //       implementation: scss,
    //      },
    //     // files: [{
    //     //   src: '[^_]*.sass',
    //     //   cwd: 'src/scss/',
    //     //   dest: 'dist/css',
    //     //   expand: true,
    //     //   ext: '.css'
    //     // }]
    //     files: { "dist/css/styles.css" : [ "node_modules/bootstrap/scss/bootstrap.scss", "src/scss/*.scss"]}
    //   }
    // },

    // copy task (copy src/libraries to dist/libraries)
    copy: {
      library: {
        expand: true,
        cwd: 'src',
        src: ['assets/**'],
        dest: 'dist/'
      }
    },

    // image compress task (compress all image src/images to dist/images)
    imagemin : {
      dynamic: {
          files: [{
              expand: true,
              cwd: 'src/',
              src: ['assets/**/*.{png,jpg,gif}'],
              dest: 'dist'
          }]
      }
    },

    //minify css (only tun in production)
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'dist/css',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/css',
          ext: '.css'
        }]
      }
    },

    // auto refresh view on change in dist directory
    browserSync: {
      dev: {
        bsFiles: {
            src : [
                'dist/**.*'
            ]
        },
        options: {
            watchTask: true,
            server: './dist'
        }
      }
    },

    // watch change inside directory to run task
    watch: {
      pug: {
        files: ['src/pug/**/*.pug'],
        tasks: ['pug']
      },
      sass: {
        files: ['src/scss/**/*.scss'],
        tasks: ['sass']
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
      dist: {
        files: {
          'dist/js/scripts.js': 'src/js/scripts.js'
        }
      }
    }
  });

  // initial
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browser-sync');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-babel');

  //register default task
  if(process.env.NODE_ENV == 'production')
  {
    grunt.registerTask('default', ['pug', 'sass', 'copy', 'imagemin', 'cssmin', 'babel'])
  }else
  {
    grunt.registerTask('default', ['pug', 'sass', 'copy', 'imagemin', 'browserSync', 'babel', 'watch'])
  }
};

