var mongoose = require('mongoose');
var Promise = require('bluebird');

var config = require('../../config');

var Skill = require('./schema/skills');
var Item = require('./schema/items');
var Pokemon = require('./schema/pokemon');

mongoose.Promise = require('bluebird');

var db = config.DB_CONFIG;
var MONGO_URI = `mongodb://${ db.host }:${ db.port }/${ db.db }`;

var connect = function () {
	mongoose.connect(MONGO_URI);

	return new Promise( function (resolve, reject) {
		mongoose.connection.once('open', function () {
			console.log('MongoDB connection established');
			resolve(true);
		});

		mongoose.connection.on('error', function () {
			if (/failed to connect to server \[(.*)\] on first connect/.test(err.message)) {
				console.error(`Could not established connection to mongo db [${ config.MONGO_URI }]. Exitting...`);
				process.exit();
			}
			else {
				reject(err);
			}
		});
	});
};

exports.connect = connect;