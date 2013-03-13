/*global module:true*/
module.exports = function(grunt) {

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
	  },
	  production: {
	    options: {
	      paths: ["source/less"],
	      yuicompress: true
	    },
	    files: {
	     "source/static/css/app.css": "source/less/app.less"
	    }
	  }
	},
	cssmin: {
	  compress: {
	    files: {
	      "source/static/css/app.min.css": ["source/static/css/bootstrap.min.css", "source/static/css/comm.css", "source/static/css/app.css"]
	    }
	  }
	},
	coffee : {
		compile: {			
			files : {
				'source/static/js/app.js': ["source/client/helpers/*.coffee", "source/client/models/*.coffee", "source/client/collections/*.coffee", "source/client/views/*.coffee", "source/client/app.coffee"]	
			}			
		}
	},
	handlebars: {
		options: {
	      	namespace: "hbt",
	      	wrapped: true,	      	
	      	processPartialName: function(filename){
	      		var base = "source/views/partials/";
	      		return filename.replace(base, "").replace(/\.hbs$/, "");
	      	},
	      	partialRegex: /.*/
	    },
	    compile: {
	    	files: {	      	
		      	"source/static/js/templates.js": ["source/views/partials/*.hbs", "source/views/partials/**/*.hbs"]
		    }	
	    }	    
	},
	'dot-compile': {
	    compile: {
            options: {
                variable : 'dt',
                requirejs: false,
                node: false,
                key: function(filename) {
                    var base = "source/views/partials/";
                    return filename.replace(base, "").replace(/\.dot$/, "");
                }
            },
            src  : ["source/views/partials/*.dot", "source/views/partials/**/*.dot"],
            dest : 'source/static/js/templates-dot.js'
        }
    }
  });
  
  
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-dot-compiler');

  // Default task.    
  grunt.registerTask('default', ['less:development', 'cssmin', 'coffee', 'handlebars', 'dot-compile']);  
};
