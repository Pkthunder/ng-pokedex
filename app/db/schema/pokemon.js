var mongoose = require('mongoose');

var enums = require('../../utils/enums');

var Schema = mongoose.Schema;

var baseStatSchema = new Schema({
	attack: 		{type: Number, required: true},
	defense: 		{type: Number, required: true},
	spAtk:  		{type: Number, required: true},
	spDef: 			{type: Number, required: true},
	hp: 	 		{type: Number, required: true},
	speed: 			{type: Number, required: true}
},
{
	_id: false,
	autoIndex: false
});

var moveSchema = new Schema({
	skill: 			{type: Schema.Types.ObjectId, ref: 'Skill', required: true},
	//method: 		{type: String, required: true, enum: enums.skillMethods} 
	method: 		{type: String, required: true}
},
{
	_id: false,
	autoIndex: false
});

var pokemonSchema = new Schema({
	name: 			{type: String, required: true},
	pokeIndex: 		{type: String, required: true},
	type:			[{type: String, required: true, enum: enums.Types}],
	base: 			baseStatSchema,
	moves: 			[moveSchema]
});

exports.schema = pokemonSchema;
exports.Pokemon = mongoose.model('Pokemon', pokemonSchema);