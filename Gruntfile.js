module.exports = function(grunt) {
    //grunt wrapper function
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
    //     ngAnnotate: {
				//     options: {
				//         singleQuotes: true
				//     },
				//     dist: {
			 //        files: [{
	   //              expand: true,
	   //              src: [
	   //              	'./crypto_analyzer/crypto/client/crypto/**/*.js',
	   //              	'!**/*.annotated.js'
	   //              ],
	   //              ext: '.annotated.js',
	   //              extDot: 'last'
	   //          }],
				//     }
				// },
		    browserify: {
	         dist: {
	            options: {
	               transform: [
	                  ['babelify', {
	                  	presets: ['es2015']
	                  }]
	               ]
	            },
	            files: {
	               './crypto_analyzer/crypto/static/crypto-client/app.js': ['./crypto_analyzer/crypto/client/crypto/**/*.js']
	            }
	         }
	      },
	      watch: {
					scripts: {
					  files: ['./crypto_analyzer/crypto/client/crypto/**/*.js'],
					  tasks: ['browserify', 'ngtemplates']
					}
	      },
        uglify: {
            app_js: { //target
                src: './crypto_analyzer/crypto/static/crypto-client/app.js',
                dest: './crypto_analyzer/crypto/static/crypto-client/app-min.js'
            },
            template_js: { //target
                src: './crypto_analyzer/crypto/static/crypto-client/templates.js',
                dest: './crypto_analyzer/crypto/static/crypto-client/templates-min.js'
            },
            paper_dashboard_js: { //target
                src: './crypto_analyzer/crypto/static/assets/js/paper-dashboard.js',
                dest: './crypto_analyzer/crypto/static/assets/js/paper-dashboard-min.js'
            },
            bootstrap_notify_js: { //target
                src: './crypto_analyzer/crypto/static/assets/js/bootstrap-notify.js',
                dest: './crypto_analyzer/crypto/static/assets/js/bootstrap-notify-min.js'
            },
            jquery_1_10_2_js: { //target
                src: './crypto_analyzer/crypto/static/assets/js/jquery-1.10.2.js',
                dest: './crypto_analyzer/crypto/static/assets/js/jquery-1.10.2-min.js'
            },
        },
        ngtemplates:  {
          app: {
          	cwd: './crypto_analyzer/crypto/client/crypto/',
            src: '**/*.html',
            dest: './crypto_analyzer/crypto/static/crypto-client/templates.js',
            options: {
            	module: 'cryptoApp',
        			htmlmin: {
        			  collapseBooleanAttributes:      true,
        			  collapseWhitespace:             true,
        			  removeAttributeQuotes:          true,
        			  removeComments:                 true,
        			  removeEmptyAttributes:          true,
        			  removeRedundantAttributes:      true,
        			  removeScriptTypeAttributes:     true,
        			  removeStyleLinkTypeAttributes:  true,
        			}
            }
          }
        },
        cssmin: {
          minify: {
            files: [{
              expand: true,
              cwd: './crypto_analyzer/crypto/static/assets/css/',
              src: ['**/*.css', '!**/*.min.css'],
              dest: './crypto_analyzer/crypto/static/assets/css/',
              ext: '.min.css'
            }]
          },
          options: {
            shorthandCompacting: false,
            roundingPrecision: -1
          },
          combine: {
            files: {
              './crypto_analyzer/crypto/static/assets/prod/css/app-all.min.css': ['!./crypto_analyzer/crypto/static/assets/css/**/*.min.css', './crypto_analyzer/crypto/static/assets/css/**/*.css']
            }
          }
        },
        concat: {
            options: {
              separator: ';',
            },
            dist: {
              src: ['./crypto_analyzer/crypto/static/assets/js/*.min.js', './crypto_analyzer/crypto/static/crypto-client/*.min.js'],
              dest: './crypto_analyzer/crypto/static/assets/js/app-all-min.js',
            },
        }
    });

    //load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-angular-templates');
    // grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-browserify');
    // grunt.loadNpmTasks("grunt-contrib-watch");

    //register grunt default task
    grunt.registerTask('default', ['ngtemplates', 'browserify', 'uglify', 'cssmin']);
    // grunt.registerTask('watch', ['watch']);
}
