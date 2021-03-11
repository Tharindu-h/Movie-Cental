const express = require('express');
const app = express();
const pug = require('pug');
const fs = require("fs");
const session = require('express-session');
const logic = require("./server-side/business_logic");
const bodyParser = require('body-parser');
const mongoose =  require('mongoose');
const { searchUser } = require('./server-side/business_logic');
const { LOADIPHLPAPI } = require('dns');
const { json } = require('body-parser');
const { title } = require('process');



app.use(express.urlencoded({extended: true}));
app.set('view engine', 'pug');
app.use(session({
    cookie:{
        maxAge: 600000000
    },
    secret:"something"
}));
app.use('/', (req,res,next)=>{
    next()});

app.use('/style', express.static('style'));
app.use('/api/users/style', express.static('style'));
app.use('/api/movies/style', express.static('style'));
app.use('/api/people/style', express.static('style'));
app.use('http://localhost:3000/api/movies', express.static('style'));


const compiledLogin = pug.compileFile('./views/login.pug');
const compiledMyProf = pug.compileFile('./views/my_profile.pug');
const compiledUserProf = pug.compileFile('./views/view_user.pug');
const compiledPersonProf = pug.compileFile('./views/person_profile.pug');
const compiledSignup = pug.compileFile('./views/signup.pug');
const compliedWatchMovie = pug.compileFile('./views/watch-movie.pug');
const compliedsearch = pug.compileFile('./views/search.pug');
const compliedsearchPerson = pug.compileFile('./views/searchPerson.pug');
const compliedsearchUser = pug.compileFile('./views/searchUser.pug');
const compliedAddPerson = pug.compileFile('./views/addPerson.pug');
const compliedEditMovie = pug.compileFile('./views/editMovie.pug');
const compiledAddReview = pug.compileFile('./views/addReview.pug');

app.get('/', function (req, res) {
    res.send(compiledLogin({}));});

app.get('/addMovie', function(req,res){
    let x = {'username' : req.session.username};
    res.render('addMovie',{x});
});

app.get('/addPerson', function(req,res){
    res.send(compliedAddPerson({}));
});

app.get('/signup', function (req, res) {
    let sentence = {'sentence':'Please fill this from to join us today!'}
    res.send(compiledSignup({sentence}));
});

app.get('/search', function (req, res) { 
    x = logic.getTenMovies();
    x.sentence = 'Featured';
    res.send(compliedsearch({x}));
});

app.get('/searchPerson', function(req,res){
    let x = {'sentence' : 'Search for people', 'username' : req.session.username};
    res.send(compliedsearchPerson({x}));
});

app.get('/searchUser', function(req,res){
    let x = {'sentence' : 'Search for users', 'username' : req.session.username};
    res.send(compliedsearchUser({x}));
});

app.get('/logout', function(req,res){
    req.session.destroy();
    res.status(200).redirect('/');
})

app.get('/api/movies', (req,res)=>{
    if(Object.keys(req.query).length == 0){
        let x = logic.displayAllMovies();
        res.format({
            'text/html': function () {
                x.sentence = "results";
                x.username = req.session.username;
                let page = (compliedsearch({x}));
                res.status(200);
                res.end(page);
            },
            'application/json': function () {
                console.log("The request was JSON..");
                res.status(200).send(JSON.stringify(x))
            },
        });
    }else{
        let x = logic.movieSearchForAPI(req.query);
        res.format({
            'text/html': function () {
                x.sentence = "results";
                x.username = req.session.username;
                let page = (compliedsearch({x}));
                res.status(200);
                res.end(page);
            },
            'application/json': function () {
                console.log("The request was JSON..");
                res.status(200).send(JSON.stringify(x))
            },
        });
    }
});
app.get('/api/movies/:movie', (req,res)=>{
    const x =logic.searchMovie2(req.params.movie);
    if(x === null || x === undefined){
        res.status(404).send("movie not found");
    }else{
        res.format({
            'text/html': function () {
                const movie = x[0];
                if(movie == undefined){
                    res.status(404).send("sorry this page does not exist")
                }
                movie.username = req.session.username;
                movie.userType = req.session.userType;
                movie.similar = logic.getSimilarMovies(movie.Title);
                let page = (compliedWatchMovie({movie}));
                delete movie.similar;
                res.status(200);
                res.end(page);
            },
            'application/json': function () {
                console.log("The request was JSON..");
                res.status(200).send(JSON.stringify(x))
            },
        });
    }
});
app.get('/api/users', (req,res)=>{
    if(Object.keys(req.query).length == 0){
        let x = logic.displayUsers();
        res.format({
            'text/html': function () {
                x.sentence = "results";
                x.username = req.session.username;
                let page = (compliedsearchUser({x}));
                res.status(200);
                res.end(page);
            },
            'application/json': function () {
                console.log("The request was JSON..");
                res.status(200).send(JSON.stringify(x))
            },
        });
    }else{
        let x = logic.searchUser2(req.query.name);
        res.format({
            'text/html': function () {
               if(x != null){
                    x.sentence = "results";
                    x.username = req.session.username;
                    let page = (compliedsearchUser({x}));
                    res.status(200);
                    res.end(page);
               }else{
                    x = {};
                    x.sentence = "cannot find what you searched for";
                    x.username = req.session.username;
                    let page = (compliedsearchUser({x}));
                    res.status(404);
                    res.end(page);
               }
                
            },
            'application/json': function () {
                if(x != null){
                    console.log("The request was JSON..");
                    res.status(200).send(JSON.stringify(x))
                }else{
                    console.log("The request was JSON..");
                    res.status(404).send(JSON.stringify(x))
                }
            },
        });
    }
});
app.get('/api/editMovie/:movie', function(req,res){
    let movie = logic.searchMovie2(req.params.movie);
    if(movie.length != 0){
        movie = movie[0];
        res.status(200).send(compliedEditMovie({movie}));
    }else{
        res.status(404).send("sorry something went wrong.")
    }

});

