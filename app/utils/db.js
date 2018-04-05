/**
 * This file is used to mock a database hosting Pokemon data
 */

const Promise = require('bluebird');
const path = require('path');

Array.prototype.limit = function (limit) {
    return this.slice(0, this.length - limit);
};

const DATA_PATH = path.resolve(__dirname, '../../data');

class Collection {
    constructor () {
        this._len = 1;
    }

    add (item) {
        const idx = this._len;
        this._len++;

        this[idx] = item;

        if (!!item.id) {
            this[item.id] = this[idx];
        }
    }

    push () {
        return this.add.apply(this, arguments);
    }

    toArray (limit) {
        return Object.keys(this)
            .filter(key => !isNaN(parseInt(key, 10)))
            .map(idx => this[idx])
            .limit(limit);
    }

    get length () {
        return this._len;
    }

    get (id) {
        return this[id];
    }
}

class Mockbase {
    constructor () {
        this.pokemon = new Collection();
        this.skills = new Collection();
        this.items = new Collection();
    }

    init () {
        return new Promise( (resolve, reject) => {
            try {
                loadMockDatabase();

                return resolve(this);
            }
            catch (e) {
                return reject(e);
            }
        });
    }
}

const _db = new Mockbase();

const _translateTypes = {
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

const translateTypes = function (key) {
    return _translateTypes[key];
};

const loadItems = function () {
    let itemsData = null;
    try {
        itemsData = require(path.join(DATA_PATH, 'items.json'));
    }
    catch (e) {
        console.error(e);
        console.error('Error loading items, exiting...');
        process.exit();
    }

    itemsData.forEach((item, idx) => {
        _db.items.add({
            id:             idx + 1,
            name:           item.ename
        });
    });
};

const loadSkills = function () {
    // Physical: 	物理 	(\u7269\u7406)
    // Variety: 	变化		(\u53d8\u5316)
    // Special: 	特殊		(\u7279\u6b8a)

    const translateCategory = {
        '\u7269\u7406': 'Physical',
        '\u7279\u6b8a': 'Special',
        '\u53d8\u5316': 'Variety'
    };

    let skillsData = null;
    try {
        skillsData = require(path.join(DATA_PATH, 'skills.json'));
    }
    catch (e) {
        console.error('Error loading skills, exiting...');
        process.exit();
    }

    skillsData.forEach(s => {
        _db.skills.add({
            id: 		    s.id,
            name: 			s.ename,
            category: 		translateCategory[s.category],
            type:			translateTypes(s.type),
            accuracy: 		s.accuracy || null,
            power: 			s.power || null,
            pp: 			s.pp || null
        });
    });
};

const loadPokemon = function () {
    let pokemonData = null;
    try {
        pokemonData = require(path.join(DATA_PATH, 'pokedex.json'));
    }
    catch (e) {
        console.error('Error loading Pokemon, exiting...');
        process.exit();
    }

    const base2Base = function (base) {
        return {
            atk: 	        base['Attack'],
            def: 	        base['Defense'],
            spa: 	        base['Sp.Atk'],
            spd: 	        base['Sp.Def'],
            hp: 	        base['HP'],
            speed: 	        base['Speed']
        };
    };

    const parseLearnSet = function (skills) {
        const moves = [];

        Object.keys(skills).forEach(method => {
            (skills[method]).forEach(skillId => {
                moves.push({
                    method: (method === 'level_up') ? 'level-up' : method,
                    skill: _db.skills[skillId]
                });
            });
        });

        return moves;
    };

    pokemonData.forEach(p => {
        _db.pokemon.add({
            id:             p.id,
            name:           p.ename,
            pokeIndex:      p.id,
            type:           p.type.map(t => translateTypes(t)),
            base:           base2Base(p.base),
            skills:         parseLearnSet(p.skills)
        });
    });
};

const loadMockDatabase = function () {
    console.log('loading items...');
    loadItems();

    console.log('loading skills...');
    loadSkills();

    console.log('loading Pokemon...');
    loadPokemon();

    return _db;
};

module.exports = _db;