var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

var Skill = mongoose.model('Skill');
var Item = mongoose.model('Item');
var Pokemon = mongoose.model('Pokemon');

// Middleware that sets defaults to query parameters
router.use( function (req, res, next) {
	req.query.limit = (!!req.query.limit) ? parseInt(req.query.limit, 10) : 0;

	next();
});

router.get('/items', function (req, res, next) {
	Item.find({}).limit(req.query.limit).exec()
	.then( function (items) {
		res.json(items);
	});
});

router.get('/item/i/:id', function (req, res, next) {
	Item.findOne({_id: req.params.id}).exec()
	.then( function (item) {
		res.json(item);
	});
});

router.get('/skills', function (req, res, next) {
	Skill.find({}).limit(req.query.limit).exec()
	.then( function (skills) {
		res.json(skills);
	});
});

router.get('/skill/s/:id', function (req, res, next) {
	Skill.findOne({_id: req.params.id}).exec()
	.then( function (skill) {
		res.json(skill);
	});
});

var getPokemonQuery = function (query, populate) {
	populate = (populate == 'false') ? false : true;

	if (populate) {
		query = query.populate({
			path: 'moves.skill',
			model: 'Skill'
		});
	}

	return query;
};

router.get('/pokemon', function (req, res, next) {
	var query = getPokemonQuery(
		Pokemon.find({}).limit(req.query.limit), 
		req.query.populate || true);


	query.exec()
	.then( function (pokemon) {
		res.json(pokemon);
	});
});

router.get('/pokemon/p/:id', function (req, res, next) {
	var query = getPokemonQuery(
		Pokemon.findOne({_id: req.params.id}),
		req.query.populate || true);

	query.exec()
	.then( function (pokemon) {
		res.json(pokemon);
	});
});


module.exports = router;