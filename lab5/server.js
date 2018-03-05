//Lab5 Twitter API feed, angular and node

/*var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');*/


//npm package requirements for the application
var express = require('express');
var Twitter = require('twitter');   
var fs = require('fs');
var app = express();
var http = require('http').Server(app);
//end package requirements

app.use(express.static('public'));	//app will reference files in the "public" directory for js and css etc.

app.get('/', function(request, response){
  response.sendFile(__dirname + '/index.html');
});


http.listen(3000, function(){
  console.log('Server up on *:3000');
});

app.get('/code', function(request, response) {
	//create twitter client instance
	var twitterConnection = new Twitter({
		consumer_key: '0BCsouIb6usGbQesi7x3iKsvV',
		consumer_secret: 'BLlAIlROkzPZ1YdYMpAUKAlzvXLy2gTcn8qOC5J6X60D773D7p',
		access_token_key: '4749531114-EnZaYTm4yVI4DHwmuMBFAo4Pdv0YqBOf6CRk4rm',
		access_token_secret: 'LmARqJRicFX4GXjpaaK7qvKjMGe4IchvJ5hjDOzsw62ta',
	});

	
	var myCount=0;  //current number of tweets
	var desiredNumber = request.query.number;  //pulled number of desired tweets from document
	
	var recordedTweets = []; //object to hold tweets
	if (request.query.track){
//		console.log(request.query.track);
	}
	
	console.log(request.query);
	
  twitterConnection.stream('statuses/filter', {track: request.query.track}, function(stream){  	
		stream.on('data', function(singleTweet) {
			
			recordedTweets.push(singleTweet); //pushes the single tweet to recordedTweets array
			myCount += 1; //keeps track of number of tweets recorded
			if (myCount >= desiredNumber){
				response.status(200).json(recordedTweets);
				fs.writeFile("marteo2-tweets.json", JSON.stringify(recordedTweets));
				stream.destroy();
			};
		});
		
		stream.on('error', function(errorMessage){
			console.log(errorMessage);
		});
	});
});