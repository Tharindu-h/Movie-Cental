const FileSystem = require("fs");
let featured = {}; //featured movies for the session
/*
        users data type:{
        "example user":{ "example user's" ID (same as "example user's username")
            username : "example user",
            password : "password",
            userType : "regular", // could be either regular or contributing, by defalt it is set to regular(when createNewUser() is called).
            followingUsers : [], // other users the user(example user in this case) follows.
            followingPeople : [], // other people(actors, directors, writors, etc) the user(example user in this case) follows.
            followers : [], // array of usernames of the people that follows "example user".
            reviews : [], //array of review ID's the "example user" wrote.
            recommendedMovies : [] //array of recommended movies for "example user".
        },
    }

*/
/* 
let users ={
    "user1":{
        "username" : "user1",
        "password" : "1234",
        "userType" : "regular",
        "followingUsers" : [],
        "followingPeople" : [],
        "followers" : [],
        "reviews" : [1],
        "recommendedMovies" : []
    },
}
 */

let users = require("./users-data.json");

/*
        people data type :{
        "example person":{              // "example person" ID (same as "example person's" name)
            "name" : "example person", // name of the actor/director/writer
            "role" : {                // what their roles are in movies
                "actor" : true,      // wheather "example person" acted in a movie
                "director" : false, // wheather "example person" directed a movie
                "writer" : false,  // wheather "example person" wrote a movie
            },
            "work" : [],         // array containing movies "example person" is involved in.
        }
    }
*/

/* let people ={
    "person1":{
        "name" : "person1",
        "role" :{
            "actor" : true,
            "director" : false,
            "writer" : false,
        },
        "work" : []
    }
} */

let people = require('./people-data.json');
/*
        movies data type: {
            "Toy Story" :{              // movie ID (same as movie name)
                "title" : "Toy Story", // name of the movie
                "released" : "22 Nov 1995", //date the movie was released
                "runtime" : "81 min",  //run time of the movie
                "genre" : ["Animation", "Adventure", "Comedy", "Family", "Fantasy"], // array of the genres the movie is in
                "aveRating" : "8.5",    // average rating of the movie.
                "Plot": "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
                "Actors": ["Tom Hanks"," Tim Allen", "Don Rickles"," Jim Varney"],
                "writers" : ["John Lasseter","Pete Docter","Andrew Stanton","Joe Ranft","Joss Whedon"," Andrew Stanton",
                            "Joel Cohen","Alec Sokolow"],
                "directors" : ["John Lasseter"],
                "poster" : "https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SX300.jpg"
                "reviews" : []  //array of review IDs.
            }
        }
*/

//let movies = require("./movie-data-short.json");
let movies = require('./modified-movie-data.json');
//let movies = require('./movie-data.json');
const { compileFunction } = require("vm");
const { title } = require("process");

/*
        reviews data type :{
            0:{
                "username" : "username",
                "movieID" : "Movie name",
                "brief summary" : "",
                "content" : "",
                "rating" : "9"
            }
        }

*/

let reviews = {
    1:{
    "username" : "user1",
    "movieID" : "Toy Strory",
    "brief_summary" : "great movie",
    "content" : "A kids’ movie for grown-ups. A grown-up movie for kids. Exactly what you’d expect — and hope for — from the latest, and we’re guessing final, Woody and Buzz adventure",
    "rating" : "9"
    }
}


/*
createNewUser(){}
assuming that we get an user object as input containing a username and a password, if the username does not
already exsist in the data base, add it to the database and return true. else return false.
*/

function createNewUser(userObj){
    if(userObj.username === null || userObj.password === null){
        return null;
    }
    delete userObj.sign_button;
    if(users.hasOwnProperty(userObj.username)){
        return null;
    }
    userObj.userType = "regular";
    userObj.followingUsers = [];
    userObj.followingPeople = [];
    userObj.followers = [];
    userObj.reviews = [];
    userObj.recommendedMovies = [];

    users[userObj.username] = userObj;
    console.log(userObj);
    saveUser();
    return users[userObj.username];
}

/* 
saveUser();
saves any changes made to the users object to the users.json file
*/

function saveUser(){
    FileSystem.writeFile('./server-side/users-data.json', JSON.stringify(users), (err) => {
        if (err) throw err;
        else{
            console.log('user object saved!');
        }
      });
    
}

