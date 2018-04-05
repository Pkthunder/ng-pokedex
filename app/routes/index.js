const express = require('express');

const router = express.Router();

router.get('/', function (req, res, next) {
	res.send('Hello! - \u7279\u6b8a');
});

router.use('/api/v1', require('./api'));

module.exports = router;