var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require("path");
var session = require('express-session');

var userController = require('./userController');
var Mongo = require('./mongoConfig');
var http = require('http');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: '12345', saveUninitialized: false, resave: false}));
app.use(express.static(__dirname + '/views'));

var isLoggedIn = function(req, res, next) {
	if (!req.session.username) {
		res.redirect('/');
	}
	next();
}

var checkExistingSession = function(req, res, next) {
	if (req.session.username) {
		res.redirect('/home');
	}
	next();
}

app.get('/', checkExistingSession, function(req, res) {
	res.sendFile(path.join(__dirname+'/views/login.html'));
});

app.get('/register', function(req, res) {
	res.sendFile(path.join(__dirname+'/views/register.html'));
});

app.get('/home', isLoggedIn, function(req, res) {
	res.sendFile(path.join(__dirname+'/views/home.html'));
});

app.get('/getUsername', isLoggedIn, userController.getUsername);

app.get('/logout', isLoggedIn, function(req, res) {
	var username = req.session.username;
	req.session.destroy();
	res.send({'success': true});
});

app.get('/resetPassword', function(req, res) {
	res.sendFile(path.join(__dirname+'/views/reset_password.html'));
});

app.post('/reset', userController.resetPassword);
app.post('/login', userController.login);
app.post('/register', userController.register);

app.listen(3000);
console.log("server running on 3000");