/* 
saveMovie();
saves any changes done to the movie obj
*/
function saveMovie(){
    FileSystem.writeFile('./server-side/modified-movie-data.json', JSON.stringify(movies), (err) => {
        if (err) throw err;
        else{
            console.log('movie object saved!');
        }
      });
    
}

/* 
savePerson();
saves any changes done to the people obj
*/
function savePerson(){
    FileSystem.writeFile('./server-side/people-data.json', JSON.stringify(people), (err) => {
        if (err) throw err;
        else{
            console.log('People object saved!');
        }
      });
    
}

/*
loginUser(username,password);
this function will check if the username exists in the users object and if so it will check if the 
given password matches the password in the user object if so the user will be logged in and the 
function will return true, else returns false.
*/

function loginUser(userobj){
    if(users.hasOwnProperty(userobj.username)){
        if(users[userobj.username]["password"] == userobj.password){
            console.log("logged in");
            let temp = users[userobj.username];
            //return temp;
            return users[userobj.username];
        }
        console.log("incorrect password");
    }else{
        console.log("incorrect username");
    }
    return null;
}

/*
changeUserType();
this function takes in a username as input(username of the user requesting the function) and changes the
user's userType.
*/
function changeUserType(username){
    if(username === null){
        return null;
    }
    if(users.hasOwnProperty(username)){
        //let user = users[username];
        //console.log(users[username]);
        if(users[username]["userType"] === "regular"){
            users[username]["userType"] = "contributing";
        }else{
            users[username]["userType"] = "regular";
        }
    }
    saveUser();
    //console.log(users[username]);
    return users[username];
}

/*
changePassword(username,password);
changes the password of the user who is requesting changePassword(); 
input : username(of the user who requests changePassword) and the new password.
*/
function changePassword(username, password){
    if(username === null){
        return null;
    }
    if(users.hasOwnProperty(username)){
        users[username]["password"] = password;
    }
    return users[username];
}

/*
changeUsername(username, newUsername); // the username attribute will be collected from the user clicking the change username button.
username is changed by calling the createNewUser() function with the new username and the existing password.
and then copying over all the old objects attributes onto the new object then deleting the old object.
*/
function changeUsername(username,newUsername){
    if(username === null || users.hasOwnProperty(username)=== false){
        return null;
    }
    let x = users[username]["password"];
    createNewUser({username : newUsername, password:x});

    users[newUsername]["userType"] = users[username]["userType"];
    users[newUsername]["followingUsers"] = users[username]["followingUsers"];
    users[newUsername]["followingPeople"] = users[username]["followingPeople"];
    users[newUsername]["followers"] = users[username]["followers"];
    users[newUsername]["reviews"] = users[username]["reviews"];
    users[newUsername]["recommendedMovies"] = users[username]["recommendedMovies"];
    delete users[username];

    return users;
}

/*
addPerson(personObj);
this function will add the new personobj object to the person object.
*/

function addPerson(personObj){
    if(personObj === null){
        return null;
    }
    if(people.hasOwnProperty(personObj.name)){
        console.log("this person already exists");
        return null;
    }
    if(personObj.role["actor"] === true){
        for(let x = 0; x < personObj.work.length; x++){
            addPersonAsActor(personObj.name,personObj.work[x]);
        }
    }
    if(personObj.role["director"] === true){
        for(let x = 0; x < personObj.work.length; x++){
            addPersonAsDirector(personObj.name,personObj.work[x]);
        }
    }
    if(personObj.role["writer"] === true){
        for(let x = 0; x < personObj.work.length; x++){
            addPersonAsWriter(personObj.name,personObj.work[x]);
        }
    }
    people[personObj.name] = personObj;
    savePerson();
    return people[personObj.name];
}

/*
addPersonAsActor(name,title);
this function is a helper function for addPerson(personObj), if the person being added has movies
that he/she acted in, they will be added to those movies. 
*/

function addPersonAsActor(name,title){
    if(name === null || title === null){
        return null;
    }
    if(movies.hasOwnProperty(title)){
        movies[Title]["Actors"].push(name);
    }
    return true;
}

/*
addPersonAsDirector(name,title);
this function is a helper function for addPerson(personObj), if the person being added has movies
that he/she directed in, they will be added to those movies. 
*/

