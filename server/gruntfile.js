module.exports = function(grunt) {

    grunt.initConfig({
        nodemon: {
            dev: {
                script: './bin/www',
                options: {
                    env: {
                        DEBUG: '*,-express:*,-body-parser:*,-send:*,-morgan:*'
                    },
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('default', ['nodemon']);
};
