var express = require('express');

var router = express.Router();
module.exports = router;

var mongo = require('mongodb');
var uri = 'mongodb://<dbuser>:<dbpswrd>@ds139791.mlab.com:39791/gpa_task_2';

module.exports.insert = function(collectionName, json, callback) {
	mongo.MongoClient.connect(uri, function(err, db) {
		if (!err) {
			db.collection(collectionName).insert(json, function(err, user) {
				if (err) {
					throw new Error('Error saving user into database'); 
				} else {
					callback(true, JSON.stringify(user.ops[0]));
				}
			});
		} else {
			throw new Error('Error connecting database');
		}
	});
};

module.exports.retrieve = function(collectionName, json, callback) {
	mongo.MongoClient.connect(uri, function(err, db) {
		if (!err) {
			db.collection(collectionName).find(json).toArray(function(err, user) {
				if (err) {
					throw new Error('Error retrieving database'); 
				} else {
					if (user != '') {
						callback(true, JSON.stringify(user[0]));
					} else {
						callback(false, {'reason': 'user does not exist'});
					}
				}
			});
		} else {
			throw new Error('Error connecting database');
		}
	});
};


module.exports.update = function(collectionName, doc, json, callback) {
	mongo.MongoClient.connect(uri, function(err, db) {
		if (!err) {
			db.collection(collectionName).updateOne(doc, {$set: json}, function(err, user) {
				if (err) {
					callback(false, 'Failure updating database')
				} else {
					if (user.modifiedCount == 1 && user.matchedCount == 1) {
						callback(true, 'abcd');
					}
				}
			});
		} else {
			throw new Error('Error connecting database');
		}
	});
};
