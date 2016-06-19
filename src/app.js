// USE CONNECTION POOLING

var express = require('express');
var app = express();

var request = ('request');

// MongoDB variables
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongoUrl = 'mongodb://localhost:27017/image_abstract';
var db;
var imgCollection = db.collection('image_abstract');

// Initialize connection once
MongoClient.connect(mongoUrl, function(err, database) {
  if(err) throw err;

  db = database;

  // Start the application after the database connection is ready
  app.listen(3000);
  console.log("Listening on port 3000");
});

// Reuse database object in request handlers
app.get("/", function(req, res) {
  imgCollection.find({}, function(err, docs) {
    // docs found using the same db connection
    // do something
  });
});

request("URL*GOES*HERE", function(error, response, body) {
  console.log(body);
});