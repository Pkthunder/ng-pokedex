var mongoose = require('mongoose');
var Promise = require('bluebird');

var db = require('../app/db');

var Skill = mongoose.model('Skill');
var Item = mongoose.model('Item');
var Pokemon = mongoose.model('Pokemon');

var _translateTypes = { 
	'一般': 'Normal',
	'格斗': 'Fighting',
	'格鬥': 'Fighting',
	'飞行': 'Flying',
	'飛行': 'Flying',
	'毒': 'Poison',
	'地上': 'Ground',
	'岩石': 'Rock',
	'虫': 'Bug',
	'幽灵': 'Ghost',
	'幽靈': 'Ghost',
	'钢': 'Steel',
	'炎': 'Fire',
	'水': 'Water',
	'草': 'Grass',
	'电': 'Electric',
	'電': 'Electric',
	'超能': 'Psychic',
	'超能力': 'Psychic',
	'冰': 'Ice',
	'龙': 'Dragon',
	'恶': 'Dark',
	'惡': 'Dark',
	'妖精': 'Fairy' 
};

var translateTypes = function (key) {
	return _translateTypes[key];
};

db.connect()
.then( function () {

	return loadItems();

})
.then( function () {
	
	return loadSkills();

})
.then( function () {
	
	return loadPokemon();

})
.then( function () {
	return Promise.all([
		Item.count().exec(),
		Skill.count().exec(),
		Pokemon.count().exec()
	])
	.then( function (totals) {
		console.log(`${ totals[0] } items were loaded`);
		console.log(`${ totals[1] } skills were loaded`);
		console.log(`${ totals[2] } Pokemon were loaded`);
	})
})
.finally( function () {
	console.log('Done.');
	mongoose.disconnect();
});


var base2Base = function (base) {
	return {
		attack: 	base['Attack'],
		defense: 	base['Defense'],
		spAtk: 		base['Sp.Atk'],
		spDef: 		base['Sp.Def'],
		hp: 		base['HP'],
		speed: 		base['Speed']
	}
};

var resolveSkillId = function (id) {
	return Skill.findOne({skillId: id}).exec()
	.then( function (s) {
		return s._id;
	});
}

var skills2Move = function (skills) {
	var moves = [];

	return Promise.mapSeries(Object.keys(skills), function (method) {
		return Promise.mapSeries(skills[method], function (skillId) {
			return resolveSkillId(skillId)
			.then( function (_id) {
				method = (method == 'level_up') ? 'level' :
					(method == 'pre-evolution') ? 'pre' : method;

				moves.push({method: method, skill: _id});
			});
		});
	})
	.then( function () {
		return moves;
	});
};

var loadPokemon = function () {
	var pokemonData = require('../data/pokedex.json');

	console.log('Adding Pokemon to database...\n');
	process.stdout.write('Uploading... [ ');

	return Promise.mapSeries(pokemonData, function (p, index) {

		if (index % 15 === 0) {
			//process.stdout.write('\u2588');
			process.stdout.write('=');
		}

		return skills2Move(p.skills)
		.then( function (moves) {
			return Pokemon.create({
				name: p.ename,
				pokeIndex: p.id,
				type: p.type.map(t => translateTypes(t)),
				base: base2Base(p.base),
				moves: moves
			});
		});
	})
	.then( function () {
		process.stdout.write(' ]\n\n');
		console.log('All Pokemon have been loaded...');
	});
};

var loadSkills = function () {
	// Physical: 	物理 	(\u7269\u7406)
	// Variety: 	变化		(\u53d8\u5316)
	// Special: 	特殊		(\u7279\u6b8a)

	var translateCategory = {
		'\u7269\u7406': 'Physical',
		'\u7279\u6b8a': 'Special',
		'\u53d8\u5316': 'Variety'
	}

	var skillData = require('../data/skills.json');

	return Promise.mapSeries(skillData, function (s) {
		return Skill.create({
			name: 			s.ename,
			skillId: 		s.id,
			category: 		translateCategory[s.category],
			type:			translateTypes(s.type),
			accuracy: 		s.accuracy || -1,
			power: 			s.power || -1,
			pp: 			s.pp || -1
		})
		.catch( function (err) {
			console.log(`Err with ${ s.ename }`);
			throw err;
		});
	})
	.then( function () {
		console.log('All Skills have been loaded...');
	})
};

var loadItems = function () {
	var itemData = require('../data/items.json');

	return Promise.mapSeries(itemData, function (i) {
		return Item.create({name: i.ename});
	})
	.then( function () {
		console.log('All Items have been loaded...');
	})
};