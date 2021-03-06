var express = require('express');
var router = express.Router();

var mc = require('mongodb').MongoClient;
var config = require('../config/config');

var url = config.url;
var coll = 'business';

/* GET business listings. */
router.get('/', function(req, res, next) {
  var query = {};
  mc.connect(url, function(err, db){
  db.collection(coll).find(query).sort({'name' : 1}).limit(20).toArray(function (err, businesses) {
    if (err) {
      console.error(err);
    } else {
      res.json(businesses);
      db.close();
    }
  });
 })
});

/* GET a business based on its id. */
router.get('/:businessId', function(req, res, next) {
  var match = { '$match': { 'business_id' : req.params.businessId }};
  var lookup = { '$lookup': { 'from' : 'review', 'localField' : 'business_id', 'foreignField' : 'business_id', 'as' : 'reviews' }};
  var pipeline = [ match, lookup ];
  mc.connect(url, function(err, db){
  db.collection(coll).aggregate(pipeline, function (err, business) {
    if (err) {
      console.error(err);
    } else {
      res.json(business);
      db.close();
    }
  });
 })
});

module.exports = router;
