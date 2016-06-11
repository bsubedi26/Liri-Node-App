var fs = require('fs');

fs.readFile('movie_log.txt', 'utf8', function(err, data) {
	//Turns data from string to object

	console.log(JSON.parse(data))
	console.log(typeof(data))
	// console.log(obj)
	// var num = parseFloat(obj["IMDB Rating"])
	// if (num > 7) {
	// 	console.log("greater than seven")
	// }
})


// var movie = require('./movie_log.txt');

// console.log(typeof(movie.obj))