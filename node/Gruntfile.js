/*global module:true*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        less: {
            development: {
                options: {
                    paths: ["source/less"]
                },
                files: {
                    "source/static/css/app.css": "source/less/app.less"
                }
            }
        },
        concat: {
            dist: {
                src: [
                    "source/static/css/bootstrap.min.css",
                    "source/static/css/app.css",
                    "source/static/css/datepicker.css",
                    "source/static/css/daterangepicker.css",
                    "source/static/markitup/skins/simple/style.css",
                    "source/static/markitup/sets/markdown/style.css"
                ],
                dest: "source/static/css/app.concat.css"
            }
        },
        cssmin: {
            compress: {
                files: {
                    "source/static/css/app.min.css": ["source/static/css/app.concat.css"]
                }
            }
        },
        coffee: {
            compile: {
                files: {
                    'source/static/js/app.js': ["source/client/helpers/*.coffee", "source/client/models/*.coffee", "source/client/collections/*.coffee", "source/client/views/**/**.coffee", "source/client/app.coffee"]
                },
                options: {
                    bare: true
                }
            }
        },
        uglify: {
            modules: {
                options: {
                    preserveComments: false,
                    wrap: false
                },
                files: {
                    'source/static/js/modules.min.js': [
                        "source/static/js/jquery-1.9.1.min.js",
                        "source/static/js/jquery.nicescroll.js",
                        "source/static/js/bootstrap.min.js",
                        "source/static/js/bootstrap-datepicker.js",
                        "source/static/js/date.js",
                        "source/static/js/daterangepicker.js",
                        "source/static/js/cookie.js",
                        "source/static/js/d3.min.js",
                        "source/static/js/humanize.js",
                        "source/static/js/underscore.js",
                        "source/static/js/backbone.min.js",
                        "source/static/js/backbone.paginator.js",
                        "source/static/js/backbone.syphon.js",
                        "source/static/js/dot.js",
                        "source/static/js/templates-dot.js",
                        "source/static/js/moment.js",
                        "source/static/js/moment-en.js",
                        "source/static/markitup/jquery.markitup.js",
                        "source/static/markitup/sets/markdown/set.js"
                    ]
                }
            },
            app: {
                options: {
                    preserveComments: false,
                    wrap: false,
                    sourceMap: 'source/static/js/app.map.js'
                },
                files: {
                    'source/static/js/app.min.js': ["source/static/js/app.js"]
                }
            }
        },
        cake: {
            build: {}
        },
        watch: {
            less: {
                files: ['source/less/*.less'],
                tasks: ['less', 'cssmin', 'concat', 'cake'],
                options: {
                    interrupt: true
                }
            },
            coffee: {
                files: ['source/client/**.coffee'],
                tasks: ['coffee', 'cake'],
                options: {
                    interrupt: true
                }
            },
            cake: {
                files: ['source/controllers/*.coffee', 'source/models/*.coffee', 'source/*.coffee'],
                tasks: ['cake'],
                options: {
                    interrupt: true
                }
            }
        },
        dotjs: {
            compile: {
                options: {
                    variable: 'dt',
                    requirejs: false,
                    node: false,
                    key: function (filename) {
                        var base = "source/views/partials/";
                        return filename.replace(base, "").replace(/\.dot$/, "");
                    }
                },
                src: ["source/views/partials/*.dot", "source/views/partials/**/*.dot"],
                dest: 'source/static/js/templates-dot.js'
            }
        }
    });


    var spawn = require('child_process').spawn;
    grunt.registerMultiTask('cake', 'Test with Cakefile.', function () {
        var done = this.async();
        var cakeTest = spawn('cake', ["build"]);
        cakeTest.stdout.on('data', function (data) {
            grunt.log.write(data.toString());
        })
        cakeTest.on('exit', function (code) {
            var forever = spawn('forever', ["restart", "build/app.js"]);
            forever.on('exit', function (code) {
                done(code);
            });
        })
    });


    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-dotjs');

    // Default task.
    grunt.registerTask('default', ['less', 'concat', 'cssmin', 'coffee', 'dotjs']);

};
