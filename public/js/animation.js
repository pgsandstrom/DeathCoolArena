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

		player.attacks.forEach(function (attack, index) {
			animateButton(attack, $("#player").children().eq(index).children(".progressbar"));
		});

		opponent.attacks.forEach(function (attack, index) {
			animateButton(attack, $("#opponent").children().eq(index).children(".progressbar"));
		});
	};

	var animateButton = function (attack, button) {

		if (button.length !== 1) {
			console.log("wrong button selection: " + button.length);
		}

		if (attack.load > 0) {
			var quota = ((attack.load / attack.loadTotal) * 100) | 0;
			console.log("load quota: " + quota);
			if(quota > 100) {
				console.log("attack.loadTotal: " + attack.loadTotal);
				console.log("attack.load: " + attack.load);
			}
			button.css({width: quota + "%", background: "blue"});
			button
				.animate({
					width: "0%"
				}, {
					queue: false,
					duration: attack.load
				});
		} else if (attack.refresh > 0) {
			var quota = ((attack.refresh / attack.refreshTotal) * 100) | 0;
			console.log("refresh quota: " + quota);
			button.css({width: quota + "%", background: "red"});
			button
				.animate({
					width: "0%"
				}, {
					queue: false,
					duration: attack.refresh,
					complete: function () {
						button.css({width: "100%", background: "brown"});
					}
				});
		} else {
			button.css({width: "100%", background: "brown"});
		}
	};
})();