function addPersonAsDirector(name,title){
    if(name === null || title === null){
        return null;
    }
    if(movies.hasOwnProperty(title)){
        movies[Title]["Director"].push(name);
    }
    return true;
}

/*
addPersonAsWriter(name,title);
this function is a helper function for addPerson(personObj), if the person being added has movies
that he/she wrote in, they will be added to those movies. 
*/

function addPersonAsWriter(name,title){
    if(name === null || title === null){
        return null;
    }
    if(movies.hasOwnProperty(title)){
        movies[Title]["Writer"].push(name);
    }
    return true;
}

/*
followUser(requestingUser,userToFollow);
the "requestingUser" will follow "userToFollow" ("userToFollow" will be added to "requestngUser"'s "followingUsers" array).
the "requestingUser" will be added to "userToFollow's" followers array.
*/
function followUser(requestingUser, userToFollow){
    if(requestingUser === null || userToFollow === null){
        return null;
    }
    if(users[requestingUser]["followingUsers"].includes(userToFollow) === true){
        console.log("requesting user already follows user to follow.");
        console.log("abort.");
        return null;
    }
    if(users.hasOwnProperty(requestingUser) && users.hasOwnProperty(userToFollow)){
        users[requestingUser]["followingUsers"].push(userToFollow);
        users[userToFollow]["followers"].push(requestingUser);
        saveUser();
    }
    return;
}

/* 
followOrNotUser(requestingUser, userToFollow);
checks if the requestingUser follows UserToFollow
*/
function followOrNotUser(requestingUser, userToFollow){
    if(users[requestingUser]["followingUsers"].includes(userToFollow) === true){
        console.log("requesting user already follows user to follow.");
        return 'Unfollow';
    }else{
        return 'Follow';
    }

}


/*
unfollowUser(requestingUser,userToUnfollow);
this function will remove the "userToUnfollow" from "requestingUser"'s followingUsers array and remove
"requestingUser" from "userToUnfollow"'s followers array. it is assumed that the option to unfollow
will be avaliable only if the "requestingUser" is already following the "userToUnfollow" thus, this 
function will not check wheather the "requestingUser" follows the "userToUnfollow".
*/

function unfollowUser(requestingUser,userToUnfollow){
    if(requestingUser === null || userToUnfollow === null){
        return null;
    }
    if(users.hasOwnProperty(requestingUser) && users.hasOwnProperty(userToUnfollow)){
        let index = users[requestingUser]["followingUsers"].indexOf(userToUnfollow);
        users[requestingUser]["followingUsers"].splice(index,1);
        index = users[userToUnfollow]["followers"].indexOf(requestingUser);
        users[userToUnfollow]["followers"].splice(index,1);
        saveUser();
    }
    return users[requestingUser];
}

/*
followPerson(requestingUser,person);
the "requestingUser" will follow "person" ("person" will be added to "requestingUser"'s "followingPeople" array).
*/
function followPerson(requestingUser, person){
    if(requestingUser === null || person === null){
        return null;
    }
    if(users.hasOwnProperty(requestingUser) && people.hasOwnProperty(person)){
        users[requestingUser]["followingPeople"].push(person);
        saveUser();
    }
    return users[requestingUser];
}

/* 
followOrNotPerson(requestingUser, userToFollow);
checks if the requestingUser follows UserToFollow
*/
function followOrNotperson(requestingUser, person){
    let x = searchPerson(person);
    if (x.length == 0){
        return "Follow";
    }
    if(users[requestingUser]["followingPeople"].includes(person) === true){
        console.log("requesting user already follows user to follow.");
        return 'Unfollow';
    }else{
        return 'Follow';
    }

}

/*
unfollowPerson(requestingUser,personToUnfollow);
this function will remove "personToUnfollow" from "requestingUser"'s "followingPeople" array. it is 
assumed that the option to unfollow will only be avaliable if the "requestingUser" is already following
"personToUnfollow".
*/

function unfollowPerson(requestingUser,personToUnfollow){
    if(requestingUser === null || personToUnfollow === null){
        return null;
    }
    if(users.hasOwnProperty(requestingUser) && people.hasOwnProperty(personToUnfollow)){
        let index = users[requestingUser]["followingPeople"].indexOf(personToUnfollow);
        users[requestingUser]["followingPeople"].splice(index,1);
        saveUser();
    }
    return users[requestingUser];
}

