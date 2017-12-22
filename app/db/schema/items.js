var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var itemSchema = new Schema({
	name: 		{type: String, required: true}
});

exports.schema = itemSchema;
exports.Item = mongoose.model('Item', itemSchema);