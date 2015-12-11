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

		animateButton(player.attack, $("#1").children(".progressbar"));


	};

	var animateButton = function (attack, button) {
		if (attack.load > 0) {
			var quota = ((attack.loadTotal / attack.load) * 100) | 0;
			console.log("load quota: "+quota);
			button.css({width: quota + "%", background: "blue"});
			button
				.animate({
					width: "0%"
				}, {
					queue: false,
					duration: attack.load
				});
		} else if (attack.refresh > 0) {
			var quota = ((attack.refreshTotal / attack.refresh) * 100) | 0;
			console.log("refresh quota: "+quota);
			button.css({width: quota + "%", background: "red"});
			button
				.animate({
					width: "0%"
				}, {
					queue: false,
					duration: attack.refresh,
					complete: function() {
						button.css({width: "100%", background: "brown"});
					}
				});
		} else {
			button.css({width: "100%", background: "brown"});
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