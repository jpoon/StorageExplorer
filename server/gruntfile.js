module.exports = function(grunt) {

    grunt.initConfig({
        nodemon: {
            dev: {
                script: './bin/www',
                options: {
                    env: {
                        DEBUG: '*,-express:*'
                    },
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('default', ['nodemon']);
};
