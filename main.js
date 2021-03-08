// code runs when the page just loaded

window.addEventListener('load', (e) => {

	// Rect Engine 5 initialization
	rjs = new RectJS(rjs => {

		// code runs right before the game engine initializtion
		// usually this is the place for implement some plugins

	});

	// attach some scripts
	rjs.Script("config.js")();
	rjs.Script("families.js")();
	rjs.Script("sources.js")();
	rjs.Script("assets.js")();

	// scene "new" initialization
	new_scene = new rjs.Scene("new");

	// going to the scene "new"
	new_scene.set();

});
