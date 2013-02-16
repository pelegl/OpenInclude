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
	}
  });
  
  
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  // Default task.    
  grunt.registerTask('default', ['less:development', 'cssmin']);  
};
