//Require modules
var fs = require('fs');
var spotify = require('spotify');
var request = require('request');
var Twitter = require('twitter');
var key = require('./key.js');

//Variables to retrieve what the user types in the command terminal
var action = process.argv[2];
var search = process.argv[3];

//Switch statement that runs specific function based on user input
switch (action) {
    case undefined:
        console.log("Search options are: spotify-this-song, movie-this, my-tweets or do-what-it-says.");
        break;
    case 'spotify-this-song':
        spotifySearch(search);
        break;
    case 'movie-this':
        movieSearch(search);
        break;
    case 'my-tweets':
        tweetSearch();
        break;
    case 'do-what-it-says':
        whateverYouSay();
        break;
}

//function that searches spotify and logs the response based on user search
function spotifySearch(search) {
        console.log("Give it a second...");
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
        
        var spotifyData = {
            'Artist(s)': response.tracks.items[0].artists[0].name,
            'Song Name': response.tracks.items[0].name,
            'Preview Link': response.tracks.items[0].preview_url,
            'Album': response.tracks.items[0].album.name
        }
            appendToLog(spotifyData, 'spotify');
});
}

//function that searches omdbapi and logs the response based on user search
function movieSearch(search) {
    console.log("Give it a second...");
    if(search == undefined) {
        search = 'Mr. Nobody';
    }
    var options = {
        url: 'http://www.omdbapi.com/',
        qs: {
            t: search,
            plot: 'short',
            r: 'json',
            tomatoes: 'true'
        }
    }
    request(options, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            //converts body from string type to JSON object
            body = JSON.parse(body);
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

            var movieData = {
                'Title': body.Title, 'Year Released': body.Year, 'Plot': body.Plot, 
                'Countries Released in': body.Country, 'Languages Released in': body.Language,
                'Actors': body.Actors, 'IMDB Rating': body.imdbRating,
                'Rotten Tomatoes Rating': body.tomatoRating, 'Rotten Tomatoes URL': body.tomatoURL
                }

            //Passes the movie data to the appendToLog function which appends the data to the log file
            appendToLog(movieData, 'movie');
        }
    })
}

// function that shows the last 20 tweets based on twitter screen name 
function tweetSearch() {
    console.log("Give it a second...");
    console.log('-----------------------------------------------------------------------');
    var Tweets = new Twitter(key.twitterKeys);
    //Twitter parameters and get method to retrieve the appropriate data
    var params = {screen_name: 'nodejs', count: 20};
    Tweets.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        for (var i = 0; i < tweets.length; i++) {
            console.log(tweets[i].created_at + " || " + tweets[i].text);
            console.log('-----------------------------------------------------------------------');
            var twitterData = {
                'Date Created': tweets[i].created_at,
                'Tweets': tweets[i].text
            }

        }
            appendToLog(twitterData, 'twitter');
      }
    });
}
// function that takes the text inside of random.txt and uses it to call the first command with the second part as it's parameter
function whateverYouSay() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        //data is string type so split method is used to convert data into an array
        var splitted = data.split(",");
        //Passes the splitted array into the appropriate search function
        if (splitted[0] == 'spotify-this-song') {
            spotifySearch(splitted[1]);
        }
        if (splitted[0] == 'movie-this') {
            movieSearch(splitted[1]);
        }
    })
}

//function that appends to the log file based on the data passed as argument
function appendToLog(data, source) {

        if (source === 'twitter') {
            fs.appendFile('twitter_log.txt', JSON.stringify(data, null, '\t'), 'utf8', function(error, response) {
            if (error) {
            return console.log(error);
            }
            console.log('Log has been updated!');
            })
            }

            if (source === 'movie') {
            fs.appendFile('movie_log.txt', JSON.stringify(data, null, '\t'), 'utf8', function(error, response) {
            if (error) {
            return console.log(error);
            }
            console.log('Log has been updated!');
            })
            }
            
            if (source === 'spotify') {
            fs.appendFile('spotify_log.txt', JSON.stringify(data, null, '\t'), 'utf8', function(error, response) {
            if (error) {
            return console.log(error);
            }
            console.log('Log has been updated!');
            })
            }
}