Lab 5 README Olivia Martens

Objective 1 
---------------------

package.json should include command for installing node.js express packages

$ npm install express --save

logic:

1.The twitter object is initialized inside of server.js, where a connection is made to a twitter stream. 
2. Input is given through the angular interface in index.html. 
3. This input is then processed by submitting a form to the code.js file which takes the form input and processes a get request on the server. 
4. The server returns information which is placed in a scoped object to be referenced with angular ng-repeat for each tweet.
5. The data is also saved to a document called marteo2-tweets.json

code.js and the styling lab5.css are in the public directory