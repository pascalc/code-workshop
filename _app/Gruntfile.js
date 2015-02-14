/* global process */

module.exports = function (grunt) {

'use strict';
  
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-connect-proxy');

  /**
   * This is the configuration object Grunt uses to give each plugin its
   * instructions.
   */
  var taskConfig = {
    /**
     * This allows project to have different configuration settings for angular
     * depending on the currently set NODE_ENV. To change NODE_ENV issue this command,
     * $ export NODE_ENV=local
     */
    
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * `connect` is modular web server that allow us to serve static files (helps with testing/development)
     */

    connect: {
      server: {
        proxies: [],
        options: {
          port: 9000,
          hostname: '0.0.0.0',
          base: '..',
          open: false,
          middleware: function (connect, options) {
            var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
            return [
              // Include the proxy first
              function(req, res, options) {
                proxy(req, res, options);
              },
              // Serve static files.
              connect.static(options.base),
              // Make empty directories browsable.
              connect.directory(options.base)
            ];
          }
        }
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files.
     */
    delta: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true
      },

      files: {
        files: [
          '../**/*.html',
          '../**/*.css',
          '../**/*.js',
        ],
        tasks: []
      }
    }
  };

  grunt.initConfig(taskConfig);

  /**
   * Grunt tasks
   */
  
  grunt.renameTask('watch', 'delta');
  grunt.registerTask('watch', [
    'connect', 'delta'
  ]);
  grunt.registerTask('default', [ 'watch' ]);
};
