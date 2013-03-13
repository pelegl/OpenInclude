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
  	  }	  
  	},
  	cssmin: {
  	  compress: {
  	    files: {
  	      "source/static/css/app.css": ["source/static/css/comm.css", "source/static/css/app.css"]
  	    }
  	  }
  	},
  	concat: {
  	  dist: {
  	    src: ["source/static/css/bootstrap.min.css", "source/static/css/app.css"],
  	    dest: "source/static/css/app.min.css"
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
  	cake : {
  	  build: {}
  	},
  	watch : {
  	   less: {
  	     files: ['source/less/*.less'],
  	     tasks: ['less', 'cssmin', 'concat', 'cake'],
  	     options: {
           interrupt: true
         }
  	   },
  	   handlebars: {
         files: ['source/views/**/.hbs'],
         tasks: ['handlebars', 'cake'],
         options: {
           interrupt: true
         }
       },
       coffee: {
         files: ['source/client/**/.coffee'],
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
  	}	
  });
  
  
  var spawn = require('child_process').spawn;
  grunt.registerMultiTask('cake', 'Test with Cakefile.', function(){    
    var done = this.async();
    var cakeTest = spawn('cake', ["build"]);
    cakeTest.stdout.on('data', function(data){ grunt.log.write(data.toString()); })
    cakeTest.on('exit', function(code){
       var forever = spawn('forever', ["restart", "build/app.js"]);
       forever.on('exit', function(code){ done(code); });        
    })
  });

  
  grunt.loadNpmTasks('grunt-contrib-concat'); 
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-coffee');  
  grunt.loadNpmTasks('grunt-contrib-watch');
  
  // Default task.    
  grunt.registerTask('default', ['less', 'cssmin', 'concat', 'coffee', 'handlebars']);
  
};
