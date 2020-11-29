(scene) => {

	// скрипт запускается после инициализации сцены
	
	// создание камеры
	new_cam = new rjs.Camera({});

	// создание слоёв
	new_bg = new rjs.Layer(scene);
	new_main = new rjs.Layer(scene);
	new_ui = new rjs.Layer(scene, vec2(0, 0));

	//создание спрайта

	var box = new rjs.Sprite({
		pos: vec2(),
		size: vec2(256, 256),
		color: rgb(150, 0, 150),
		layer: new_main
	});

	var loop = new rjs.GameLoop(() => {

		// скрипт выполняется каждый раз перед отрисовкой сцены
		// поворот спрайта вправо
		box.angle ++;

	}, true, scene);

}