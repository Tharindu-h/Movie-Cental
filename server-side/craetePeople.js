
const FileSystem = require('fs');

let movies = {};
let data = require('./movie-data.json');
let count = 0;

for(i in data){
    data[i].Actors = data[i].Actors.split(',');
    data[i].Writer = data[i].Writer.split(',');
    data[i].Director = data[i].Director.split(',');
    data[i].Genre = data[i].Genre.split(',');
    data[i].reviews = [];
    movies[data[i].Title] = data[i];
    count++;
}

FileSystem.writeFile('./modified-movie-data.json', JSON.stringify(movies), (err) => {
    if (err) throw err;
    else{
        console.log('movie object saved!, there were' , count , ' movies.');
    }
  });