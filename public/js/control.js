(function () {
	"use strict";
	var ploxfight = window.ploxfight = window.ploxfight || {};

	$("#1").click(function () {
		var name = this.id;
		console.log("sending: " + name);
		ploxfight.sendMove(name);
	});
})();