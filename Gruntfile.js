module.exports = function(grunt) {
  // Project Config
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    
    ngconstant: {
      // Options for all targets
      options: {
        space: '  ',
        wrap: '"use strict";\n\n {%= __ngModule %}',
        name: 'config',
      },
      // Environment targets
      development: {
        options: {
          dest: '/scripts/config.js'
        },
        constants: {
          ENV: {
            name: 'development'          
          }
        }
      },
      production: {
        options: {
          dest: '/scripts/config.js'
        },
        constants: {
          ENV: {
            name: 'production'          
          }
        }
      }
    },
    
  });
  
  // Load the plugin that provides the uglify task
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  grunt.registerTask('serve', function(target){
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }
    grunt.task.run([
      'clean:server',
      'ngconstant:development',
      'connect:livereload',
      'watch'
    ]);
  });
  
  grunt.registerTask('build', [
    'clean:dist',
    'ngconstant:production'
  ]);
  
  // Default task(s)
  grunt.registerTask('default', ['uglify']);
  
};