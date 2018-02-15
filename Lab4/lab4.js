var longitude = 0;
var latitude = 0;
var doc_location = document.getElementById("location-info");

var currentweather_data = document.getElementById("currentweather_data"); //HTML DOM location of info for current weather
var current_weather = "";//Text to go in the above location

var weatherforecast_data = document.getElementById("weatherforecast_data"); //HTML DOM location of info for weather forecast
//var weather_forecast = "";

//from W3schools


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        doc_location.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    doc_location.innerHTML = "Latitude: " + position.coords.latitude + 
    ", &emsp;Longitude: " + position.coords.longitude;
		longitude=position.coords.longitude;
		latitude = position.coords.latitude;
		getWeather();
}
//above from W3schools

function getWeather(){
	var api_call = "http://api.openweathermap.org/data/2.5/weather?lat=";
	var api_key = "4f3c9046c1dda2fda4077578a51c0c0d";
	api_call = api_call + latitude + "&lon=" + longitude + "&APPID=" + api_key;
	//alert(api_call);
	$.getJSON(api_call, function(read){
		//alert("inside");
		current_weather += read.name;
		current_weather += ": ";
		current_weather += read.weather[0].description;
		current_weather += ", the temperature is ";
		current_weather += (read.main.temp/10);
		current_weather += " degrees fahrenheit.";
		currentweather_data.innerHTML = current_weather;
	
	});
	
	var api_call_forecast = "http://api.openweathermap.org/data/2.5/forecast?lat="
	api_call_forecast = api_call_forecast + latitude+ "&lon=" + longitude + "&APPID=" + api_key;
	
	$.getJSON(api_call_forecast, function(read){
		//alert("inside forecast");
		//console.log(read.list[0].dt_txt);
		var forecast_data_array = [];
		$.each(read.list, function(i){
			//console.log(read.list[i].dt_txt);
			var new_date = read.list[i].dt_txt;
			var new_temp = read.list[i].main.temp / 10;
			var new_arr = [new_date,new_temp];
			forecast_data_array.push(new_arr);
		});
		forecast_ticker(forecast_data_array);
		
		/* failed attempt at angular nd-repeat code
		var app = angular.module("myApp", []);
			app.controller("myCtrl", function($scope) {
					$scope.weather = forecast_data_array
			});
		*/
		
	});
	
	
}
/* old code for animated ticker, changing out for AngularJS array directive*/
function forecast_ticker(weather_array){
	var i = 0;
	var max = weather_array.length;
	var tick = setInterval(function(){one_add(i)}, 2000);
	
	function one_add(index){
		if (index < max){
			check_nodes(weatherforecast_data);
			var new_node = document.createElement("div");
			var innerstr = "<h2>"+(index+1)+". "+weather_array[index][0]+"</h2><h3>"+weather_array[index][1]+" degrees fahrenheit</h3>";
			new_node.innerHTML = innerstr;
			weatherforecast_data.appendChild(new_node);
			i++;
			
		}
		
	}
}

function check_nodes(element){
	if (element.childElementCount > 4){
		element.removeChild(element.childNodes[0]);
	}
}

getLocation();
var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    $scope.long = longitude;
    $scope.lat = latitude;    
});
