var app = angular.module('twitterApp', []);
app.controller('TwitterCTRL', function($scope, $http) {
    $scope.searchQuery = "";
		$scope.searchNumber = 1;
		$scope.checkbox ={
			JSON : true,
			CSV : false
		};
	
		$scope.recordedTweets=[];
		$scope.twitterSearchFunction = function(){
			var address="http://localhost:3000/code";
			if ($scope.searchQuery != ""){
				var twitterQuery = $scope.searchQuery; //stores twitter query from user input
			}
			else{
				var twitterQuery = {locations:'-73.68,42.72,-73.78,42.82'} //default query if the user doesnt input anything
			}
			var number = $scope.searchNumber;
			var jsontype = $scope.checkbox.JSON;
			var csvtype = $scope.checkbox.CSV;
			console.log(twitterQuery);
			console.log(number);
			
			$.get(address,{track:twitterQuery,number:number,json:jsontype,csv:csvtype},function(response){ // gets tweets with address var
				$scope.recordedTweets = response; //stores the response as a scoped variable
				console.log($scope.recordedTweets);
				$scope.$apply(); //updates the displayed angular scope to show recorded tweets
			});
//			$http.get(address, {track:twitterQuery,number:number}).then(function(response){ // gets tweets with address var
//				$scope.recordedTweets = response.data.statuses; 
//			});
		};
		
});
