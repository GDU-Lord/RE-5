(scene) => {

	// this script executes after scene initialization
	// scene takes value of this scene object
	
	// creating camera
	new_cam = new rjs.Camera({});

	// creating layers attached to this scene
	new_bg = new rjs.Layer(scene);
	new_main = new rjs.Layer(scene);
	new_ui = new rjs.Layer(scene, vec2(0, 0));

	//creating Sprite

	var box = new rjs.Sprite({
		pos: vec2(),
		size: vec2(256, 256),
		color: rgb(150, 0, 150),
		layer: new_main
	});

	var loop = new rjs.GameLoop(() => {

		// this script executes every tick while this scene is active
		// rotating box rightwards
		box.angle ++;

	}, true, scene);

}