var fs = require('fs');

var action = process.argv[2];
var search = process.argv[3];

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

function spotifySearch() {
        var spotify = require('spotify');
        spotify.search({ type: 'track', query: search }, function(err, response) {
        if ( err ) {
        console.log('Error occurred: ' + err);
        return;
        }
        console.log(response.tracks)

});
}

// if no movie is provided then the program will output information for the movie: 'Mr. Nobody'
function movieSearch() {
    var request = require('request');
    if(search == undefined) {
        search = 'Mr. Nobody';
    }
    var url = 'http://www.omdbapi.com/?t=' + search +'&y=&plot=short&r=json&tomatoes=true'
    request(url, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            //string data
            console.log(body)
            //converts body into JSON object
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
            var data = 'Title: '+ body.Title +'\n'+'Year Released: '+body.Year+"\n"+'Plot: '+ body.Plot +'\n'+
            'Countries Released in: '+body.Country+"\n"+'Languages Released in: '+body.Language+"\n"+
            'Actors: '+ body.Actors +'\n'+'IMDB Rating: '+body.imdbRating+"\n"+
            'Rotten Tomatoes Rating: '+ body.tomatoRating +'\n'+
            'Rotten Tomatoes URL: '+ body.tomatoURL+'\n\n';
            // var obj = {"Title": body.Title, "Year Released": body.Year}
            fs.appendFile('log.txt', data, 'utf8', function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log('Log has been updated!')
            })
        }
    })
}


// shows your last 20 tweets and when they were created at in the terminal
function tweetSearch() {
    var Twitter = require('twitter');
    var key = require('./key.js');
    var Tweets = new Twitter(key.twitterKeys);

    var params = {screen_name: 'nodejs', count: 20};
    Tweets.get('statuses/user_timeline', params, function(error, tweets, response){
      if (!error) {
        for (var i = 0; i < tweets.length; i++) {
            console.log(tweets[i].created_at + " || " + tweets[i].text);
            console.log('--------------------------------------------------------------');
        }
      }
    });
}
// Using the fs package in node, the program would take the text inside of random.txt and use it to call the first command with the second part as it's parameter
function whateverYouSay() {

}