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
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var app = express();
var http = require('http').Server(app);
const assert = require('assert');
var js2xmlparser = require("js2xmlparser");
//end package requirements

app.use(express.static('public'));	//app will reference files in the "public" directory for js and css etc.

app.get('/', function(request, response){
  response.sendFile(__dirname + '/index.html');
});


http.listen(3000, function(){
  console.log('Server up on *:3000');
});

//Database Stuff

mongoose.connect('mongodb://localhost/lab7_db');

const Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

const TweetSchema = new Schema({
 id: ObjectId,
 text: String,
 user_name: String,
 profile_image_url: String
});

const TweetModel = mongoose.model('Tweet', TweetSchema);


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
app.get('/dbpull', function(request, response) { //attempt at DB pull?
	var dbmodel_attempt = mongoose.model('Tweet');
	var query = dbmodel_attempt.findOne({});
	console.log(query.text);
});
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
	
	var recordedTweets = []; //object to hold tweet
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
					var jsonname = request.query.filetitle + ".json";
					if(fileExists(jsonname)){
						console.log("JSON file already exists, and will be overwritten")
					};
					
					response.status(200).json(recordedTweets);
					fs.writeFile(jsonname, JSON.stringify(recordedTweets));
					console.log("New JSON file made!");
				};
				
				if(request.query.csv == "true"){
					var csvname = request.query.filetitle + ".csv";
					json2csv({data: recordedTweets, fields: required_fields }, function(err, csv){
						if (err) console.log(err);
						if(fileExists(csvname)){
							console.log("CSV file already exists, and will be overwritten")
						};
						fs.writeFile(csvname, csv, function(err){
							if (err) throw err;
							console.log("New CSV file made!");
						});
					});
				};
				if(request.query.xml == "true"){
					var xmlname = request.query.filetitle + ".xml";
					fs.writeFile(xmlname, js2xmlparser.parse("tweets", JSON.stringify(recordedTweets)));
				};
				
				const TweetModel = mongoose.model('Tweet');

	
				for( var i=0; i<recordedTweets.length; i++){
					console.log("in tweet");
					const instance = new TweetModel();
					instance.text = recordedTweets[i].text;
					instance.user_name = recordedTweets[i].user.screen_name;
					console.log(recordedTweets[i].user.screen_name);
					instance.profile_image_url = recordedTweets[i].user.profile_image_url_http;
					instance.save(function (err) {
						console.log("done");
					});
				}
			
				stream.destroy();
			};
		});
		
		stream.on('error', function(errorMessage){
			console.log(errorMessage);
		});
	});
});