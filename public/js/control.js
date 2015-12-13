(function () {
	"use strict";
	var ploxfight = window.ploxfight = window.ploxfight || {};

	$("#player").children().click(function () {
		var name = this.id;
		console.log("sending: " + name);
		ploxfight.sendMove(name);
	});
})();