app.get('/api/users/:user',getUser);
app.get('/api/people',(req,res)=>{
    if(Object.keys(req.query).length == 0){
        let x = logic.displayPeople();
        res.format({
            'text/html': function () {
                x.sentence = "results";
                x.username = req.session.username;
                let page = (compliedsearchPerson({x}));
                res.status(200);
                res.end(page);
            },
            'application/json': function () {
                console.log("The request was JSON..");
                res.status(200).send(JSON.stringify(x))
            },
        });
    }else{
        let x = logic.searchPerson2(req.query.name);
        res.format({
            'text/html': function () {
               if(x != null){
                    x.sentence = "results";
                    x.username = req.session.username;
                    let page = (compliedsearchPerson({x}));
                    res.status(200);
                    res.end(page);
               }else{
                    x = {};
                    x.sentence = "cannot find what you searched for";
                    x.username = req.session.username;
                    let page = (compliedsearchPerson({x}));
                    res.status(404);
                    res.end(page);
               }
                
            },
            'application/json': function () {
                if(x != null){
                    console.log("The request was JSON..");
                    res.status(200).send(JSON.stringify(x))
                }else{
                    console.log("The request was JSON..");
                    res.status(404).send(JSON.stringify(x))
                }
            },
        });
    }
});
app.get('/api/people/:person', getPerson);

app.get('/my_profile', function(req,res){
    req.session.currFollow = null;
    let x = searchUser(req.session.username);
    if(x != null){
        res.status(200).send(compiledMyProf({x}));
    }else{
        res.status(404).send('Sorry something went wrong please try later... most likey your session expired. log in again');
    }
});

app.get('/api/addReview/:title',function(req,res){
    let movie = req.params;
    res.status(200).send(compiledAddReview({movie}))
});

app.post("/login", loginUserToSever);
app.post("/signup", signupUser);
app.post("/search", searchFunction);
app.post("/searchPerson" , searchPersonFunction);
app.post("/searchUser",searchUserFunction);
app.post("/api/movies", function(req,res){
    let x = JSON.parse(JSON.stringify(req.body));
    delete x.sign_button;
    if(x.Poster == ''){
        x.Poster = 'https://thumbs.dreamstime.com/z/clapperboard-movies-concept-film-reel-movie-tape-great-topics-like-cinema-movie-theater-entertainment-films-etc-83903878.jpg'
    }
    x.Actors = x.Actors.split(',');
    x.Writer = x.Writer.split(',');
    x.Director = x.Director.split(',');
    let y = logic.addMovie(x);
    if(x != null){
        res.status(200).redirect(`/api/movies/${x.Title}`);
    }else{
        res.status(500).send('Something went wrong, please try again later.')
    }
});

app.post('/api/people', function(req,res){
    let x = JSON.parse(JSON.stringify(req.body));
    delete x.sign_button;
    x.work = x.work.split(',');
    x.role = {};
    x.FrequentCollaborators = [];
    x.role.actor = x.actor;
    x.role.director = x.director;
    x.role.writer = x.writer;
    delete x.actor;
    delete x.director;
    delete x.writer;
    let result = logic.addPerson(x);
    res.redirect(`/api/people/${x.name}`);
});

app.post('/api/editMovie/:movie', function(req,res){
    req.body.Title = req.params.movie;
    let movieObj = req.body;
    delete movieObj.sign_button;
    movieObj.Actors = movieObj.Actors.split(',');
    movieObj.Director = movieObj.Director.split(',');
    movieObj.Writer = movieObj.Writer.split(',');
    let x = logic.editMovie(movieObj);
    if(x == true){
        res.status(200).redirect(`/api/movies/${movieObj.Title}`);
    }else{
        res.send("Something went wrong, please try again later.")
    }
});

