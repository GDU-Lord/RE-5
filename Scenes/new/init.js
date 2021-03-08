(scene) => {

	// script runs after the scene initialization
	
	// camrea creation
	$new_cam = new rjs.Camera();

	// layers initialization
	$new_bg = new rjs.Layer(scene);
	$new_main = new rjs.Layer(scene);
	$new_ui = new rjs.Layer(scene, vec2(0, 0));

	//setting up some objects

	const bg = new rjs.Sprite({
		pos: vec2(0, 0),
		size: vec2(rjs.client.w, rjs.client.h),
		colors: [rgba(255, 255, 255, 255), rgba(255, 255, 255, 255), rgba(255, 0, 255, 0), rgba(255, 0, 255, 0)],
		colorMode: "VERTEX",
		layer: new_bg
	});

	const text = new rjs.Text({
		pos: vec2(0, -350),
		size: 150,
		font: "Arial",
		color: rgb(200, 0, 150),
		text: "Rect Engine 5",
		layer: new_ui
	});

	const box = new rjs.Sprite({
		pos: vec2(),
		size: vec2(256, 256),
		colors: [rgb(150, 0, 150),rgb(150, 0, 0),rgb(0, 0, 150),rgb(0, 0, 0)],
		colorMode: "VERTEX",
		layer: new_main
	});

	const loop = new rjs.GameLoop(() => {

		// the script runs every single frame before the rendering
		// box rotation
		box.angle ++;

	}, true, scene);

}