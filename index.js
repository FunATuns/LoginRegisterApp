var express = require('express'); //Pull in express
var bodyParser = require('body-parser'); //Pull in json parser for express
var MongoClient = require('mongodb').MongoClient; //Pull in MongoDB client

var app = express(); //Set up middleware

var userDB = null; //Set up global DB var

var url = 'mongodb://localhost:27017/'; //URL to DB


MongoClient.connect(url, function(err, client) { //Connect to the DB
  if (err == null) { //If we have no errors
    var db = client.db('simpleLoginRegister'); //Find the specific DB
    console.log("Connected to MongoDB"); //Let us know that the we've connected to the DB
    userDB = db.collection('users'); //Create or find a collection named users
  }
});

app.listen(7777, function () { //Set up our webserver on port 7777
  console.log("Express app running on port 7777");
});

app.use(function(req, res, next) { //Remove CORS policy, helps for testing
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json()); //Use bodyparser to parse incoming json
app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/login/', function(req, res, next) { //Event handler for if a user posts through login
  res.setHeader('Content-Type', 'application/json'); //Establish the json we are going to send back
  var sendBack = {
    status: "",
    key: ""
  };

  userDB.findOne({username: req.body.username}).then(function (profile) { //Check for the username
    if(profile != null && req.body.password == profile.password) { //If profile exists check if the password works
      sendBack.status = "success";
      sendBack.key = profile.key; //Send back success with key
      
      res.send(JSON.stringify(sendBack));
    }
    else {
      sendBack.status = "fail"; //Uh oh the profile doesn't exist

      res.send(JSON.stringify(sendBack));
    }

  });
  
});

app.post('/register/', function(req, res, next) {  //Event handler if the user posts to register
  res.setHeader('Content-Type', 'application/json');
  var sendBack = {
    status: "",
    key: ""
  };

  var newUser = {
    key: Math.random().toString(36).substring(9),
    username: req.body.username,
    password: req.body.password
  };

  userDB.insertOne(newUser).then(function(profile) {
    sendBack.status = "success";
    sendBack.key = newUser.key;
    
    res.send(JSON.stringify(sendBack));
  });
  
});