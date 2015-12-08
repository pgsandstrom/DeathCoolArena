var gameCreator = require('./game/gameCreator');

var PlayerHolder = function PlayerHolder(id, number) {
	this.id = id;
	this.number = number;
};

var GameHolder = function GameHolder(io) {
	this.io = io;
	this.players = [];
	this.playerCount = 0;
	this.game = gameCreator.create(this);
};

GameHolder.prototype.addPlayer = function (playerId) {
	this.players.push(new PlayerHolder(playerId, this.playerCount));
	this.game.addPlayer(playerId);
	this.playerCount++;
};

GameHolder.prototype.removePlayer = function (playerId) {
	this.playerCount--;
	for (var i = 0; i < this.players.length; i++) {
		var dudeId = this.players[i].id;
		if (dudeId === playerId) {
			this.players.splice(i, 1);
			break;
		}
	}
	//this.game.removePlayer(playerId);
};

GameHolder.prototype.startGame = function () {
	this.game.start();
	this.io.emit("start");
	console.log("Starting!");
};

GameHolder.prototype.restartGame = function () {
	console.log("Restarting game!");
	this.game.stop();
	this.game = gameCreator.create(this);
	var oldPlayers = this.players;
	this.players = [];
	this.playerCount = 0;
	var thisGameHolder = this;
	oldPlayers.forEach(function (player) {
		thisGameHolder.addPlayer(player.id, player.number);
	});
	this.game.start();
};

GameHolder.prototype.stopGame = function () {
	this.game.stop();
};

GameHolder.prototype.updateMoves = function (playerId, move) {
	this.game.updateMove(playerId, move);
};

GameHolder.prototype.sendGame = function (game) {
	var gameJson = game.toJson();
	var jsonString = JSON.stringify(gameJson);
	this.io.emit('update', jsonString);
};

var gameHolder;

var addPlayer = function (io, playerId) {
	if (gameHolder === undefined) {
		gameHolder = new GameHolder(io);
		gameHolder.addPlayer(playerId);
	} else {
		gameHolder.addPlayer(playerId);
		gameHolder.startGame();
	}
};

var removePlayer = function (playerId) {
	gameHolder.removePlayer(playerId);
	console.log("stopping game");
	gameHolder.stopGame();
	gameHolder = undefined;
};

var updateMoves = function (playerId, moves) {
	gameHolder.updateMoves(playerId, moves);
};


exports.addPlayer = addPlayer;
exports.removePlayer = removePlayer;
exports.updateMoves = updateMoves;