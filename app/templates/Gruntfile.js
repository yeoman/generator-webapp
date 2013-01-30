'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var folderMount = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            coffee: {
                files: '<%%= yeoman.app %>/scripts/*.coffee',
                tasks: ['coffee']
            },
            compass: {
                files: '<%%= yeoman.app %>/styles/*.{scss,sass}',
                tasks: ['compass']
            },
            livereload: {
                files: [
                    '<%%= yeoman.app %>/*.html',
                    '{.tmp,<%%= yeoman.app %>}/styles/*.css',
                    '{.tmp,<%%= yeoman.app %>}/scripts/*.js',
                    '<%%= yeoman.app %>/images/*.{png,jpg,jpeg}'
                ],
                tasks: ['livereload']
            }
        },
        connect: {
            livereload: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            folderMount(connect, '.tmp'),
                            folderMount(connect, 'app')
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            folderMount(connect, '.tmp'),
                            folderMount(connect, 'test')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%%= connect.livereload.options.port %>'
            }
        },
        clean: {
            dist: ['.tmp', '<%%= yeoman.dist %>/*'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%%= yeoman.app %>/scripts/*.js',
                'test/spec/*.js'
            ]
        },
        mocha: {
            options: {
                run: true
            },
            all: ['test/**/*.html']
            // TOOD(sindresorhus): testing works locally now, but need to figure out how to make it work with the server
            //all: ['http://localhost:<%%= connect.test.options.port %>' + '/index.html']
        },
        coffee: {
            all: {
                files: {
                    '.tmp/scripts/coffee.js': '<%%= yeoman.app %>/scripts/*.coffee'
                }
            }
        },
        compass: {
            all: {
                options: {
                    sassDir: '<%%= yeoman.app %>/styles',
                    cssDir: '.tmp/styles',
                    imagesDir: '<%%= yeoman.app %>/images',
                    javascriptsDir: '<%%= yeoman.app %>/scripts/vendor',
                    fontsDir: '<%%= yeoman.app %>/styles/fonts',
                    importPath: '<%%= yeoman.app %>/components',
                    relativeAssets: true
                }
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/
        <% if (includeRequireJS) { %>// Example: https://github.com/jrburke/r.js/blob/master/build/example.build.js
        requirejs: {
            dist: {
                options: {
                    baseUrl: 'app/scripts',
                    optimize: 'uglify2',
                    generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict: true,
                    name: 'main',
                    out: 'dist/scripts/main.js',
                    wrap: true,
                    uglify2: {} // https://github.com/mishoo/UglifyJS2
                }
            }
        },<% } else { %>
        uglify: {
            dist: {
                files: {
                    '<%%= yeoman.dist %>/scripts/main.js': [
                        '.tmp/scripts/*.js',
                        '<%%= yeoman.app %>/scripts/*.js'
                    ],
                }
            }
        },<% } %>
        useminPrepare: {
            html: 'index.html'
        },
        usemin: {
            html: ['<%%= yeoman.dist %>/*.html'],
            css: ['<%%= yeoman.dist %>/styles/*.css']
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>/images',
                    src: '*.{png,jpg,jpeg}',
                    dest: '<%%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/*.css',
                        '<%%= yeoman.app %>/styles/*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    removeCommentsFromCDATA: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%%= yeoman.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: {
                    'dist/': [
                        'app/*.{ico,text}',
                        'app/.htaccess'
                    ]
                }
            }
        },
        bower: {
            rjsConfig: 'app/scripts/main.js'
        }
    });

    grunt.renameTask('regarde', 'watch');
    // remove when mincss task is renamed
    grunt.renameTask('mincss', 'cssmin');

    grunt.registerTask('server', [
        'clean:server',
        'coffee',
        'compass',
        'livereload-start',
        'connect:livereload',
        'open',
        'watch'
    ]);

    grunt.registerTask('test', [
        'clean:server',
        'coffee',
        'compass',
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'jshint',
        'test',
        'coffee',
        'compass',
        'useminPrepare',
        <% if (includeRequireJS) { %>'requirejs',<% } else { %>
        'uglify',<% } %>
        //'usemin',
        'imagemin',
        'cssmin',
        'htmlmin',
        'copy',
        'usemin'
    ]);

    grunt.registerTask('default', ['build']);
};
