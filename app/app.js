var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');

var db = require('./db');
var routes = require('./routes');

var app = express();

// mount morgan module for access logging
app.use(logger('dev'));

// mount both lib and static directories to be served as static files
app.use('/libs', express.static(path.join(__dirname, '../libs')));
app.use('/static', express.static(path.join(__dirname, 'static')));

// mount api here
app.use(routes);


// 404 detector
app.use( function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;

	next(err);
});

app.use( function (err, req, res, next) {
	res.status(err.status || 500);
	res.send(err.message);
});

db.connect()
.then( function () {
	var server = app.listen(4000, function () {
		var host = server.address().address;
		var port = server.address().port;

		host = (host == '::') ? 'localhost' : host;

		console.log('Current NODE_ENV value: %s', app.get('env'));
		console.log('Starting ng-pokedex server, running on pid: %s', process.pid);
		console.log('ng-pokedex is listening at http://%s:%s', host, port);
	});
})