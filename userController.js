var express = require('express');

var router = express.Router();
module.exports = router;

var Mongo = require('./mongoConfig');
var session = require('express-session');

module.exports.register = function(req, res) {
	if (!req.body.username || !req.body.password) {
        res.send({'success': false, 'reason': 'Missing One or More Details.'});
    } else {
		var callbackSaveUser = function(success, response) {
			if (success) {
				req.session.username = JSON.parse(response).username;
				res.send({'success': true, 'username': JSON.parse(response).username});
			} else {
				res.send({'success': false, 'reason': 'Unable to authorize, please try again'});
			}
		}

		var callbackCheckUserExistence = function(success, response) {
			if (success) {
				res.send({'success': false, 'reason': 'User already exists! Login or Try different username'});
			} else {
				Mongo.insert('user', {'username': req.body.username,'password': req.body.password}, callbackSaveUser);
			}
		}

		Mongo.retrieve('user', {'username': req.body.username}, callbackCheckUserExistence);
    }
};


module.exports.login = function(req, res) {
	if (!req.body.username || !req.body.password) {
		res.send({'success': false, 'reason': 'Missing One or More Details'});
	}

	var callbackRetrieveUser = function(success, response) {
		if (success) {
			req.session.username = JSON.parse(response).username;
			res.send({'success': true, 'username': JSON.parse(response).username});
		} else {
			res.send({'success': false, 'reason': 'username or password does not match'});
		}
	}

	Mongo.retrieve('user', {'username': req.body.username, 'password': req.body.password}, callbackRetrieveUser);
};


module.exports.getUsername = function(req, res) {
	var callbackGetUser = function(success, response) {
		if (success) {
			res.send({'success': true, 'username': req.session.username});
		} else {
			res.send({'success': false, 'reason': 'failed to retrieve session'});
		}
	}

	Mongo.retrieve('user', {username: req.session.username}, callbackGetUser);
};


module.exports.resetPassword = function(req, res) {
	if (!req.body.username || !req.body.old_password || !req.body.new_password) {
		res.send({'success': false, 'reason': 'Missing One or More Details'});
	}

	if (req.body.old_password == req.body.new_password) {
		res.send({'success': false, 'reason': 'New Password should be different from old password.'});
	}

	var callbackVerifySuccess = function(success, response) {
		if (success) {
			res.send({'success': true, 'message': 'Password reset success'})
		} else {
			res.send({'success': false, 'reason': 'Error resetting password'})
		}
	}

	var callbackCheckUserExistence = function(success, response) {
		if (success) {
			var data = {'password': req.body.new_password}
			Mongo.update('user', {'username': req.body.username}, data, callbackVerifySuccess);
		} else {
			res.send({'success': false, 'reason': 'username/old_password do not match.'})
		}
	}

	Mongo.retrieve('user', {'username': req.body.username, 'password': req.body.old_password}, callbackCheckUserExistence);
};
