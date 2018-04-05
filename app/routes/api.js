const express = require('express');

const db = require('../utils/db');

const router = express.Router();

// Middleware that sets defaults to query parameters
router.use( function (req, res, next) {
	req.query.limit = (!!req.query.limit) ? parseInt(req.query.limit, 10) : 0;

	next();
});

// GET /api/v1/items
router.get('/items', function (req, res, next) {
	res.json(db.items.toArray(req.query.limit));
});

// GET /api/v1/items/i/:id
router.get('/items/i/:id', function (req, res, next) {
	res.json(db.items[req.params.id]);
});

// GET /api/v1/skills
router.get('/skills', function (req, res, next) {
    res.json(db.skills.toArray(req.query.limit));
});

// GET /api/v1/skills/s/:id
router.get('/skills/s/:id', function (req, res, next) {
    res.json(db.skills[req.params.id]);
});

// GET /api/v1/pokemon
router.get('/pokemon', function (req, res, next) {
    res.json(db.pokemon.toArray(req.query.limit));
});

// GET /api/v1/pokemon/p/:id
router.get('/pokemon/p/:id', function (req, res, next) {
    res.json(db.pokemon[req.params.id]);
});

module.exports = router;