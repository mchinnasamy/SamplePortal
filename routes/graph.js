var express = require('express');
var router = express.Router();

var mc = require('mongodb').MongoClient;
var config = require('../config/config');

var url = config.url;
var collection = 'user';

/* GET facets for business collection */
router.get('/:userId', function(req, res, next) {
  var userId = req.params.userId;
  mc.connect(url, function(err, db){
  db.collection(collection).aggregate( [
     {
       '$match':
        { 'user_id' : userId}
     },
     { '$graphLookup':
        { 'from': 'user',
               'startWith': [ userId] ,
               'connectFromField': 'friends',
               'connectToField': 'user_id',
               'as': 'socialNetwork',
               'maxDepth': 2,
               'depthField':'depth',
               'restrictSearchWithMatch': { 'review_count' : {'$gte' : 10} }
         }
     },
     { '$project':
         {     '_id':0,
               'name':1,
               'Network':'$socialNetwork.name',
               'Depth':'$socialNetwork.depth' ,
               'Review Count':'$socialNetwork.review_count'
         }
     }
   ], function(err, facets) {
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
