var action = process.argv[2];
var search = process.argv[3];

//Switch statement that runs specific function based on user input
switch (action) {
    case undefined:
        console.log("Search options are: spotify-this-song, movie-this, my-tweets or do-what-it-says");
        break;
    case 'spotify-this-song':
        spotifySearch();
        break;
    case 'movie-this':
        movieSearch();
        break;
    case 'my-tweets':
        tweetSearch();
        break;
    case 'do-what-it-says':
        whateverYouSay();
        break;
}

//function that appends to the log.txt file based on the data passed as argument
function appendToLog(data) {
        var fs = require('fs');
        fs.appendFile('log.txt', data, 'utf8', function(err) {
        if (err) {
        return console.log(err);
        }
        console.log('Log has been updated!');
        })

}

//function that searches spotify and logs the response based on user search
function spotifySearch() {
        console.log("Give it a second...")
        var spotify = require('spotify');
        if(search == undefined) {
            search = "what's my age again";
        }
        spotify.search({ type: 'track', query: search }, function(error, response) {
        if ( error ) {
        console.log('Error occurred: ' + error);
        return;
        }
        console.log('--------------------------------------------------------------');
        console.log('Artist(s): ' + response.tracks.items[0].artists[0].name);
        console.log('--------------------------------------------------------------');
        console.log('Song Name: ' + response.tracks.items[0].name);
        console.log('--------------------------------------------------------------');
        console.log('Preview Link: ' + response.tracks.items[0].preview_url);
        console.log('--------------------------------------------------------------');
        console.log('Album: ' + response.tracks.items[0].album.name);
        console.log('--------------------------------------------------------------');
        var spotifyData = 'Artist(s): '+ response.tracks.items[0].artists[0].name +'\n'+'Song Name: ' + 
        response.tracks.items[0].name+"\n"+'Preview Link: ' + response.tracks.items[0].preview_url+"\n"+
        'Album: ' + response.tracks.items[0].album.name+"\n\n";
        appendToLog(spotifyData);
});
}

//function that searches omdbapi and logs the response based on user search
function movieSearch() {
    console.log("Give it a second...");
    var request = require('request');
    if(search == undefined) {
        search = 'Mr. Nobody';
    }
    var url = 'http://www.omdbapi.com/?t=' + search +'&y=&plot=short&r=json&tomatoes=true'
    request(url, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            //converts body from string type to JSON object
            body = JSON.parse(body)
            console.log('--------------------------------------------------------------');
            console.log('Title: '+ body.Title);
            console.log('--------------------------------------------------------------');
            console.log('Year Released: '+ body.Year);
            console.log('--------------------------------------------------------------');
            console.log('Plot: '+ body.Plot);
            console.log('--------------------------------------------------------------');
            console.log('Countries Released in: '+ body.Country);
            console.log('--------------------------------------------------------------');
            console.log('Languages Released in: '+ body.Language);
            console.log('--------------------------------------------------------------');
            console.log('Actors: '+ body.Actors);
            console.log('--------------------------------------------------------------');
            console.log('IMDB Rating: '+ body.imdbRating);
            console.log('--------------------------------------------------------------');
            console.log('Rotten Tomatoes Rating: '+ body.tomatoRating);
            console.log('--------------------------------------------------------------');
            console.log('Rotten Tomatoes URL: '+ body.tomatoURL);
            console.log('--------------------------------------------------------------');
            var movieData = 'Title: '+ body.Title +'\n'+'Year Released: '+body.Year+"\n"+'Plot: '+ body.Plot +'\n'+
            'Countries Released in: '+body.Country+"\n"+'Languages Released in: '+body.Language+"\n"+
            'Actors: '+ body.Actors +'\n'+'IMDB Rating: '+body.imdbRating+"\n"+
            'Rotten Tomatoes Rating: '+ body.tomatoRating +'\n'+
            'Rotten Tomatoes URL: '+ body.tomatoURL+'\n\n';

            //Passes the movie data to the appendToLog function which appends the data to the log.txt file
            appendToLog(movieData);
        }
    })
}

// shows your last 20 tweets and when they were created for a designated screen name
function tweetSearch() {
    console.log("Give it a second...");
    var Twitter = require('twitter');
    var key = require('./key.js');
    var Tweets = new Twitter(key.twitterKeys);
    //Twitter parameters and get method to retrieve the appropriate data
    var params = {screen_name: 'nodejs', count: 20};
    Tweets.get('statuses/user_timeline', params, function(error, tweets, response){
      if (!error) {
        for (var i = 0; i < tweets.length; i++) {
            console.log('--------------------------------------------------------------');
            var tweetsDate = tweets[i].created_at;
            var tweetsText = tweets[i].text;
            console.log(tweetsDate + " || " + tweetsText);
            console.log('--------------------------------------------------------------');
        }
      }
    });
}
// Using the fs package in node, the program would take the text inside of random.txt and use it to call the first command with the second part as it's parameter
function whateverYouSay() {
    var fs = require('fs');
    fs.readFile('random.txt', 'utf8', function(error, data) {
        //data is string type so split method is used to turn data into an array
        var splitted = data.split(",");
        //If statement that passes the data into the appropriate search function
        if (splitted[0] == 'spotify-this-song') {
            spotifySearch(splitted[1]);
        }
        if (splitted[0] == 'movie-this') {
            movieSearch(splitted[1]);
        }
    })
}