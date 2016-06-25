// USE CONNECTION POOLING

var express = require('express');
var app = express();

var request = require('request');

// MongoDB variables
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongoUrl = 'mongodb://localhost:27017/image_abstract';
var db;
var imgCollection;

var googleAPI = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyDVjDh8jY4rYRa8XjPiGQKkjxwVK0-ohhA&cx=018211912831661093341:svorep4zbp0&q=';
var searchQuery = '';
var testURL = googleAPI + 'funny giraffe'; // DELETE ME DELETE ME DELETE ME

// Initialize connection once
MongoClient.connect(mongoUrl, function(err, database) {
  if(err) throw err;

  db = database;
  imgCollection = db.collection('image_abstract');

  // Start the application after the database connection is ready
  app.listen(3000);
  console.log("Listening on port 3000");
});

// Reuse database object in request handlers
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/index.html');  
});

app.get('/:searchTerm', function (req, res) {
  if (req.query.offset) {
    var offsetQuery = req.query.offset;
  }

  if (req.params.searchTerm) {
    var searchTerm = req.params.searchTerm;
  }

  res.send('works' + offsetQuery + searchTerm);
});

// request(testURL, function(err, res, body) {
//   if (!err && res.statusCode == 200) {
//   	console.log('THIS IS THE RESPONSE:');
//     console.log(res.body); // Show the HTML for the queried page    
//   }
// });