/*
searchUser(username);
this function will search and return "username's" profile with following attributes 
username, userType, followingUsers, followingPeople, reviews
*****************will not be used when searching for users on the website, only used by the server****************
*/

function searchUser(username){

    if(username != null){
        username = username.toLocaleLowerCase();
        username = username.replace(/\s/g, "");
        for(i in users){
            const u = users[i]["username"].toLocaleLowerCase();
            if(u.replace(/\s/g, "") === username){
                ///let temp = users[i];
                //delete temp["password"];
                //delete temp["recommendedMovies"]; // this would work because if user wanted to follow "username's" profile, followUser() 
                //return temp;              // will be called, which will search users object for "username". temp is not added to the users object.
                return users[i];
            }
        }
    }
    return null;
}

/*
searchUser(username);
this function will search and return "username's" profile with following attributes 
username, userType, followingUsers, followingPeople, reviews
*******************this is what the server will use to search for users when api asks for a user*************************
*/

function searchUser2(username){

    if(username != null){
        let arr = [];
        username = username.toLocaleLowerCase();
        username = username.replace(/\s/g, "");
        for(i in users){
            const u = users[i]["username"].toLocaleLowerCase();
            if(u.replace(/\s/g, "").includes(username)){
                //let temp = users[i];
                //delete temp["password"];
                //delete temp["recommendedMovies"]; // this would work because if user wanted to follow "username's" profile, followUser() 
                //return [temp];              // will be called, which will search users object for "username". temp is not added to the users object.
                arr.push(users[i]);
            }
        }
        return arr;
    }
    return null;
}


/*
searchPerson(name);
this function will search and return "name's" profile (name is an actor/director/writer).
*/

function searchPerson(name){
    let arr = [];
    if(name != null){
        name = name.toLocaleLowerCase();
        name = name.replace(/\s/g, "");
        for(i in people){
            p = people[i]["name"].toLocaleLowerCase();
            if(p.replace(/\s/g, "") == name){
                arr.push(people[i]);
                break;
            }
        } 
        return arr;
    } 
    return null;
}

/*
searchPerson2(name);
this function will search and return "name's" profile (name is an actor/director/writer).
*/

function searchPerson2(name){
    let arr = [];
    if(name != null){
        name = name.toLocaleLowerCase();
        name = name.replace(/\s/g, "");
        for(i in people){
            p = people[i]["name"].toLocaleLowerCase();
            if(p.replace(/\s/g, "") == name){
                arr.push(people[i]);
            }
        } 
        return arr;
    } 
    return null;
}

/* 
getMovieNumber(movies)
calculates the number of movies in the movie object
*/
let movieNumber = 0;
function getMovieNumber(movies){
    for(i in movies){
        movieNumber++;
    }
}

/* 
addReview(reviewObj);
adds the given review to the given title;
*/
function addReview2(reviewObj){
    let movie = searchMovie2(reviewObj.Title);
    delete reviewObj.Title;
    movie[0].reviews.push(reviewObj);
    saveMovie();
}

/* 
getSimilarMovies(movieTitle)
this fuction will return 10 similar movies based on a genre.
*/
function getSimilarMovies(movieTitle){
    let genre = searchMovie2(movieTitle);
    genre = genre[0].Genre[0];
    let result = searchMovieByGenre(genre);
    let arr = [];
    for (var i  = 0; i < 6; i++){
        if(result[i] == undefined){
            continue;
        }
        arr.push(result[i])
    }
    if (result.length != 0){
        return arr;
    }else{
        return null;
    }
}


/*
searchMovie(title);
this function will search and return a movie with the title specified.
*/
function searchMovie(searchTitle){
    let arr = [];
    let count = 0;
    if(searchTitle != null){
        searchTitle = searchTitle.toLocaleLowerCase();
        searchTitle = searchTitle.replace(/\s/g, "");
        for(i in movies){
            count++;
            if(count >= movieNumber+1){break;}
            const m = movies[i]["Title"].toLocaleLowerCase();
            /* if(m.replace(/\s/g, "") === searchTitle){
                return [movies[i]];
                //return movies[i];
            } */
            if(m.replace(/\s/g, "").includes(searchTitle)){
                //return [movies[i]];
                arr.push(movies[i]);
            }
        }
        return arr;
    }
    return null;
}

