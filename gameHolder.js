var gameCreator = require('./game/gameCreator');

var PlayerHolder = function PlayerHolder(id, number) {
	this.id = id;
	this.number = number;
};

var GameHolder = function GameHolder(io) {
	this.io = io;
	this.playerHolders = [];
	this.playerCount = 0;
	this.game = gameCreator.create(this);
	this.running = false;
};

GameHolder.prototype.addPlayer = function (playerId) {
	this.playerHolders.push(new PlayerHolder(playerId, this.playerCount));
	this.game.addPlayer(playerId);
	this.playerCount++;
	if (this.playerCount > 1) {
		this.running = true;
	}
};

GameHolder.prototype.removePlayer = function (playerId) {
	this.playerCount--;
	for (var i = 0; i < this.playerHolders.length; i++) {
		var dudeId = this.playerHolders[i].id;
		if (dudeId === playerId) {
			this.playerHolders.splice(i, 1);
			break;
		}
	}
	this.running = false;
};

GameHolder.prototype.startGame = function () {
	this.running = true;
	this.io.emit("start");
	this.game.sendGame();
	console.log("Starting!");
};

GameHolder.prototype.restartGame = function () {
	console.log("Restarting game!");
	this.game.stop();
	this.game = gameCreator.create(this);
	var oldPlayerHolders = this.playerHolders;
	this.playerHolders = [];
	this.playerCount = 0;
	var thisGameHolder = this;
	oldPlayerHolders.forEach(function (playerHolder) {
		thisGameHolder.addPlayer(playerHolder.id, playerHolder.number);
	});
	this.game.start();
};

GameHolder.prototype.stopGame = function () {
	this.game.stop();
};

GameHolder.prototype.updateMoves = function (playerId, move) {
	if (this.running) {
		this.game.updateMove(playerId, move);
	}
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
	if (gameHolder.running === false) {
		// TODO: Lite fult
		var io = gameHolder.io;
		var playerHolders = gameHolder.playerHolders;
		gameHolder = undefined;
		playerHolders.forEach(function (playerHolder) {
			addPlayer(io, playerHolder.id);
		});
	}
};

var updateMoves = function (playerId, moves) {
	gameHolder.updateMoves(playerId, moves);
};


exports.addPlayer = addPlayer;
exports.removePlayer = removePlayer;
exports.updateMoves = updateMoves;