// code will start when the site load

window.addEventListener('load', (e) => {

	// Rect Engine 5 initialization
	rjs = new RectJS((rjs) => {

		// this function executes before engine initialization
		// some plugins must be to initialized here

	});

	// including and executing additional scripts
	require("Scripts/config.js")();
	require("Scripts/families.js")();
	require("Scripts/sources.js")();
	require("Scripts/assets.js")();

	// "new" scene initialization
	new_scene = new rjs.Scene({
		init: require("Scenes/new/init.js"),
		start: require("Scenes/new/start.js"),
		end: require("Scenes/new/end.js")
	});

	// go to "new" scene
	new_scene.set("Hello World!");

});