/*
searchMovie2(title);
this function will search and return a movie with the title specified.
*/
function searchMovie2(searchTitle){
    let arr = [];
    let count = 0;
    if(searchTitle != null){
        searchTitle = searchTitle.toLocaleLowerCase();
        searchTitle = searchTitle.replace(/\s/g, "");
        for(i in movies){
            count++;
            if(count >= movieNumber+1){break;}
            const m = movies[i]["Title"].toLocaleLowerCase();
            /* if(m.replace(/\s/g, "") === searchTitle){
                return [movies[i]];
                //return movies[i];
            } */
            if(m.replace(/\s/g, "") == searchTitle){
                //return [movies[i]];
                arr.push(movies[i]);
                break;
            }
        }
        return arr;
    }
    return null;
}

/*
editMovie(title);
this function will search and find a movie with the title specified, and add the changes the user made to that title.
*/
function editMovie(movieObj){
    let arr = [];
    let count = 0;
    searchTitle = movieObj.Title;
    if(searchTitle != null){
        searchTitle = searchTitle.toLocaleLowerCase();
        searchTitle = searchTitle.replace(/\s/g, "");
        for(i in movies){
            count++;
            if(count >= movieNumber+1){break;}
            const m = movies[i]["Title"].toLocaleLowerCase();
            if(m.replace(/\s/g, "") == searchTitle){
                movies[i].Actors = movieObj.Actors;
                movies[i].Writer = movieObj.Writer;
                movies[i].Director = movieObj.Director;
                for (i in movieObj.Actors){
                    addPerson({name : movieObj.Actors[i], role : {actor : "true", director : 'false', writer : 'false'}, work : movieObj.Title, FrequentCollaborators : movieObj.Actors});
                }
                for (i in movieObj.Writer){
                    addPerson({name : movieObj.Writer[i], role : {actor : "false", director : 'false', writer : 'true'}, work : movieObj.Title, FrequentCollaborators : movieObj.Writer});
                }
                for (i in movieObj.Director){
                    addPerson({name : movieObj.Director[i], role : {actor : "false", director : 'true', writer : 'false'}, work : movieObj.Title, FrequentCollaborators : movieObj.Director});
                }
                saveMovie();
                return true;
            }
        }
    }
    return flase;
}

/*
searchMovieByGenre(genre);
this function will search and return movies with the given genre
*/
function searchMovieByGenre(genre){
    let count = 0;
    if(genre != null){
        let arr = [];
        genre = genre.toLocaleLowerCase();
        genre = genre.replace(/\s/g, "");
        for(i in movies){
            for(g in movies[i]["Genre"]){
                let gen = movies[i]["Genre"][g].toLocaleLowerCase();
                if(gen.replace(/\s/g, "") === genre){
                    arr.push(movies[i]);
                    count++;
                    break;
                }
            }
        }
        //console.log(arr);
        return arr;
    }
   /*  if(count > 10){
        arr = [];
        count = 0;
        let rand = -1;
        for(i in movies){
            for(g in movies[i]["Genre"]){
                if(count > 10){break;}
                let gen = movies[i]["Genre"][g].toLocaleLowerCase();
                if(gen.replace(/\s/g, "") === genre){
                    rand = Math.floor(Math.random() * 11); 
                    if(rand > 5){
                        arr.push(movies[i]);
                        count++;
                        break;
                    }
                }
            }
        }
        return arr;
    } */
    return null;
}

/* 
searchMovieByYear()
helper for api, searches the movie obj for the given year adn returns movies that match the search
*/
function searchMovieByYear(year){
    let arr = [];
    for (i in movies){
        if(movies[i].Year == year){
            arr.push(movies[i]);
        }
    }
    return arr;
}

/* 
searchMovieByMinrating(minrating)
helper for api, searches and returns the movies that are >= given minrating
*/
function searchMovieByMinrating(minrating){
    let arr = [];
    for(i in movies){
        if(movies[i].imdbRating >= imdbRating){
            arr.push(movies[i]);
        }
    }
    return arr;
}

