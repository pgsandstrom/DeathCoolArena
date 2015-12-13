var newGame = function (gameHolder) {
	return new Game(gameHolder);
};

var Game = function Game(gameHolder) {
	this.time = Date.now();
	this.gameHolder = gameHolder;
	this.players = [];
};

Game.prototype.updateMove = function (playerId, move) {

	this.calculateNewState();

	var player = this.getPlayer(playerId);
	var attack = player.attacks[move];
	attack.load = attack.loadTotal;

	this.resolveNextUpdate();
	this.sendGame();
};

Game.prototype.resolveNextUpdate = function () {

	var time = 9999999;
	this.players.forEach(function (player, index, array) {
		//attacks.push.apply(attacks, player.attacks);
		player.attacks.forEach(function (attack) {
			if (attack.load !== 0) {
				time = Math.min(time, attack.load);
			}
			if (attack.refresh !== 0) {
				time = Math.min(time, attack.refresh);
			}
		});
	});

	if (time === 9999999) {
		console.log("nothing to wait for...");
	} else {
		this.time = Date.now();
		var self = this;
		console.log("sleeping for " + time);
		setTimeout(function () {
			//TODO: Blir  det något problem av att vi låter såna här waits ligga kvar, så många kan vara igång samtidigt?
			//TODO: Om inte annat så blir det fler å fler... så vi borde ha en flagga för att någon redan är igång eller nått...
			self.calculateNewState();
			self.sendGame();
			self.resolveNextUpdate();
		}, time);
	}
};

Game.prototype.calculateNewState = function () {
	var newTime = Date.now();
	var timeDiff = newTime - this.time;

	this.players.forEach(function (player) {
		player.attacks.forEach(function (attack) {
			if (attack.load !== 0) {
				attack.load = attack.load - timeDiff;
				if (attack.load < 5) {
					//TODO utför attacken!
					attack.load = 0;
					attack.refresh = attack.refreshTotal;
				}
			} else if (attack.refresh !== 0) {
				attack.refresh = attack.refresh - timeDiff;
				if (attack.refresh < 5) {
					attack.refresh = 0;
				}
			}
		});
	});
};

Game.prototype.sendGame = function () {
	this.gameHolder.sendGame(this);
};

Game.prototype.toJson = function () {
	var gameJson = {};
	gameJson.players = this.players.map(function (player) {
		return player.toJson();
	});
	return gameJson;
};

Game.prototype.addPlayer = function (playerId) {
	var player = new Player(this, playerId);
	this.players.push(player);
};


Game.prototype.getPlayer = function (playerId) {
	for (var i = 0; i < this.players.length; i++) {
		var dude = this.players[i];
		if (dude.id === playerId) {
			return dude;
		}
	}
};

Game.prototype.start = function () {
	this.running = true;
};

Game.prototype.stop = function () {
	this.running = false;
};

ploxfight.Player = function Player(game, id) {
	this.game = game;
	this.id = id;
	this.health = 100;
	this.mana = 100;
	this.attacks = [];
	for (var i = 0; i < 2; i++) {
		this.attacks.push(new Attack(this));
	}
};

var Player = ploxfight.Player;

Player.prototype.toJson = function () {
	var playerJson = {};
	playerJson.id = this.id;
	playerJson.health = this.health;
	playerJson.mana = this.mana;
	playerJson.attacks = this.attacks.map(function (attack) {
		return attack.toJson();
	});
	return playerJson;
};

ploxfight.Attack = function Attack(player) {
	this.player = player;
	this.loadTotal = 1000;
	this.load = 0;
	this.refreshTotal = 2000;
	this.refresh = 0;
	this.description = "attack yo";
};

var Attack = ploxfight.Attack;

Attack.prototype.toJson = function () {
	var attackJson = {};
	attackJson.load = this.load;
	attackJson.loadTotal = this.loadTotal;
	attackJson.refresh = this.refresh;
	attackJson.refreshTotal = this.refreshTotal;
	attackJson.description = this.description;
	return attackJson;
};

exports.newGame = newGame;
