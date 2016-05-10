module.exports = function(grunt){

    grunt.initConfig({
        watch:{
            jade:{
                files:['views/**'],
                options:{
                    livereload:true
                }
            },
            js:{
                files:['public/js/**','models/**/*.js','schemas/**/*.js'],
                tasks:['jshint'],
                options:{
                    livereload:true
                }
            }
        },
        nodemon:{
            dev:{
                option:{
                    file:'app.js',
                    args:[],
                    ignoreFiles:['README.md','node_modules/**','.DS_Store'],
                    watchedExtensions:['js'],
                    watchedForders:['app','config'],
                    debug:true,
                    delayTime:1,
                    env:{
                        PORT:3000
                    },
                    cwd:__dirname

                }
            }
        },
        concurrent:{
            tasks:['nodemon','watch'],
            options:{
                logConcurrentOutput:true
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-nodemon')
    grunt.loadNpmTasks('grunt-concurrent')

    grunt.option('force',true)
    grunt.registerTask('default',['concurrent'])
}
