(function () {
	"use strict";
	var ploxfight = window.ploxfight = window.ploxfight || {};

	ploxfight.IO = function IO() {
	};

	var IO = ploxfight.IO;

	IO.prototype.start = function () {
		var thisIO = this;

		var socket = io();

		socket.on('start', function (msg) {
			console.log("received start message!");
		});

		socket.on('update', function (msg) {
			var object = $.parseJSON(msg);
			console.log("the data is: ", JSON.stringify(object, null, 2));

		});

		ploxfight.sendMove = function (name) {
			var move = {
				move: name
			};
			socket.emit('move', move);
		};

	};

})();