/* 
movieSearchForAPI(queryParams)
created as a better search for query params
*/
function movieSearchForAPI(queryParams){
    let arr = [];
    var temp = [];
    if(Object.keys(queryParams).includes('title')){
        arr = searchMovie(queryParams.title);
    }
    if(Object.keys(queryParams).includes('genre')){
        if(arr.length != 0){
            var temp = [];
            for(i in arr){
                let x = arr[i].Genre;
                x = x.toString().toLowerCase();
                if(x.includes(queryParams.genre)){
                    temp.push(arr[i]);
                }
            }
            arr = temp;
        }else{
            arr = searchMovieByGenre(queryParams.genre);
        }
    }
    if(Object.keys(queryParams).includes('year')){
        if(arr.length != 0){
            console.log("length ", arr.length );
            var temp = [];
            for(i in arr){
                if(arr[i].Year == queryParams.year){
                    temp.push(arr[i]);
                }
            }
            arr = temp;
        }else{
            arr = searchMovieByYear(queryParams.year);
        }
    }
    if(Object.keys(queryParams).includes('minrating')){
        if(arr.length != 0){
            var temp = [];
            for(i in arr){
                if(arr[i].imdbRating >= queryParams.minrating){
                    temp.push(arr[i]);
                }
            }
            arr = temp;
        }else{
            arr = searchMovieByMinrating(queryParams.minrating);
        }
    }
    return arr;
}

/* 
displayMovie(title);
returns a movie object contaning the specified movie.
this function will not search for the movie or look if the movie exists as this function is meant to 
be used once a search is done and someone clicks on the movie title retuned by a movie search.
*/

function displayMovie(title){
    if(title === null){
        return null;
    }
    return searchMovie(title);
}

/*
addMovie() adds a new movie object to the movies object.
*/

function addMovie(movieObj){
    if(movies.hasOwnProperty(movieObj.Title) === true){
        console.log("Movie already exists");
        return null;
    }
    movies[movieObj.Title] = movieObj;
    for(let i = 0; i < movies[movieObj.Title]["Actors"].length; i++){
        addMovieToActor(movies[movieObj.Title]["Actors"][i],movieObj.Title, movieObj);
    }
    for(let i = 0; i < movies[movieObj.Title]["Director"].length; i++){
        addMovieToDirector(movies[movieObj.Title]["Director"][i],movieObj.Title, movieObj);
    }
    for(let i = 0; i < movies[movieObj.Title]["Writer"].length; i++){
        addMovieToWriter(movies[movieObj.Title]["Writer"][i],movieObj.Title, movieObj);
    }
    movieNumber++;
    saveMovie();
    return movies[movieObj.Title];
}

/*
addMovieToActor(personName,title);
helper function for addMovie(movieObj), iterates trough the Actors array in the movieObj
and adds the movie name to the Actor's work array.
*/

function addMovieToActor(personName,title,movieObj){
    if(personName === null || title === null){
        return null;
    }
    if(people.hasOwnProperty(personName)){
        if(people[personName]["role"]["actor"] === true){
            if(!people[personName].work.includes(title)){
                people[personName].work.push(title);
            }
            return true;
        }else{
            people[personName]["role"]["actor"] = true;
            if(!people[personName].work.includes(title)){
                people[personName].work.push(title);
            }
            return true;
        }
    }else{
        
        addPerson({name : personName, role :{actor : "true",director:"false",writer:"false"},work:[title], FrequentCollaborators : movieObj.Actors});
        return true;
    }
    return false;
}

/*
addMovieToDirector(personName,title);
helper function for addMovie(movieObj), iterates trough the directors array in the movieObj
and adds the movie name to the director's work array.
*/

function addMovieToDirector(personName,title, movieObj){
    if(personName === null || title === null){
        return null;
    }
    if(people.hasOwnProperty(personName)){
        if(people[personName]["role"]["director"] === true){
            if(!people[personName].work.includes(title)){
                people[personName].work.push(title);
            }
            return true;
        }else{
            people[personName]["role"]["director"] = true;
            if(!people[personName].work.includes(title)){
                people[personName].work.push(title);
            }
            return true;
        }
    }else{
        addPerson({name : personName, role :{actor : "false",director:"true",writer:"false"},work:[title],FrequentCollaborators : movieObj.Director});
        return true;
    }
    return false;
}

/*
addMovieToWriter(personName,title);
helper function for addMovie(movieObj), iterates trough the writers array in the movieObj
and adds the movie name to the writer's work array.
*/

