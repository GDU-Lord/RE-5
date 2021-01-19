// код запускается после загрузки страници

window.addEventListener('load', (e) => {

	// инициализация Rect Engine 5
	rjs = new RectJS(rjs => {

		// код выполняется перед инициализацией движка
		// здесь подключается большенство плагинов

	});

	// подключение скриптов
	require("Scripts/config.js")();
	require("Scripts/families.js")();
	require("Scripts/sources.js")();
	require("Scripts/assets.js")();

	// создание сцены "new"
	new_scene = new rjs.Scene({
		init: require("Scenes/new/init.js"),
		start: require("Scenes/new/start.js"),
		end: require("Scenes/new/end.js")
	});

	// переход на сцену "new"
	new_scene.set();

});