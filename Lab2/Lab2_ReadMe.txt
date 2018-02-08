Lab 2 - weather API

began by registering with weather API service and acquiring an access key.

Created a basic html page that could be populated by info from the API calls in the JS file. 

Wrote JS to first acquire the location of the computer, then use the current location to make two API calls and parse the JSON from the API. The first call is for the current weather, the second is for the forecast. The current weather is populated directly into the HTML page, while the array of forecast data is parsed through with a setInterval JS function to populate one step at a time into the HTML page, deleting the first child every iteration once there are five children. 
