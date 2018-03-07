//Lab6 Twitter API feed, angular and node

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
var json2csv = require('json2csv');
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
// 
var required_fields = [
	'created_at',
	'id',
	'text',
	'user.id',
	'user.name',
	'user.screen_name',
	'user.location',
	'user.followers_count',
	'user.friends_count',
	'user.created_at',
	'user.time_zone',
	'user.profile_background_color',
	'user.profile_image_url',
	'goe',
	'coordinates',
	'place'
];

app.get('/code', function(request, response) {
	//create twitter client instance
	var twitterConnection = new Twitter({
		consumer_key: '0BCsouIb6usGbQesi7x3iKsvV',
		consumer_secret: 'BLlAIlROkzPZ1YdYMpAUKAlzvXLy2gTcn8qOC5J6X60D773D7p',
		access_token_key: '4749531114-EnZaYTm4yVI4DHwmuMBFAo4Pdv0YqBOf6CRk4rm',
		access_token_secret: 'LmARqJRicFX4GXjpaaK7qvKjMGe4IchvJ5hjDOzsw62ta',
	});
	//from stack overflow v
	function fileExists(filePath){
    try
    {
        return fs.statSync(filePath).isFile();
    }
    catch (err)
    {
        return false;
    }
	}
//from stack overflow ^
	
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
			console.log("got tweet # "+myCount);
			myCount += 1; //keeps track of number of tweets recorded
			if (myCount >= desiredNumber){
				//add if statements to make the file(s)// 
				
				if(request.query.json == "true"){
					if(fileExists("marteo2-tweets.json")){
						console.log("JSON file already exists, and will be overwritten")
					};
					
					response.status(200).json(recordedTweets);
					fs.writeFile("marteo2-tweets.json", JSON.stringify(recordedTweets));
					console.log("New JSON file made!");
				};
				
				if(request.query.csv == "true"){
					json2csv({data: recordedTweets, fields: required_fields }, function(err, csv){
						if (err) console.log(err);
						if(fileExists("marteo2-tweets.csv")){
							console.log("CSV file already exists, and will be overwritten")
						};
						fs.writeFile("marteo2-tweets.csv", csv, function(err){
							if (err) throw err;
							console.log("New CSV file made!");
						});
					});
				};				
			
				stream.destroy();
			};
		});
		
		stream.on('error', function(errorMessage){
			console.log(errorMessage);
		});
	});
});