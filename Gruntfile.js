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
                    "docs/challenge.html": ["src/pug/challenge.pug"],
                    "docs/faq.html": ["src/pug/faq.pug"],
                    "docs/terms.html": ["src/pug/terms.pug"],
                    "docs/press.html": ["src/pug/press.pug"],
                }
            }
        },

        //    //sass task
        run: {
            css: {
                options: {
                    failOnError: true,
                    itterable: true
                },
                args: [
                    'scripts/build-css.js'
                ]
            },
            tailwind: {
                options: {
                    failOnError: true
                },
                args: [
                    'scripts/build-tailwind.js'
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
            // Copy service worker and lazy modules
            serviceworker: {
                expand: true,
                cwd: 'src',
                src: ['sw.js', 'js/modules/**/*.js', 'js/lazy-loader.js'],
                dest: 'docs/'
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
                src: ['robots.txt', 'llms.txt', 'CNAME', 'c3f8b2d0e3b24d9d48250bbf9b6bbe58b81c398b6b11e23b24b5e8799a061ee5.txt'],
                dest: 'docs/'
            },


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

        // PurgeCSS to remove unused CSS from Bootstrap
        purgecss: {
            target: {
                options: {
                    content: [
                        'docs/**/*.html',
                        'docs/js/**/*.js',
                        'src/pug/**/*.pug'
                    ],
                    safelist: {
                        standard: [
                            // Bootstrap dynamic classes
                            /^modal/,
                            /^fade/,
                            /^show/,
                            /^bs-/,
                            /^collaps/,
                            /^carousel/,
                            // Custom animations
                            /^loading/,
                            /^timer-loading/,
                            /^video/,
                            // Icons
                            /^bi-/,
                            // FAQ accordion components
                            /^faq/
                        ],
                        deep: [
                            /^device/,
                            /^screen/,
                            /^gradient/
                        ]
                    }
                },
                files: {
                    'docs/css/styles.css': ['docs/css/styles.css']
                }
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
                tasks: ['babel', 'copy', 'run:css', 'run:tailwind', 'pug']
            },
            css: {
                files: ['src/css/**/*.css'],
                tasks: ['run:css']
            },
            tailwind: {
                files: ['src/css/**/*.css', 'tailwind.config.js'],
                tasks: ['run:tailwind']
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

        },
        // Sitemap generation with SEO-optimized settings
        sitemap: {
            dist: {
                pattern: ['docs/en/**/*.html', 'docs/fr/**/*.html'],
                siteRoot: 'docs/',
                changefreq: 'weekly',
                priority: 0.8,
                extension: {
                    required: true,
                    trailingSlash: false
                }
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
                    'docs/js/scripts.js': 'src/js/scripts.js',
                    'docs/js/lazy-loader.js': 'src/js/lazy-loader.js',
                    'docs/js/modules/language-detector.js': 'src/js/modules/language-detector.js'
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
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-pug-i18n');
    grunt.loadNpmTasks('grunt-sitemap');
    grunt.loadNpmTasks('grunt-purgecss');
    
    // Register task to set English as default language
    grunt.registerTask('set-default-language', 'Set English as default language at root', function() {
        const done = this.async();
        const exec = require('child_process').exec;
        exec('node scripts/setup-default-language.js', function(err, stdout, stderr) {
            if (err) {
                grunt.log.error('Error setting default language:', err);
                done(false);
            } else {
                grunt.log.writeln(stdout);
                done();
            }
        });
    });
    
    //register default task
    if (process.env.NODE_ENV == 'production') {
        grunt.registerTask('default', ['pug', 'run:css', 'run:tailwind', 'copy', 'sitemap', 'cssmin', 'purgecss', 'babel', 'set-default-language'])
        grunt.registerTask('build:optimized', ['pug', 'run:css', 'run:tailwind', 'copy:library', 'copy:optimized', 'copy:serviceworker', 'copy:robots', 'sitemap', 'cssmin', 'purgecss', 'babel', 'set-default-language'])
        grunt.registerTask('build:serviceworker', ['pug', 'run:css', 'run:tailwind', 'copy', 'sitemap', 'cssmin', 'purgecss', 'babel', 'set-default-language'])
    } else {
        grunt.registerTask('default', ['pug', 'run:css', 'run:tailwind', 'copy', 'sitemap', 'browserSync', 'babel', 'set-default-language', 'watch'])
    }
};

