(function () {
	"use strict";
	var ploxfight = window.ploxfight = window.ploxfight || {};


	ploxfight.animate = function (game) {

		var identity = ploxfight.identity;

		var player;
		var opponent;
		if (game.players[0].id === identity) {
			player = game.players[0];
			opponent = game.players[1];
		} else {
			player = game.players[1];
			opponent = game.players[0];
		}

		animateButton(player.attack, $("#1"));


	};

	var animateButton = function (attack, button) {
		if (attack.load > 0) {
			var quota = ((attack.loadTotal / attack.load) * 100 * 0.49) | 0;
			console.log("load quota: "+quota);
			$("#1").css({width: quota + "%", background: "blue"});
			$("#1")
				.animate({
					width: "0%"
				}, {
					queue: false,
					duration: attack.load
				});
		} else if (attack.refresh > 0) {
			var quota = ((attack.refreshTotal / attack.refresh) * 100 * 0.49) | 0;
			console.log("refresh quota: "+quota);
			$("#1").css({width: quota + "%", background: "red"});
			$("#1")
				.animate({
					width: "0%"
				}, {
					queue: false,
					duration: attack.refresh
				});
		} else {
			$("#1").css({width: "49%", background: "white"});
		}
	};

	var gameExample = {
		"players": [
			{
				"id": "rD7grrvIlPyyQksaAAAA",
				"health": 100,
				"mana": 100,
				"attack": {
					"load": 0,
					"refresh": 0,
					"description": "attack yo"
				}
			},
			{
				"id": "sytoF09aWHW2XQa7AAAB",
				"health": 100,
				"mana": 100,
				"attack": {
					"load": 0,
					"refresh": 0,
					"description": "attack yo"
				}
			}
		]
	};
})();