(function () {
	"use strict";
	var ploxfight = window.ploxfight = window.ploxfight || {};

	var buttons = $("#player").children();
	for (var i = 0; i < 6; i++) {
		// lol code:
		(function () {
			var name = i;
			buttons.eq(i).click(function () {
				//console.log("sending: " + name);
				ploxfight.sendMove(name);
			});
		})();

	}
})();