# ng-pokedex

ng-pokedex is a RESTful API designed for educational purposes. 
It serves "Pokedex" data which meant to be consumed by a frontend client 
written in any framework of one's choosing, i.e.: jQuery, AngularJS, Angular,
Vue or React

### Installation
```bash
$ git clone https://github.com/Pkthunder/ng-pokedex.git
$ cd ng-pokedex
$ npm install
```
### Getting Started
To start the API server
```bash
$ cd ng-pokedex
$ npm start
```

### Configuration

The only configuration is the port number the RESET API is hosted on.
This is set via a environment variable `NG_POKEDEX_PORT`. Default is `4000`

### RESTful Endpoints

All endpoints start with the base uri `http://localhost:4000/api/v1`
*  `/items`             returns all items
*  `/items/i/:id`       returns the item with the corresponding id
*  `/skills`            returns all skills
*  `/skills/s/:id`      returns the skill with the corresponding id
*  `/pokemon`           returns all pokemon
*  `/pokemon/p/:id`     returns the pokemon with the corresponding id (aka PokeIndex)
