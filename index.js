// Setup basic express server
var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var app = express();

var userDB = null;

var url = 'mongodb://localhost:27017/';
// Use connect method to connect to the Server 

MongoClient.connect(url, function(err, client) {
  if (err == null) {
    var db = client.db('simpleLoginRegister');
    console.log("Connected to MongoDB");
    userDB = db.collection('users');
  }
});

app.listen(7777, function () {
  console.log("Express app running on port 7777");
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/login/', function(req, res, next) { 
  res.setHeader('Content-Type', 'application/json');
  var sendBack = {
    status: "",
    key: ""
  };

  userDB.findOne({username: req.body.username}).then(function (profile) {
    if(profile != null) {
      sendBack.status = "success";
      sendBack.key = profile.key;
      
      res.send(JSON.stringify(sendBack));
    }
    else {
      sendBack.status = "fail";

      res.send(JSON.stringify(sendBack));
    }

  });
  
});

app.post('/register/', function(req, res, next) { 
  res.setHeader('Content-Type', 'application/json');
  var sendBack = {
    status: "",
    key: ""
  };

  var newUser = {
    key: Math.random().toString(36).substring(9),
    username: req.body.username,
    passowrd: req.body.password
  };

  userDB.insertOne(newUser).then(function(profile) {
    sendBack.status = "success";
    sendBack.key = newUser.key;
    
    res.send(JSON.stringify(sendBack));
  });
  
});