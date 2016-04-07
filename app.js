var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

require("./game/globals");
var gameInstance = require('./gameHolder.js');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
	res.sendfile('index.html');
});

io.on('connection', function (socket) {
	var playerId = socket.id;


	console.log("connection: " + playerId);
	gameInstance.addPlayer(io, playerId);
	socket.emit("identity", playerId);

	socket.on('move', function (move) {
		// console.log("move: " + JSON.stringify(move, null, 2));
		gameInstance.updateMoves(playerId, move);
	});

	socket.on('disconnect', function () {
		console.log("disconnect: " + playerId);
		gameInstance.removePlayer(playerId);
	});
});

http.listen(3000, function () {
	console.log('listening on *:3000');
});