function addMovieToWriter(personName,title, movieObj){
    if(personName === null || title === null){
        return null;
    }
    if(people.hasOwnProperty(personName)){
        if(people[personName]["role"]["writer"] === true){
            if(!people[personName].work.includes(title)){
                people[personName].work.push(title);
            }
            return true;
        }else{
            people[personName]["role"]["writer"] = true;
            if(!people[personName].work.includes(title)){
                people[personName].work.push(title);
            }
            return true;
        }
    }else{
        addPerson({name : personName, role :{actor : "false",director:"false",writer:"true"},work:[title],FrequentCollaborators : movieObj.Writer});
        return true;
    }
    return false;
}

/*
getNumReviews();
helper function for addReview();
counts how many reviews exists in order to make new review IDs.
*/

function getNumReviews(){
    let numReviews = 0;
    for(const i in reviews){
        numReviews++;
    }
    return numReviews;
}

/*
addReviewToMovie(reviewID,movieID);
adds new review ID to the corresponding movie's reviews list.
*/

function addReviewToMovie(reviewID,movieID){
    if(movies.hasOwnProperty(movieID) === false){
        console.log("Movie does not exist");
        return null;
    }
    movies[movieID]["reviews"].push(reviewID)
    return movies[movieID];
}

/*
addReviewToUser();
adds new review ID to the corresponding user's reviews list.
*/

function addReviewToUser(reviewID,userID){
    if(users.hasOwnProperty(userID) === false){
        console.log("User does not exist");
        return null;
    }
    users[userID]["reviews"].push(reviewID);
    return users[userID];
}

/*
addReview(); adds review to the reviews object.
*/

function addReview(reviewObj){
    if (addReviewToMovie(numReviews+1,reviewObj.movieID) === null){
        console.log("Movie does not exist");
        return null;
    }
    if(addReviewToUser(numReviews+1,reviewObj.username) === null){
        console.log("user does not exist");
    }
    numReviews++;
    let num = numReviews;
    reviewObj.num = num;
    reviews[reviewObj.num] = reviewObj;
    delete reviews[num]["num"]
    return reviews[reviewObj.num];
}

/*
getUserReviews(username);
returns the reviews written by the given user.
*/

function getUserReviews(username){
    if(username === null || users.hasOwnProperty(username) === false){
        return null;
    }
    for(let i = 0; i < users[username]["reviews"].length; i++){
        let x = users[username]["reviews"][i];
        if(x in reviews){
            return reviews[x];
        }
    }
}

/*
displayUsers();
returns a copy of the the users object contatining all users with the password removed.
created for the api.
*/

function displayUsers(){
    temp = users;
    for (i in temp){
        delete temp[i]["password"];
    }
    return temp;
}

/*
displayPeople();
returns the people object contatining all people. created for the api.
*/

function displayPeople(){
    return people;
}

/*
displayAllMovies();
returns the movies object. created for the api.
*/

function displayAllMovies(){
    return movies;
}

function displayTenMovies(){
    let count = 0;
    let rand = -1;
    for(i in movies){ //later modify to make them random.
        if(count == 10){break;}
        rand = Math.floor(Math.random() * 11); 
        if(rand > 5){
            featured[movies[i].Title] = movies[i];
            count++;
        }
    }
    return featured;
}

function getTenMovies(){
    return featured;
}


getMovieNumber(movies);
displayTenMovies();

module.exports ={
    createNewUser,
    loginUser,
    changeUserType,
    changePassword,
    changeUsername,
    addPerson,
    addPersonAsActor,
    addPersonAsDirector,
    addPersonAsWriter,
    followUser,
    followOrNotUser,
    unfollowUser,
    followPerson,
    followOrNotperson,
    unfollowPerson,
    searchUser,
    searchUser2,
    searchPerson,
    searchPerson2,
    getSimilarMovies,
    searchMovie,
    searchMovie2,
    editMovie,
    movieSearchForAPI,
    displayMovie,
    addMovie,
    addMovieToActor,
    addMovieToDirector,
    addMovieToWriter,
    getNumReviews,
    addReviewToMovie,
    addReviewToUser,
    addReview2,
    getUserReviews,
    displayUsers,
    displayPeople,
    displayAllMovies,
    getTenMovies,
    searchMovieByGenre,
}