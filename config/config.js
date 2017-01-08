var MONGO_HOST = process.env.MONGO_HOST || 'localhost';
var MONGO_PORT = (process.env.MONGO_PORT || 27017);
var MONGO_DB = (process.env.MONGO_DB || 'yelp');

var url = 'mongodb://' + MONGO_HOST + ':' + MONGO_PORT + '/' + MONGO_DB;

exports.url = url;
