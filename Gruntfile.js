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
                    localeExtension: false,
                },
                files: {
                    "docs/index.html": ["src/pug/index.pug"],
                    "docs/privacy-ios.html": ["src/pug/privacy-ios.pug"],
                    "docs/support.html": ["src/pug/support.pug"],
                    "docs/post-register.html": ["src/pug/post-register.pug"],
                    "docs/documentation.html": ["src/pug/documentation.pug"],
                    "docs/pricing.html": ["src/pug/pricing.pug"],
                    "docs/terms.html": ["src/pug/terms.pug"],
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
            // Copy optimized images to docs
            optimized: {
                expand: true,
                cwd: 'src/assets/img/optimized',
                src: ['**/*.{webp,jpg,jpeg,png}'],
                dest: 'docs/assets/img/optimized/'
            },
            fr: {
                expand: true,
                cwd: 'docs/fr',
                src: ['**'],
                dest: 'docs/'
            },
            robots: {
                expand: true,
                cwd: 'src',
                src: ['robots.txt', 'CNAME'],
                dest: 'docs/'
            },


        },

        // image compress task (compress all image src/images to docs/images)
        imagemin: {
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

        // Critical CSS extraction for above-the-fold content
        critical: {
            index: {
                options: {
                    base: 'docs/',
                    css: ['docs/css/styles.css'],
                    width: 1200,
                    height: 900,
                    timeout: 30000,
                    ignore: {
                        atrule: ['@charset', '@import', '@font-face'],
                        rule: [/\.device/, /\.mockup/, /\.gradient/],
                        decl: function(node, value) {
                            return /url\(/.test(value);
                        }
                    }
                },
                src: 'docs/index.html',
                dest: 'docs/index.html'
            },
            'index-en': {
                options: {
                    base: 'docs/',
                    css: ['docs/css/styles.css'],
                    width: 1200,
                    height: 900,
                    timeout: 30000
                },
                src: 'docs/en/index.html',
                dest: 'docs/en/index.html'
            },
            'index-fr': {
                options: {
                    base: 'docs/',
                    css: ['docs/css/styles.css'],
                    width: 1200,
                    height: 900,
                    timeout: 30000
                },
                src: 'docs/fr/index.html',
                dest: 'docs/fr/index.html'
            }
        },

        // auto refresh view on change in docs directory
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'docs/**.*', 'docs/**/index.html'
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
                files: ['src/pug/**/*.pug'],
                tasks: ['pug']
            },
            pug18n: {
                files: [ 'locales/*.json'],
                tasks: ['babel', 'copy', 'run', 'pug']
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
            },

        },
        // sitemap as mutlitask
        sitemap: {

            dist: {
                pattern: ['docs/**/*.html'],
                siteRoot: 'docs/'
                , changefreq: 'weekly',
                extension: {
                    required: true,
                    trailingSlash: true
                },
            },
            //  pug: { siteRoot: 'docs/',tasks: ['pug']},
            //     copy: {
            //         siteRoot: 'docs/',
            //         tasks: ['copy']
            //       },
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
    grunt.loadNpmTasks('grunt-sitemap');
    //register default task
    if (process.env.NODE_ENV == 'production') {
        grunt.registerTask('default', ['pug', 'run', 'copy', 'sitemap', 'imagemin', 'cssmin', 'babel'])
        grunt.registerTask('build:optimized', ['pug', 'run', 'copy:library', 'copy:optimized', 'copy:robots', 'sitemap', 'imagemin', 'cssmin', 'babel'])
    } else {
        grunt.registerTask('default', ['pug', 'run', 'copy', 'sitemap', 'imagemin', 'browserSync', 'babel', 'watch'])
    }
};