app.post('/api/addReview/:title', function(req,res){
    let x = req.body;
    delete x.sign_button;
    let y = req.params.title;
    x.Title = y;
    x.username = req.session.username;
    logic.addReview2(x);
    res.status(200).redirect(`/api/movies/${req.params.title}`);
});

app.get('/changetype', function(req,res){
    let x = logic.changeUserType(req.session.username);
    let y = searchUser(req.session.username);
    req.session.userType = y.userType;
    res.redirect('/my_profile');
});
app.get('/followUser', function(req,res){
    let z = logic.followOrNotUser(req.session.username,req.session.currFollow);
    if(z == 'Unfollow'){
        logic.unfollowUser(req.session.username,req.session.currFollow);
        res.status(200).redirect(`/api/users/${req.session.currFollow}`);
        
    }else{
        let x = logic.followUser(req.session.username,req.session.currFollow);
        res.status(200).redirect(`/api/users/${req.session.currFollow}`);
    }
});
app.get('/followPerson', function(req,res){
    let z = logic.followOrNotperson(req.session.username,req.session.currFollow);
    if(z == 'Unfollow'){
        logic.unfollowPerson(req.session.username,req.session.currFollow);
        res.status(200).redirect(`/api/people/${req.session.currFollow}`);
        
    }else{
        let x = logic.followPerson(req.session.username,req.session.currFollow);
        res.status(200).redirect(`/api/people/${req.session.currFollow}`);
    }
});



function loginUserToSever(req,res){ // function handling the logging in of a user
    console.log("POST request to login for user: " + req.body.username);
    if(req.session.loggedin){
        console.log("you are already logged in.");
        res.status(401).send("you are already logged in.");
    }else{
        let x = logic.loginUser(req.body);
        if(x != null){
            req.session.username = x.username;
            req.session.loggedin = true;
            req.session.userType = x.userType
            res.redirect('/my_profile');
        }else{
            res.status(404);
            res.send('incorrect username or password');
        }
    }
}

function signupUser(req,res){
    console.log("POST request to signup for user: " + req.body.username);
    x = logic.createNewUser(req.body);
    if (x === null){
        console.log("failed username already exists");
        let sentence = {sentence : 'Sorry this username already exists, Please choose another username'}
        res.send(compiledSignup({sentence}));
    }else{
        req.session.username = req.body.username;
        req.session.loggedin = true;
        res.redirect('/my_profile');
    }
}

//used when the api requests a specific user
function getUser(req,res){
    const x = logic.searchUser(req.params.user);
    if(x === null){
        res.status(404).send("user not found");
    }else{
        res.format({
            'text/html': function () {
                req.session.currFollow = x.username;
                x.followOrNot = logic.followOrNotUser(req.session.username, req.session.currFollow);
                let page = (compiledUserProf({x}));
                res.status(200);
                res.send(page);
                delete x.followOrNot;
            },
            'application/json': function () {
                console.log("The request was JSON..");
                res.status(200).send(JSON.stringify(x))
            },
        });
    }
}

//used when the api requests a specific person
function getPerson(req,res){
    console.log("getting person",req.params.person);
    let person = logic.searchPerson(req.params.person);
    if(person.length == 0){
        res.status(404).send("Person not found");
    }else{
        res.format({
            'text/html': function () {
                req.session.currFollow = req.params.person;
                person = person[0];
                person.followOrNot = logic.followOrNotperson(req.session.username, req.session.currFollow);
                let page = (compiledPersonProf({person}));
                res.status(200);
                res.end(page);
            },
            'application/json': function () {
                console.log("The request was JSON..");
                res.status(200).send(JSON.stringify(person));
            },
        });
    }
}



function searchFunction(req,res){
    let x = logic.searchMovie(req.body.search);
    if(x == null){
        let x = logic.searchMovieByGenre(req.body.search);
    }
    if (x == null){
        console.log('cannot find what you searched for');
        x = {sentence :'cannot find what you searched for'};
        res.status(404).send(compliedsearch({x}));
    }else{
        x.sentence = 'Search results: ';
        x.username = req.session.username;
        res.status(200).send(compliedsearch({x}));
    }

}

function searchPersonFunction(req,res){
    let x = logic.searchPerson(req.body.search);
    if (x == null){
        console.log('cannot find what you searched for');
        x = {sentence :'cannot find what you searched for'};
        res.status(404).send(compliedsearchPerson({x}));
    }else{
        x.sentence = 'Search results: ';
        x.username = req.session.username;
        res.status(200).send(compliedsearchPerson({x}));
    }

}

function searchUserFunction(req,res){
    let x = logic.searchUser2(req.body.search);
    if (x == null){
        console.log('cannot find what you searched for');
        x = {sentence :'cannot find what you searched for'};
        res.status(404).send(compliedsearchUser({x}));
    }else{
        x.sentence = 'Search results: ';
        x.username = req.session.username;
        res.status(200).send(compliedsearchUser({x}));
    }
}

app.listen(3000);
console.log("Server listening at http://localhost:3000");










