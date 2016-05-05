var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movies = require('./models/movie')
var port = process.env.PORT || 3000
var app = express()

mongoose.connect('mongodb://localhost/imooc')

var bodyParser = require('body-parser');

app.use(bodyParser.json())
app.set('views', "./views/pages/")
app.set('view engine', 'jade')
// app.use(bodyParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use("/static", express.static(path.join(__dirname, 'bower_components')))
app.use("/static", express.static(path.join(__dirname, 'assets')))
app.listen(port)

console.log("imooc started on port " + port)

//index page
app.get('/', function(req, res) {
    Movies.fetch(function(err, movies){
        console.log(movies);
        if(err){
            console.log(err);
        }else{
            res.render('index', {
                movies: movies
            })
        }
    })
})


//detail page
app.get('/movie/:id', function(req, res) {
    var id = req.params.id

    Movies.findById(id,function(err,movie){
        if(err){
            console.log(err);
        }else{
            res.render('detail', {
                title: 'imooc 详情页',
                movie: movie
            })
        }
    })
})

//admin page
app.get('/admin/movie', function(req, res) {
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
    Movies.fetch(function(err, movies){
        if(err){
            console.log(err);
        }else{
            res.render('list', {
                title: 'imooc 列表页',
                movies: movies
            })
        }
    })

})


//admin post movie
app.post('/admin/movie/new',function(req, res){
    //console.log(res.body+'========'+ req.body+'\n'+res.body.movie+"\n====================="+req.body.movie)

    var id = req.body.movie._id
    var movieObj = req.body.movie
    var _movie

    if(id !== 'undefined' ){
        Movies.findById(id, function(err, movie){
            if(err){
                console.log(err);
            }else{
                _movie = _.extend(movie,movieObj)
                _movie.save(function(err, movie){
                    if(err){
                        console.log(err);
                    }else{
                        res.redirect('/movie/' + movie._id)
                    }
                })
            }
        })
    }
    else{
        _movie = new Movies({
            director:movieObj.director,
            title:movieObj.title,
            country:movieObj.country,
            _id:+Date.now(),
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash: movieObj.flash
        })
        
        _movie.save(function(err, movie){
            if(err){
                console.log(err);
            }else{
                res.redirect('/movie/' + movie._id)
            }
        })
    }
})
//admin update movie
app.get('/admin/update/:id',function(req, res){
    var id = req.params.id

    if(id){
        Movies.findById(id, function(err, movie){
            if(err){
                console.log(err);
            }else{
                res.render('admin',{
                    title:"imooc 后台更新页",
                    movie:movie
                })
            }
        })
    }
    // res.render('update',{
    //
    // })
})
