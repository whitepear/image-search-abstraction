var express = require('express');
var request = require('request');
var path = require('path');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB variables
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongoUrl = 'mongodb://localhost:27017/image_abstract';
var db;
var imgCollection;

var googleAPI = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyDVjDh8jY4rYRa8XjPiGQKkjxwVK0-ohhA&cx=018211912831661093341:svorep4zbp0&q=';

// Initialize connection once
// Reuse database object in request handlers
MongoClient.connect(mongoUrl, function(err, database) {
  if(err) throw err;

  db = database;
  imgCollection = db.collection('image_abstract');

  // Start the application after the database connection is ready
  app.listen(3000);
  console.log("Listening on port 3000");
});

// root route serves instructions
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/public/index.html');  
}); // end '/'

// display recent searches
app.get('/img', function (req, res) {  
  imgCollection.find({}, {_id: 0}).sort({when: -1}).limit(25).toArray(function (err, docs) {
    if (err) {
      console.log('/img route error');
    } else {
      res.send(docs);
    }
  }); // end .find()  
}); // end '/img'

// /img/searchTerm route serves API call
app.get('/img/:searchTerm', function (req, res) {
  
  var searchTerm = req.params.searchTerm;
  var searchURL = googleAPI + searchTerm;  
  
  // set offset of search via start query parameter
  if (req.query.offset && !isNaN(req.query.offset)) {
    console.log('Setting offsetQuery to query entry.');
    var offsetQuery = req.query.offset;
    searchURL = searchURL + '&start=' + offsetQuery; 
  }  

  // log search term and time of search to database
  var searchObj = {
    term: searchTerm,
    when: new Date()
  };  
  
  imgCollection.insertOne(searchObj, function (err, result) {
    if (err) {
      console.log('Insert error occurred.');
    } else {
      console.log('Document successfully inserted.');
    }

    // make http get request to the Google Custom Search API
    request(searchURL, function (err, APIRes, body) {
      if (!err && APIRes.statusCode == 200) {
        console.log('Request made');
        
        var bodyObj = JSON.parse(APIRes.body);      
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

          var searchResult = { 
            url: pageLink,
            description: imageTitle,
            image_url: imageLink
          };
          filteredResults.push(searchResult);
        }       
        res.json(filteredResults);  
      }
    }); // end request
  }); // end imgCollection.insertOne  
}); // end '/img/:searchTerm'