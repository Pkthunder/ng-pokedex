var mongoose = require('mongoose');

var enums = require('../../utils/enums');

var Schema = mongoose.Schema;

// Physical: 	物理 	(\u7269\u7406)
// Variety: 	变化		(\u53d8\u5316)
// Special: 	特殊		(\u7279\u6b8a)

var skillSchema = new Schema({
	name: 			{type: String, required: true},
	skillId: 		{type: String, required: true},
	category: 		{type: String, required: true, enum: enums.skillCategories},
	type:			{type: String, required: true, enum: enums.Types},
	accuracy: 		{type: Number, required: true},
	power: 			{type: Number, required: true},
	pp: 			{type: Number, required: true}
});

exports.schema = skillSchema;
exports.Skill = mongoose.model('Skill', skillSchema);