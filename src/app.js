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
  if (req.params.searchTerm) {
    var searchTerm = req.params.searchTerm;
    var searchURL = googleAPI + searchTerm;
  }

  if (req.query.offset) {
    var offsetQuery = req.query.offset;
  }
  
  request(searchURL, function (err, apiRes, body) {
    if (!err && apiRes.statusCode == 200) {
      var bodyObj = JSON.parse(apiRes.body);      
      var filteredResults = [];
      
      for (var i = 0; i < bodyObj.items.length; i++) {

        if (bodyObj.items[i].link) {
          pageLink = bodyObj.items[i].link;
        } else {
          var pageLink = "Missing";          
        }

        if (bodyObj.items[i].title) {
          imageTitle = bodyObj.items[i].title;
        } else {
          var imageTitle = "Missing";          
        }        

        // idiomatic nested property test: http://blog.osteele.com/posts/2007/12/cheap-monads/
        var imageLinkTest = (((bodyObj.items[i].pagemap||{}).cse_image||{})[0]||{}).src;
        if (imageLinkTest) {
          var imageLink = bodyObj.items[i].pagemap.cse_image[0].src;
        } else {
          imageLink = 'Missing';
        }

        var searchResult = '{ "url": ' + pageLink + ', "description": ' + imageTitle + ', "image_url": ' + imageLink + ' }';
        filteredResults.push(searchResult);
      }       
      res.send(filteredResults);  
    }
  });
  
});