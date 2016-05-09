var express = require('express')//minimalist web framework package
var mongoose = require('mongoose')//Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
var Movie = require('./models/movie')

var path = require('path')      //This is an exact copy of the NodeJS ’path’ module published to the NPM registry.
var _ = require('underscore')
var bodyParser = require('body-parser');//URL-encoded form body parser. code: bodyParser.urlencoded(options)

/**
* process.env#
* An object containing the user environment.
    An example of this object looks like:

    { TERM: 'xterm-256color',
      SHELL: '/usr/local/bin/bash',
      USER: 'maciej',
      PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
      PWD: '/Users/maciej',
      EDITOR: 'vim',
      SHLVL: '1',
      HOME: '/Users/maciej',
      LOGNAME: 'maciej',
      _: '/usr/local/bin/node'
    }
*/
//console.log(process.env.PORT);//undefined
var port = process.env.PORT || 3000

//Creates an Express application 'app'
var app = express()

//connect imooc db
mongoose.connect('mongodb://localhost/imooc')

//more info to http://expressjs.com/en/4x/api.html#app.settings.table
// for parsing application/json
app.use(bodyParser.json())
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
//设置view映射路径   A directory or an array of directories for the application's views.
app.set('views', "./views/pages/")

//The default engine extension to use when omitted.
app.set('view engine', 'jade')

//Mounts the specified middleware function or functions at the specified path. If path is not specified, it defaults to “/”.
app.use("/static", express.static(path.join(__dirname, 'public')))

//Binds and listens for connections on the specified host and port. This method is identical to Node’s http.Server.listen().
app.listen(port)

console.log("node server started on port " + port)

//Routes HTTP GET requests to the specified path with the specified callback functions.
//index page rout
app.get('/', function(req, res) {
    Movie.fetch(function(err, movies){
        console.log(movies);
        // if(err){
        //     console.log(err);
        // }else{
        //     res.render('index', {
        //         movies: movies
        //     })
        // }
        console.log("index - fetch method"+movies);
        if(err){
            console.log(err);
        }
        res.render('index', {
            movies: movies
        })
    })
})

//detail page
app.get('/movie/:id', function(req, res) {
    var id = req.params.id
    //schema movie object custom method
    // 根据记录id，查询一条记录
    Movie.findById(id,function(err,movie){
        // if(err){
        //     console.log(err);
        // }else{
        //     res.render('detail', {
        //         title: 'imooc 详情页',
        //         movie: movie
        //     })
        // }
        console.log("detail - findById method"+movie);

        if(err){
            console.log(err);
        }
        res.render('detail', {
            title: 'imooc 详情页',
            movie: movie
        })
    })
})

//admin page
app.get('/admin/movie', function(req, res) {
    //express framework callback res's method render view tpl
    res.render('admin', {
        title: 'imooc 后台录入页',
        movie: {
            director: "",
            country: "",
            title: "",
            year: '',
            poster: "",
            language: "",
            flash: "",
            summary: ""

        }
    })
})

//list page
app.get('/admin/list', function(req, res) {
    //schema movie's method
    //查询该数据库下所有记录
    Movie.fetch(function(err, movies){
        // if(err){
        //     console.log(err);
        // }else{
        //     res.render('list', {
        //         title: 'imooc 列表页',
        //         movies: movies
        //     })
        // }
        if(err){
            console.log(err);
        }
        res.render('list', {
            title: 'imooc 列表页',
            movies: movies
        })
    })

})


//admin post movie
app.post('/admin/movie/new',function(req, res){
    //console.log(res.body+'========'+ req.body+'\n'+res.body.movie+"\n====================="+req.body.movie)

    var id = req.body.movie._id
    var movieObj = req.body.movie
    var _movie

    if(id !== 'undefined' ){
        console.log("admin post movie id"+ id);
        Movie.findById(id, function(err, movie){
            // if(err){
            //     console.log(err);
            // }else{
            //     _movie = _.extend(movie,movieObj)
            //     _movie.save(function(err, movie){
            //         if(err){
            //             console.log(err);
            //         }else{
            //             res.redirect('/movie/' + movie._id)
            //         }
            //     })
            // }
            if(err){
                console.log(err);
            }
            _movie = _.extend(movie,movieObj)
            _movie.save(function(err, movie){
                // if(err){
                //     console.log(err);
                // }else{
                //     res.redirect('/movie/' + movie._id)
                // }
                if(err){
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id)
            })
        })
    }
    else{
        _movie = new Movie({
            director:movieObj.director,
            title:movieObj.title,
            country:movieObj.country,
            //_id:+Date.now()+'',
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash: movieObj.flash
        })

        _movie.save(function(err, movie){
            // if(err){
            //     console.log(err);
            // }else{
            //     res.redirect('/movie/' + movie._id)
            // }
            console.log("new submit movie "+movie)
            if(err){
                console.log(err);
            }
            res.redirect('/movie/' + movie._id)
        })
    }
})


//admin list remove
app.delete('/admin/list',function(req,res){
    var id = req.query.id
    if(id){
        Movie.remove({_id:id},function(err,movie){
            if(err){
                console.log(err)
            }
            else{
                res.json({success:1})
            }
        })
    }
})

//admin update movie
app.get('/admin/update/:id',function(req, res){
    var id = req.params.id

    if(id){
        Movie.findById(id, function(err, movie){
            // if(err){
            //     console.log(err);
            // }else{
            //     res.render('admin',{
            //         title:"imooc 后台更新页",
            //         movie:movie
            //     })
            // }
            if(err){
                console.log(err);
            }
            res.render('admin',{
                title:"imooc 后台更新页",
                movie:movie
            })
        })
    }
    // res.render('update',{
    //
    // })
})
