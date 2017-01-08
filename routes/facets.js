var express = require('express');
var router = express.Router();

var mc = require('mongodb').MongoClient;
var config = require('../config/config');

var url = config.url;
var coll = 'business';

/* GET facets for business collection */
router.get('/', function(req, res, next) {
  mc.connect(url, function(err, db){
  db.collection(coll).aggregate( [
   {
      "$facet" : {

         "ByCategories": [  { "$unwind" : "$categories" },
             { "$match" : {"categories" : { "$in" : ["Restaurants", "Food", "Bars", "Coffee & Tea", "Pizza", "Burgers", "Sandwiches"] }}},
             { "$sortByCount" : "$categories" } ],
         "ByStars": [ { "$bucket" : { "groupBy" : "$stars", boundaries: [ 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5 ], "default" : 0 } } ],
         "ByPriceRange": [ { "$bucket" : { "groupBy" : "$attributes.Price Range", "boundaries" : [ 1, 2, 3, 4, 5 ], "default" : 0 } } ]
      }
   }], function(err, facets) {
    if (err) {
        console.error(err);
    } else {
      res.json(facets);
      db.close();
    }
  });
 });
});

module.exports = router;
