/* jshint -W117 */
/* jshint -W080 */
/* jshint -W083 */
const RectJS = function (fnc = () => {}, sourceHOST = '', engineSource = 'Engine/', pluginSource = 'Plugins/', eventDetector = null) {

	const rjs = this;

	this.engineSource = engineSource;
	this.sourceHOST = sourceHOST;
	this.pluginSource = pluginSource;
	this.MATRIX_MODE = true;

	//Sources
	this.src = function (src) {
		return String(rjs.sourceHOST+src);
	};

	this.Vector2 = class {

		constructor (x = 0, y = x) {

			if(x instanceof this.constructor) {
				y = x.y;
				x = x.x;
			}
			if(typeof x == 'string' && parseFloat(x)+"" == NaN+"") {
				let expression = x;
				let plus = expression.split('+');
				let minus = expression.split('--');
				let multiply = expression.split('*');
				let divide = expression.split('/');
				let power = expression.split('^');
				if(plus.length > 1) {
					let a = this.fromString(plus[0]);
					let b = this.fromString(plus[1]);
					return new this.constructor(a.x+b.x, a.y+b.y);
				}
				else if(minus.length > 1) {
					let a = this.fromString(minus[0]);
					let b = this.fromString(minus[1]);
					return new this.constructor(a.x-b.x, a.y-b.y);
				}
				else if(multiply.length > 1) {
					let a = this.fromString(multiply[0]);
					let b = this.fromString(multiply[1]);
					return new this.constructor(a.x*b.x, a.y*b.y);
				}
				else if(divide.length > 1) {
					let a = this.fromString(divide[0]);
					let b = this.fromString(divide[1]);
					return new this.constructor(a.x/b.x, a.y/b.y);
				}
				else if(power.length > 1) {
					let a = this.fromString(power[0]);
					let b = this.fromString(power[1]);
					return new this.constructor(Math.pow(a.x, b.x), Math.pow(a.y, b.y));
				}
				else {
					return this.fromString(expression);
				}
			}
			else {
				this.x = parseFloat(x);
				this.y = parseFloat(y);
			}

		}

		toString () {
			return "v"+this.x+";"+this.y;
		}

		fromString (v) {
			const arr = v.split('v')[1].split(';');
			const x = parseFloat(arr[0]);
			const y = parseFloat(arr[1]);
			return new this.constructor(x, y);
		}

		get len () {
			return Math.sqrt(this.x**2+this.y**2);
		}

		add (x = 0, y = x) {
			const v = new this.constructor(x, y);
			return new this.constructor(this.x+v.x, this.y+v.y);
		}

		sub (x = 0, y = x) {
			const v = new this.constructor(x, y);
			return new this.constructor(this.x-v.x, this.y-v.y);
		}

		mult (x = 0, y = x) {
			const v = new this.constructor(x, y);
			return new this.constructor(this.x*v.x, this.y*v.y);
		}

		div (x = 0, y = x) {
			const v = new this.constructor(x, y);
			return new this.constructor(this.x/v.x, this.y/v.y);
		}

		dot (x = 0, y = x) {
			const v = new this.constructor(x, y);
			return this.x*v.x+this.y*v.y;
		}

		norm () {
			return this.div(this.len);
		}

		get angle () {
			let a = Math.atan2(this.x, -this.y)*180/Math.PI-90;
			while(a < 0)
				a += 360;
			while(a > 360)
				a -= 360;
			return a;
		}

		rot (angle) {
			const a = (this.angle+angle)*Math.PI/180;
			const l = this.len;
			const x = (Math.cos(a)*l).toFixed(10);
			const y = (Math.sin(a)*l).toFixed(10);
			return new this.constructor(x, y);
		}

		abs () {
			return vec2(Math.abs(this.x), Math.abs(this.y));
		}

	}

	this.globals = {
		_GLOBAL: [],
		literas: {},
		keyword: "window.",
		symbol: "$"
	};
	
    const literas = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz_$0123456789";

    for(let i in literas) {
        rjs.globals.literas[literas[i]] = i;
    }

	this.Convert = function (char) {

        let changed = false;
        let res = "";
        let readWordMode = false;
        let word = "";

        for(let i in char) {
            const index = parseFloat(i);
            if(readWordMode) {
                if(char[i] in rjs.globals.literas)
                    word += char[i];
                else {
                    rjs.globals._GLOBAL.push(word);
                    word = "";
                    readWordMode = false;
                }
            }
            if((typeof char[index-1] == "undefined" || char[index-1] == " " || char[index-1] == ";" || char[index-1] == "\t" || char[index-1] == "\v" || char[index-1] == "(" || char[index-1] == "{") && char[index] == rjs.globals.symbol && char[index+1] in rjs.globals.literas) {
               
                res += rjs.globals.keyword;
                readWordMode = true;
                changed = true;
            }
            else
                res += char[index];
        }
        // if(changed)
        //     log(res);
        return res;

    };
	
	//global methods
	this._GLOBAL = {
		log: console.log,
		error: console.error,
		warning: console.warn,
		vec2: function (x = 0, y = 0) {
			return new rjs.Vector2(x, y);
			/*return {
				x: x,
				y: y
			}*/
		},
		rgb: function (r, g, b) {
			return {
				r: r,
				g: g,
				b: b,
				toString: function () {
					return `rgb(${this.r}, ${this.g}, ${this.b})`;
				}
			}
		},
		rgba: function (r = 0, g = 0, b = 0, a = 255) {
			return {
				r: r,
				g: g,
				b: b,
				a: a,
				toString: function () {
					return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
				},
				toStringCSS: function () {
					return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a/255})`;
				}
			}
		},
		require: function (src, type = 'JS') {
			type = type.toUpperCase();
			const ajax = new XMLHttpRequest();
			ajax.open('GET', rjs.src(src), false);
			ajax.send();
			const text = ajax.responseText;
			switch(type) {
				case "TEXT" :
					return text;
				case "JS" :
					return eval(rjs.Convert(String(text))); // jshint ignore:line
				case "JSON" :
					return JSON.parse(text);
				default:
					error('RectJS.require(): Unknown type of data!');
			}
		},
		count: function (arr) {
			let cnt = 0;
			for(let i in arr) {
				cnt ++;
			}
			return cnt;
		},
		copy: function (arr) {
			if(arr instanceof rjs.Vector2)
				return new rjs.Vector2(arr.x, arr.y);
			const arr2 = {};
			for(let i in arr) {
				arr2[i] = arr[i];
			}
			return arr2;
		}
	};
	
	//Plugins
	
	
	// this.Plugin = function (src, params) {
	// 	this.code = require(src, 'text');
	// 	this.fnc = eval(this.code);
	// 	this.proto = this.fnc(rjs, params);
	// 	this.name = this.proto.name;
	// 	this.proto.main(rjs, params);
	// };

	this.plugins = {};

	this.Plugin = function (name, ...params) {
		const pack = require(rjs.pluginSource+name+'.rjs/package.json', 'json');
		const code = require(rjs.pluginSource+name+'.rjs/'+pack.main);
		this.params = params;
		this.exports = undefined;
		this.global = {};
		this.pack = pack;
		this.code = code;
		this.engine = rjs;
		this.fnc = this.code;
		const res = this.fnc(this);
		this.res = typeof res != 'undefined' ? res : null;
		rjs.plugins[this.pack.name] = this;
		for(let i in this.global) {
			window[i] = this.global[i];
		}
		return this.exports;
	};
	
	//Canvas
	
	document.body.style.margin = '0px';
	document.body.style.overflow = 'hidden';

	this.container = document.createElement('div');
	document.body.appendChild(rjs.container);
	this.container.style.overflow = "hidden";

	this.WebGL_Canvas = document.createElement('canvas');
	this.container.appendChild(rjs.WebGL_Canvas);

	this.ctx2D_Canvas = document.createElement('canvas');
	//this.ctx2D_Canvas.style.display = 'none';
	this.container.appendChild(rjs.ctx2D_Canvas);

	this.ed = this.eventDetector = document.createElement('div');
	if(eventDetector != null) {
		this.ed = eventDetector;
	}

	this.container.appendChild(rjs.eventDetector);

	document.body.style.userSelect = 'none';

	this.gl = rjs.WebGL_Canvas.getContext('webgl2');
	this.ctx = rjs.ctx2D_Canvas.getContext('2d');
	
	this.client = {
		w: 1920,
		h: 1080
	};

	this.canvas_width = 0;
	this.canvas_height = 0;

	this.con_width = 0;
	this.con_height = 0;

	this.CLEAR_COLOR = rjs._GLOBAL.rgba(255, 255, 255, 255);
	this.BG_COLOR = rjs._GLOBAL.rgba(0, 0, 0, 255);

	this.prevWindowSize = rjs._GLOBAL.vec2(0, 0);
	this.resolution = {
		w: this.client.w*0.8,
		h: this.client.h*0.8
	};
	this.getResolution = function (horiz) {
		let res_scale = 1;
		if(horiz)
			res_scale = rjs.resolution.w/window.innerHeight;
		else
			res_scale = rjs.resolution.h/window.innerWidth;
		return {
			innerWidth: window.innerWidth*res_scale,
			innerHeight: window.innerHeight*res_scale,
		}
	};
	
	this.resizeCanvas = function () {
		const prop = rjs.client.w / rjs.client.h;
		const con = rjs.container;
		const bg_color = rjs.BG_COLOR.toStringCSS();
		const clear_color = rjs.CLEAR_COLOR.toStringCSS();
		const res = rjs.getResolution(window.innerWidth > window.innerHeight * prop);
		if(document.body.style.backgroundColor != bg_color)
			document.body.style.backgroundColor = bg_color;
		if(con.style.backgroundColor != clear_color)
			con.style.backgroundColor = clear_color;
		rjs.ctx.clearRect(0, 0, rjs.canvas_width, rjs.canvas_height);
		if(rjs.prevWindowSize.x != res.innerWidth || rjs.prevWindowSize.y != res.innerHeight) {
			rjs.prevWindowSize = vec2(res.innerWidth, res.innerHeight);
			if(window.innerWidth > window.innerHeight * prop) {

				const w = rjs.canvas_width = res.innerHeight * prop;
				const h = rjs.canvas_height = res.innerHeight;

				const cw = rjs.con_width = window.innerHeight * prop;
				const ch = rjs.con_height = window.innerHeight;

				con.style.width = cw + 'px';
				con.style.height = ch + 'px';
				con.style.position = 'absolute';
				con.style.left = (window.innerWidth - cw) / 2 + 'px';
				con.style.top = 0 + 'px';

				const cvs = con.getElementsByTagName('canvas');

				for(let i = 0; i < cvs.length; i ++) {
					cvs[i].width = w;
					cvs[i].height = h;
					cvs[i].style.width = cw + "px";
					cvs[i].style.height = ch + "px";
					cvs[i].style.position = 'absolute';
					cvs[i].style.left = '0px';
					cvs[i].style.top = '0px';
				}

				const div = con.getElementsByTagName('div');

				for(let i = 0; i < div.length; i ++) {
					div[i].style.width = cw + 'px';
					div[i].style.height = ch + 'px';
					div[i].style.position = 'absolute';
					div[i].style.left = '0px';
					div[i].style.top = '0px';
				}
				
			}
			else {

				const w = rjs.canvas_width = res.innerWidth;
				const h = rjs.canvas_height = res.innerWidth / prop;

				const cw = rjs.con_width = window.innerWidth;
				const ch = rjs.con_height = window.innerWidth / prop;
				
				con.style.width = cw + 'px';
				con.style.height = ch + 'px';
				con.style.position = 'absolute';
				con.style.left = 0 + 'px';
				con.style.top = (window.innerHeight - ch) / 2 + 'px';

				const cvs = con.getElementsByTagName('canvas');

				for(let i = 0; i < cvs.length; i ++) {
					cvs[i].width = w;
					cvs[i].height = h;
					cvs[i].style.width = cw + "px";
					cvs[i].style.height = ch + "px";
					cvs[i].style.position = 'absolute';
					cvs[i].style.left = '0px';
					cvs[i].style.top = '0px';
				}

				const div = con.getElementsByTagName('div');

				for(let i = 0; i < div.length; i ++) {
					div[i].style.width = cw + 'px';
					div[i].style.height = ch + 'px';
					div[i].style.position = 'absolute';
					div[i].style.left = '0px';
					div[i].style.top = '0px';
				}
			}
		}
	};
	
	
	
	
	
	
	//Fonts
	
	this.fonts = [];
	
	
	
	//Scenes
	this.scenes = {};
	this.sceneCounter = 0;
	this.currentScene = null;
	
	// this.Scene = function ({ id = `scene_${rjs.sceneCounter}`, init = () => {}, start = () => {}, end = () => {}, initOnload = true}) {
		
	// 	this.id = id;
	// 	this.layers = {};
	// 	this.inited = false;
		
	// 	this.init = init;
	// 	this.start = start;
	// 	this.end = end;
		
	// 	rjs.scenes[this.id] = this;
		
	// 	rjs.sceneCounter ++;
		
	// 	if(initOnload) {
	// 		//new rjs.Layer(this);
	// 		this.init(this);
	// 		this.inited = true;
	// 	}


	// };

	this.scenePath = "Scenes/";

	this.Scene = function (name, initOnload = true, id = `scene_${rjs.sceneCounter}`) {

		this.init = require(rjs.scenePath+name+'/init.js');
		this.start = require(rjs.scenePath+name+'/start.js');
		this.end = require(rjs.scenePath+name+'/end.js');
		
		this.name = name;

		this.id = id;
		this.layers = {};
		this.inited = false;
		
		rjs.scenes[this.id] = this;
		rjs.sceneCounter ++;
		
		if(initOnload) {
			this.init(this);
			this.inited = true;
		}

	};
	
	this.Scene.prototype.set = function (startParams = {}, endParams = {}) {
		if(rjs.currentScene != null) {
			rjs.currentScene.end(rjs.currentScene, endParams);
		}
		if(!this.inited) {
			new rjs.Layer(this);
			this.init(this);
			this.inited = true;
		}
		rjs.prevWindowSize = vec2(0,0);
		this.start(this, startParams);
		rjs.currentScene = this;
		this.update();
		rjs.renderCore.clearTextureBuffer();
	};

	this.Scene.prototype.update = function () {
		
	};

	this.scriptPath = "Scripts/";
	this.Script = function (src) {
		return require(rjs.scriptPath+src, 'js');
	};

	this.jsonPath = "Sources/json/";
	this.JSON = function (src) {
		return require(rjs.jsonPath+src, 'json');
	};

	this.imagePath = "Sources/images/";
	this.Image = function (src, ...params) {
		return new rjs.Texture(rjs.imagePath+src, ...params);
	};

	this.audioPath = "Sources/audio/";
	this.Audio = function (src) {
		return new rjs.Sound(rjs.audioPath+src);
	};

	this.fontPath = "Sources/fonts/";
	this.Font = function (name, src) {
		return rjs.loadFont(name, rjs.fontPath+src);
	};
	
	//Layers
	
	this.layers = {};
	this.layerCounter = 0;
	
	this.Layer = function (scene, parallax = vec2(100, 100), scale = vec2(1, 1), id = null, { visible = true, blend = [], mode = 0 } = {}) {
		
		this.id = id != null ? id : `layer_${rjs.layerCounter}`;
		this.objects = {};
		this.scene = scene;
		this.parallax = parallax;
		this.visible = visible;
		this.scale = scale;
		this.blend = blend;
		this.mode = mode;
		this.groups = {};
		
		new rjs.Group(this, "DEFAULT");

		rjs.layers[this.id] = this;
		scene.layers[this.id] = this;
		rjs.layerCounter ++;

		rjs.renderer.initLayer(this);

	};

	// groups

	let groupCnt = 0;

	this.Group = function (layer, id = "group_"+groupCnt) {
		this.objects = {};
		this.id = id;
		this.layer = layer;
		layer.groups[this.id] = this;
		groupCnt ++;
	};

	this.Group.prototype.isset = function (o) {
		return o.id in this.objects;
	};

	this.Group.prototype.add = function (o) {
		
		this.objects[o.id] = o;
		o.groups.push(this);

	};

	this.Group.prototype.set = function (o) {

		for(let i in o.groups) {
			o.groups[i].remove(o);
		}
		
		this.objects[o.id] = o;
		o.groups.push(this);

	};

	this.Group.prototype.remove = function (o) {
		
		if(this.isset(o)) {

			delete this.objects[o.id];
			for(let i in o.groups) {
				if(o.groups[i].id == this.id) {
					delete o.groups[i];
					return;
				}
			}

		}

	};

	//Textures
	this.sources = {};
	this.images = {};
	this.textures = {};
	this.tiledCounter = 0;
	this.cropedCounter = 0;
	
	this.Texture = function (src, scale = vec2(1, 1), custom_size = vec2(0, 0)) {
		
		let t = this;
		
		this.image = new Image();
		this.src = this.id = `${rjs.src(src)}_${scale.x}x${scale.y}`;
		this.image.src = rjs.src(src);
		this.image.loaded = false;
		this.image.funcs = [];
		this.size = vec2(0, 0);
		this.custom_size = custom_size;
		this.scale = scale;
		
		this.canvas = document.createElement('canvas');
		
		this.texture = rjs.renderCore.createTexture();

		rjs.sources[this.src] = this;
		rjs.images[this.src] = this;
		rjs.textures[this.src] = this;

		rjs.checkSourceLoaded();
		
		this.image.addEventListener('load', (e) => {
			t.image.loaded = true;
			const ctx = t.canvas.getContext('2d');
			t.size.x = t.custom_size.x || Math.abs(t.image.width * t.scale.x);
			t.size.y = t.custom_size.y || Math.abs(t.image.height * t.scale.y);
			t.canvas.width = t.size.x * t.scale.x;
			t.canvas.height = t.size.y * t.scale.y;
			let tx = 0;
			let ty = 0;
			let sx = 1;
			let sy = 1;
			if(t.scale.x < 0) {
				tx = t.size.x;
				sx = -1;
			}
			if(t.scale.y < 0) {
				ty = t.size.y;
				sy = -1;
			}
			ctx.translate(tx, ty);
			ctx.scale(sx, sy);
			ctx.drawImage(t.image, 0, 0, t.size.x*t.scale.x, t.size.y*t.scale.y);
			for(let i in t.image.funcs) {
				t.image.funcs[i](e);
			}
			rjs.checkSourceLoaded();
		});

		const RectJS = rjs;

		RectJS.Texture.prototype.tiled = function () {

			console.warn("Method RectJS.Texture.tiled() is outdated! Use RectJS.Tiled() instead of it!");

		};

		RectJS.Texture.prototype.crop = function () {

			console.warn("Method RectJS.Texture.crop() is outdated! Use RectJS.Crop() instead of it!");

		};

		
		
	};

	this.Tiled = function (origin, size) {
		if(origin == null)
			return null;
		this.tex = origin;
		this.src = this.tex.src+'_'+rjs.tiledCounter;
		this.size = size;
		this.id = this.src+this.size;
		this.type = 'tiled';
		rjs.textures[this.src] = this;
		rjs.tiledCounter ++;
	};

	this.Crop = function (origin, pos, size) {
		if(origin == null)
			return null;
		this.tex = origin;
		this.src = this.tex.src+'_'+rjs.cropedCounter;
		this.pos = pos;
		this.size = size;
		this.id = this.src+this.pos+this.size;
		this.type = 'cropped';
		rjs.textures[this.src] = this;
		rjs.tiledCounter ++;
	};

	this.TextureDOM = function (dom, scale = vec2(1, 1), custom_size = vec2(0, 0)) {
		
		const t = this;
		
		this.image = dom;
		this.src = `${dom.src}_${scale.x}x${scale.y}`;
		this.image.funcs = [];
		this.size = vec2(0, 0);
		this.custom_size = custom_size;
		this.scale = scale;
		
		this.canvas = document.createElement('canvas');

		this.texture = rjs.renderCore.createTexture();

		rjs.textures[this.src] = this;

		rjs.checkSourceLoaded();
		if(this.image.loaded) {
			t.canvas = this.image;
			rjs.checkSourceLoaded();
		}
		else {
			this.image.addEventListener('load', (e) => {
				t.image.loaded = true;
				const ctx = t.canvas.getContext('2d');
				t.size.x = t.custom_size.x || Math.abs(t.image.width * t.scale.x);
				t.size.y = t.custom_size.y || Math.abs(t.image.height * t.scale.y);
				t.canvas.width = t.size.x;
				t.canvas.height = t.size.y;
				let tx = 0;
				let ty = 0;
				let sx = 1;
				let sy = 1;
				if(t.scale.x < 0) {
					tx = t.size.x;
					sx = -1;
				}
				if(t.scale.y < 0) {
					ty = t.size.y;
					sy = -1;
				}
				ctx.translate(tx, ty);
				ctx.scale(sx, sy);
				ctx.drawImage(t.image, 0, 0, t.size.x, t.size.y);
				for(let i in t.image.funcs) {
					t.image.funcs[i](e);
				}
				rjs.checkSourceLoaded();
			});
		}

		const RectJS = rjs;

		RectJS.Texture.prototype.tiled = function (size) {

			this.tex = t;
			this.src = this.tex.src+'_'+rjs.tiledCounter;
			this.size = size;
			this.id = this.src;
			this.type = 'tiled';
			// rjs.images[this.src] = this;
			rjs.textures[this.src] = this;
			rjs.tiledCounter ++;

		};

		RectJS.Texture.prototype.crop = function (pos, size) {

			this.tex = t;
			this.src = this.tex.src+'_'+rjs.cropedCounter;
			this.pos = pos;
			this.size = size;
			this.id = this.src;
			this.type = 'croped';
			// rjs.images[this.src] = this;
			rjs.textures[this.src] = this;
			rjs.tiledCounter ++;

		};
		
	};

	this.checkSourceLoaded = function () {
		if(rjs.LOADER_MODE) {
			rjs.sourceLoaded = true;
			rjs.timeStep = 0;
			for(let i in rjs.sources) {
				if(!rjs.sources[i].image.loaded) {
					rjs.sourceLoaded = false;
					break;
				}
			}
		}
		else {
			rjs.sourceLoaded = true;
		}
	};

	rjs.LOADER_MODE = false;
	rjs.sourceLoaded = true;
	rjs.timeStep = 1;
	
	//Animations
	
	this.animations = {};
	this.animationCounter = 0;
	
	this.Animation = function ({ frames = [], speed = 60, mode = 'frame-rate', id = `animation_${rjs.animationCounter}` }) {
		this.frames = frames;
		this.currentIndex = 0;
		this.fc = 0;
		this.speed = speed;
		this.mode = mode;
		this.id = id;
		this.src = id;
		this.type = 'animation';
		rjs.animations[id] = this;
		rjs.textures[id] = this;
		rjs.animationCounter ++;
	};
	
	this.animationLoop = function () {
		for(let i in rjs.animations) {
			const a = rjs.animations[i];
			
			if(a.mode == 'frame-rate') {
				a.fc ++;
				if(a.fc >= 60 / a.speed) {
					a.fc = 0;
					a.currentIndex ++;
					if(a.currentIndex >= a.frames.length)
						a.currentIndex = 0;
				}
			}
			
		}
	};
	
	
	
	//Objects
	this.isObject = function (o) {
		if(typeof o != 'object')
			return false;
		return (o.type == 'sprite' || o.type == 'polygon' || o.type == 'text');
	};

	this.objectCounter = 0;
	
	this.Polygon = function ({
		
		pos = vec2(0, 0),
		vertices = [],
		scale = vec2(1, 1),
		angle = 0,
		origin = vec2(0, 0),
		points = [],
		texture = null,
		color = rgb(255, 255, 255),
		filters = [],
		colors = [],
		colorMode = "SINGLE",
		opacity = 100,
		render = true,
		enable_chunks = true,
		scene = undefined,
		layer = null,
		id = `object_${rjs.objectCounter}`,
		textOverlap = false,
		private = {},
		families = [],
		groups = []
		
	}) {
		
		if(layer == null)
			throw 'RectJS.Polygon(...) error: Layer is not defined';

		for(let i in private) {
			this[i] = private[i];
		}
		
		this.pos = pos;
		this.vertices = vertices;
		this.scale = scale;
		this.angle = angle;
		this.origin = origin;
		this.points = points;
		this.opacity = opacity;
		this.render = render;
		this.texture = texture;
		this.color = color;
		this.filters = filters;
		this.colorMode = colorMode;
		this.colors = colors;
		if(this.colors.length < this.vertices.length) {
			for(let i = 0; i < this.vertices.length; i ++) {
				this.colors[i] = typeof this.colors[i] == 'undefined' ? rgb(255, 255, 255) : this.colors[i];
			}
		}
		this.scene = (scene || layer.scene);
		this.id = id;
		this.layer = layer;
		this.families = [];
		this.groups = [];
		this.enable_chunks = enable_chunks;
		this.type = 'polygon';
		this.textOverlap = textOverlap;
		this.destroyed = false;

		this.colors = colors;

		for(let i in families) {
			families[i].add(this);
		}

		if(groups.length == 0)
			groups = [this.layer.groups.DEFAULT];

		for(let i in groups) {
			groups[i].add(this);
		}
		
		layer.objects[id] = this;
		
		rjs.objectCounter ++;

		if(typeof this.init == 'function')
			this.init();
		
	};
	
	this.Sprite = function ({
		pos = vec2(0, 0),
		size = vec2(0, 0),
		scale = vec2(1, 1),
		angle = 0,
		origin = vec2(0, 0),
		points = [],
		texture = null,
		color = rgb(255, 255, 255),
		filters = [],
		colors = [],
		opacity = 100,
		colorMode = "SINGLE",
		render = true,
		enable_chunks = true,
		scene = undefined,
		layer = null,
		id = `object_${rjs.objectCounter}`,
		textOverlap = false,
		private = {},
		families = [],
		groups = [],
		program = rjs.renderCore.programs.DEFAULT
	}) {
		
		if(layer == null)
			throw 'RectJS.Sprite(...) error: Layer is not defined';

		for(let i in private) {
			this[i] = private[i];
		}
		
		this.pos = pos;
		this.size = size;
		this.scale = scale;
		this.angle = angle;
		this.origin = origin;
		this.points = points;
		this.opacity = opacity;
		this.render = render;
		this.texture = texture;
		this.color = color;
		this.filters = filters;
		this.colorMode = colorMode;
		this.colors = colors;
		if(this.colors.length < 4) {
			for(let i = 0; i < 4; i ++) {
				this.colors[i] = typeof this.colors[i] == 'undefined' ? rgb(255, 255, 255) : this.colors[i];
			}
		}
		this.scene = (scene || layer.scene);
		this.id = id;
		this.layer = layer;
		this.families = [];
		this.groups = [];
		this.enable_chunks = enable_chunks;
		this.type = 'sprite';
		this.textOverlap = textOverlap;
		this.destroyed = false;

		this.program = program;

		for(let i in families) {
			families[i].add(this);
		}

		if(groups.length == 0)
			groups = [this.layer.groups.DEFAULT];

		for(let i in groups) {
			groups[i].add(this);
		}
		
		layer.objects[id] = this;
		
		rjs.objectCounter ++;

		if(typeof this.init == 'function')
			this.init();
		
	};
	
	this.Text = function ({
		pos = vec2(0, 0),
		size = null,
		scale = vec2(1, 1),
		angle = 0,
		origin = 'center-middle',
		offset = vec2(0, 0),
		points = [],
		text = null,
		font = null,
		color = rgb(0, 0, 0),
		filters = [],
		opacity = 100,
		render = true,
		enable_chunks = true,
		CSS = "",
		scene = undefined,
		layer = null,
		id = `object_${rjs.objectCounter}`,
		private = {},
		families = [],
		groups = []
	}) {

		for(let i in private) {
			this[i] = private[i];
		}
		
		this.pos = pos;
		this.size = size;
		this.scale = scale;
		this.angle = angle;
		this.origin = origin;
		this.offset = offset;
		this.points = points;
		this.opacity = opacity;
		this.render = render;
		this.font = font;
		this.text = text;
		this.color = color;
		this.filters = filters;
		this.scene = (scene || layer.scene);
		this.id = id;
		this.families = [];
		this.groups = [];
		this.enable_chunks = enable_chunks;
		this.type = 'text';
		this.layer = layer;
		this.CSS = CSS;
		this.destroyed = false;

		for(let i in families) {
			families[i].add(this);
		}

		if(groups.length == 0)
			groups = [this.layer.groups.DEFAULT];

		for(let i in groups) {
			groups[i].add(this);
		}

		this.DOM = null;
		
		layer.objects[id] = this;
		
		rjs.objectCounter ++;

		if(typeof this.init == 'function')
			this.init();
		
	};
	
	this.ObjectsPrototype = {};
	
	this.ObjectsPrototype.destroy = function () {
		delete this.layer.objects[this.id];
		for(let i in this.families) {
			this.families[i].remove(this);
		}
		for(let i in this.groups) {
			this.groups[i].remove(this);
		}
		this.destroyed = true;
	};
	
	this.ObjectsPrototype.getPoint = function (id, angle) {
		if(typeof this.points[id] == 'undefined')
			throw `RectJS.getPoint(...) error: Point "${id}" is not defined!`;
		let a = this.angle * Math.PI / 180;
		if(typeof angle != "undefined")
			a = angle * Math.PI / 180;
		const cos = Math.cos(a);
		const sin = Math.sin(a);
		const p = this.points[id];
		const o = this.origin;
		const px = this.scale.x * (p.x - o.x);
		const py = this.scale.y * (p.y - o.y);
		const x = (px) * cos - (py) * sin + this.pos.x;
		const y = (px) * sin + (py) * cos + this.pos.y;
		return vec2(x, y);
	};

	this.ObjectsPrototype.setLayer = function (layer) {
		delete this.layer.objects[this.id];
		for(let i in this.groups) {
			this.groups[i].remove(this);
		}
		this.groups = [this.layer.groups.DEFAULT];
		this.layer.groups.DEFAULT.add(this);
		this.layer = layer;
		this.scene = layer.scene;
		this.layer.objects[this.id] = this;
	};

	this.ObjectsPrototype.update = function () {
		this.boundingBox = rjs.getBoundingBox(this);
	};
	
	this.Polygon.prototype = rjs.ObjectsPrototype;
	this.Sprite.prototype = rjs.ObjectsPrototype;
	this.Text.prototype = rjs.ObjectsPrototype;

	//Shaders

	this.Shader = function (type, src, id) {

		this.code = require(src, "text");
		this.shader = rjs.renderCore.createShader(type, this.code, id);
		this.id = this.shader.id;

	};

	this.Shader.prototype.toString = function () {
		return this.id;
	};

	this.Program = function ({id = "DEFAULT", vertex = id || "DEFAULT", fragment = id || "DEFAULT"} = {}) { //jshint ignore:line

		return rjs.renderCore.createProgram(id, vertex, fragment);

	};
	
	//Assets
	
	
	this.Asset = function ({
		pos = undefined,
		size = undefined,
		scale = undefined,
		angle = undefined,
		opacity = undefined,
		render = undefined,
		origin = undefined,
		offset = undefined,
		color = undefined,
		colorMode = undefined,
		filters = undefined,
		colors = undefined,
		points = undefined,
		texture = undefined,
		scene = undefined,
		layer = undefined,
		CSS = undefined,
		font = undefined,
		text = undefined,
		vertices = undefined,
		enable_chunks = undefined,
		type = undefined,
		textOverlap = undefined,
		private = undefined,
		init = undefined,
		families = undefined,
		program = undefined
	}) {
		return function (p) {
			private_vars = {};
			if(typeof(private) == 'undefined')
				private_vars = typeof p.private != 'undefined' ? p.private : {};
			else {
				for(let i in private) {
					private_vars[i] = private[i];
				}
				if(typeof(p.private) != 'undefined') {
					for(let j in p.private) {
						private_vars[j] = p.private[j];
					}
				}
			}
			return new rjs[type]({
				pos: typeof p.pos != 'undefined' ? p.pos : pos,
				size: typeof p.size != 'undefined' ? p.size : size,
				scale: typeof p.scale != 'undefined' ? p.scale : scale,
				angle: typeof p.angle != 'undefined' ? p.angle : angle,
				opacity: typeof p.opacity != 'undefined' ? p.opacity : opacity,
				render: typeof p.render != 'undefined' ? p.render : render,
				origin: typeof p.origin != 'undefined' ? p.origin : origin,
				offset: typeof p.offset != 'undefined' ? p.offset : offset,
				color: typeof p.color != 'undefined' ? p.color : color,
				filters: typeof p.filters != 'undefined' ? p.filters : filters,
				colors: typeof p.colors != 'undefined' ? p.colors : colors,
				points: typeof p.points != 'undefined' ? p.points : points,
				texture: typeof p.texture != 'undefined' ? p.texture : texture,
				scene: typeof p.scene != 'undefined' ? p.scene : scene,
				colorMode: typeof p.colorMode != 'undefined' ? p.colorMode : colorMode,
				layer: typeof p.layer != 'undefined' ? p.layer : layer,
				CSS: typeof p.CSS != 'undefined' ? p.CSS : CSS,
				font: typeof p.font != 'undefined' ? p.font : font,
				text: typeof p.text != 'undefined' ? p.text : text,
				enable_chunks: typeof p.enable_chunks != 'undefined' ? p.enable_chunks : enable_chunks,
				vertices: typeof p.vertices != 'undefined' ? p.vertices : vertices,
				textOverlap: typeof p.textOverlap != 'undefined' ? p.textOverlap : textOverlap,
				private: private_vars,
				init: typeof p.init != 'undefined' ? p.init : init,
				families: typeof p.families != 'undefined' ? p.families : families,
				program: typeof p.program != 'undefined' ? p.program : program
			});
		};
	};
	
	//Cameras
	
	this.currentCamera = null;
	this.cameras = {};
	this.cameraCounter = 0;
	
	this.Camera = function ({
		pos = vec2(0, 0),
		id = `camera_${rjs.cameraCounter}`
	} = {}) {
		
		this.pos = pos;
		this.id = id;
		
		rjs.cameras[id] = this;
		
	};
	
	this.Camera.prototype = {
		set: function () {
			rjs.currentCamera = this;
		}
	};
	
	
	//Loops & timeouts
	this.waits = [];
	this.gameLoops = [];

	this.Wait = function (fnc = () => {}, delay = 1, active =  true, scene = null, absl = false) {

		this.fnc = fnc;
		this.delay = delay;
		this.type = "tick";
		this.active = active;
		this.scene = scene;
		this.absl = absl;
		this.ticks = 0;
		this.index = rjs.waits.length;

		/* absl --> Active Before Source Loaded */
		
		rjs.waits[this.index] = this;

	};
	
	this.GameLoop = function (fnc = () => {}, active =  true, scene = null, absl = false) {
		
		this.fnc = fnc;
		this.active = active;
		this.scene = scene;
		this.absl = absl;
		this.index = rjs.gameLoops.length;

		/* absl --> Active Before Source Loaded */
		
		rjs.gameLoops.push(this);
	};
	
	this.GameLoop.prototype.start = function () {
		this.active = true;
	};
	
	this.GameLoop.prototype.stop = function () {
		this.active = false;
	};
	
	this.globalGameLoop = function () {

		rjs.gameLoops.forEach((loop) => {
			if(rjs.timeStep == 0 && loop.active && (loop.scene == rjs.currentScene || loop.scene == null) && loop.absl)
				loop.fnc();
			else if(rjs.timeStep > 0) {
				for(let i = 0; i < rjs.timeStep; i ++) {
					if(loop.active && (loop.scene == rjs.currentScene || loop.scene == null))
						loop.fnc();
				}
			}
		});

		rjs.waits.forEach(wait => {

			if(wait.type == 'tick') {
				if(rjs.timeStep == 0 && wait.active && (wait.scene == rjs.currentScene || wait.scene == null) && wait.absl) {
					if(wait.ticks == wait.delay) {
						wait.fnc();
						delete rjs.waits[wait.index];
					}
					wait.ticks ++;
				}
				else if(rjs.timeStep > 0) {
					for(let i = 0; i < rjs.timeStep; i ++) {
						if(wait.active && (wait.scene == rjs.currentScene || wait.scene == null)) {
							if(wait.ticks == wait.delay) {
								wait.fnc();
								delete rjs.waits[wait.index];
							}
							wait.ticks ++;
						}
					}
				}
			}

		});

	}

	this.intervals = [];
	
	this.Interval = function (fnc, timeout, active = true, scene = null) {
		this.scene = scene;
		this.active = active;
		this.fnc = fnc;
		this.timeout = timeout;
		this.ticks = 0;
		this.callback = () => {
			
			if(this.active && (this.scene == null || rjs.currentScene == this.scene)) {
				this.ticks ++;
				if(this.ticks >= this.timeout) {
					this.fnc();
					this.ticks = 0;
				}
			}
		};
		rjs.intervals.push(this);
	};

	this.intervalLoop = function () {
		
		for(let i in rjs.intervals) {
			const interval = rjs.intervals[i];
			interval.callback();
		}

	};

	this.prevTime = Date.now();
	this.CUT_FPS = false;
	this.MAX_FPS = 60;
	this.SFRM = true; //single frame request mode
	
	//Global Game Loop
	this.engineLoop = function (funcs) {

		if(rjs.SFRM) {
			funcs.forEach((fnc) => {
				fnc();
			});
		}

		if(rjs.CUT_FPS) {
			while(Date.now() - rjs.prevTime < 1000/rjs.MAX_FPS) {}
			rjs.prevTime = Date.now();
		}


		if(!rjs.SFRM) {
			requestAnimationFrame(() => {
				rjs.resizeCanvas();
				rjs.render();
			});

			for(let i = 1; i < funcs.length-2; i ++) {
				funcs[i]();
			}
			funcs[funcs.length-1]();
		}
		

		requestAnimationFrame(function () {
			rjs.engineLoop(funcs);
		}, 500);

		
		
	};
	
	
	
	//events
	
	this.events = [];
	
	this.Event = function (type, fnc, active = true, scene = null, target = window) {
		const ev = this;
		this.fnc = fnc;
		this.active = active;
		this.scene = scene;
		this.event = target.addEventListener(type, function (e) {
			if(ev.active && (rjs.currentScene == ev.scene || ev.scene == null))
				ev.fnc(e);
		});
		rjs.events.push(this);
	};
	
	this.Event.prototype.start = function () {
		this.active = true;
	};
	
	this.Event.prototype.stop = function () {
		this.active = false;
	};
	
	this.Click = function (fnc, active = true, scene = null, target = rjs.ed) {
		const click = this;
		this.pos = vec2(0, 0);
		this.correction = 5;
		this.md = new rjs.MouseDown((e) => {
			click.pos = vec2(rjs._mouse.x, rjs._mouse.y);
		}, active, scene, target);
		this.mu = new rjs.MouseUp((e) => {
			if(Math.abs(click.pos.x-rjs._mouse.x) < click.correction && Math.abs(click.pos.y-rjs._mouse.y) < click.correction)
				fnc(e);
		}, active, scene, target);
		this.event = click.mu;
		return this.event;
	};
	
	this.RightClick = function (fnc, active = true, scene = null, target = rjs.ed) {
		this.event = new rjs.Event('contextmenu', fnc, active, scene, target);
		return this.event;
	};
	
	this.MouseDown = function (fnc, active = true, scene = null, target = rjs.ed) {
		this.event = new rjs.Event('mousedown', function (e) {
			if(e.button === 0)
				fnc(e);
		}, active, scene, target);
		return this.event;
	};
	
	this.MouseUp = function (fnc, active = true, scene = null, target = rjs.ed) {
		this.event = new rjs.Event('mouseup', function (e) {
			if(e.button === 0)
				fnc(e);
		}, active, scene, target);
		return this.event;
	};

	this.MouseRightDown = function (fnc, active = true, scene = null, target = rjs.ed) {
		this.event = new rjs.Event('mousedown', function (e) {
			if(e.button === 2)
				fnc(e);
		}, active, scene, target);
		return this.event;
	};
	
	this.MouseRightUp = function (fnc, active = true, scene = null, target = rjs.ed) {
		this.event = new rjs.Event('mouseup', function (e) {
			if(e.button === 2)
				fnc(e);
		}, active, scene, target);
		return this.event;
	};

	this.MouseWheelDown = function (fnc, active = true, scene = null, target = rjs.ed) {
		this.event = new rjs.Event('mousedown', function (e) {
			if(e.button === 1)
				fnc(e);
		}, active, scene, target);
		return this.event;
	};
	
	this.MouseWheelUp = function (fnc, active = true, scene = null, target = rjs.ed) {
		this.event = new rjs.Event('mouseup', function (e) {
			if(e.button === 1)
				fnc(e);
		}, active, scene, target);
		return this.event;
	};
	
	this.MouseMove = function (fnc, active = true, scene = null, target = rjs.ed) {
		this.event = new rjs.Event('mousemove', fnc, active, scene, target);
		return this.event;
	};
	
	this.Wheel = function (fnc, active = true, scene = null, target = rjs.ed) {
		this.event = new rjs.Event('wheel', fnc, active, scene, target);
		return this.event;
	};
	
	this.WheelUp = function (fnc, active = true, scene = null, target = rjs.ed) {
		this.event = new rjs.Event('wheel', function (e) {
			if(e.deltaY > 0) {
				fnc(e);
			}
		}, active, scene, target);
		return this.event;
	};
	
	this.WheelDown = function (fnc, active = true, scene = null, target = rjs.ed) {
		this.event = new rjs.Event('wheel', function (e) {
			if(e.deltaY < 0) {
				fnc(e);
			}
		}, active, scene, target);
		return this.event;
	};

	this.TouchStart = function (fnc, id = null, active = true, scene = null, target = rjs.ed) {
		this.event = new rjs.Event('touchstart', (e) => {
			if(id == null || typeof e.changedTouches[id] != 'undefined') {
				rjs.updateTouchMouse(e);
				fnc(e);
			}
		}, active, scene, target);
		return this.event;
	};

	this.TouchEnd = function (fnc, id = null, active = true, scene = null, target = rjs.ed) {
		this.event = new rjs.Event('touchend', (e) => {
			if(id == null || typeof e.changedTouches[id] != 'undefined') {
				rjs.updateTouchMouse(e);
				fnc(e);
			}
		}, active, scene, target);
		return this.event;
	};

	this.TouchMove = function (fnc, id = null, active = true, scene = null, target = rjs.ed) {
		this.event = new rjs.Event('touchmove', (e) => {
			if(id == null || typeof e.changedTouches[id] != 'undefined') {
				rjs.updateTouchMouse(e);
				fnc(e);
				rjs.updateTouchMouse(e);
			}
		}, active, scene, target);
		return this.event;
	};
	
	this.KeyDown = function (fnc, key = null, active = true, scene = null, target = window) {
		this.event = new rjs.Event('keydown', function (e) {
			if(key == null || e.keyCode == key)
				fnc(e);
		}, active, scene, target);
		return this.event;
	};
	
	this.KeyUp = function (fnc, key = null, active = true, scene = null, target = window) {
		this.event = new rjs.Event('keyup', function (e) {
			if(key == null || e.keyCode == key)
				fnc(e);
		}, active, scene, target);
		return this.event;
	};
	
	this.keys = [];
	this.anyKey = {
		press: false,
		e: false
	};
	
	this.initKeyboard = function () {
		new rjs.KeyDown(function (e) {
			rjs.keys[e.keyCode] = {
				press: true,
				e: e
			};
			rjs.anyKey = {
				press: true,
				e: e
			};
		});
			
		new rjs.KeyUp(function (e) {
			rjs.keys[e.keyCode] = {
				press: false,
				e: e
			};
			rjs.anyKey = {
				press: false,
				e: e
			};
		});
	};
	
	this.KeyPressed = function (key = null) {
		
		
		if(typeof rjs.keys[key] == 'undefined' && key != null)
			return false;
		else if(typeof rjs.anyKey == 'undefined') 
			return false;
		else if(key == null) 
			return rjs.anyKey.press;
		else 
			return rjs.keys[key].press;
		
	};
	
	this.keypresses = [];
	
	this.keypressLoop = function () {
		
		for(let i in rjs.keypresses) {
			
			const k = rjs.keypresses[i];
			
			if(k.active && (k.scene == rjs.currentScene || k.scene == null) && rjs.KeyPressed(k.key))
				if(k.key == null)
					k.fnc(rjs.anyKey.e);
				else
					k.fnc(rjs.keys[k.key].e);
		}
		
	};
	
	this.KeyPress = function (fnc, key = null, active = true, scene = null) {
		this.scene = scene;
		
		this.active = active;
		
		this.start = function () {
			this.active = true;
		};
		
		this.stop = function () {
			this.active = false;
		};
		
		this.fnc = fnc;
		
		this.key = key;
		
		rjs.keypresses.push(this);
		
	};
	
	this.mousepresses = [];
	
	this.MousePressed = false;
	this.RightMousePressed = false;
	
	
	this.MousePress = function (fnc, active = true, scene = null) {
		this.scene = scene;
		
		this.active = active;
		
		this.start = function () {
			this.active = true;
		};
		
		this.stop = function () {
			this.active = false;
		};
		
		this.fnc = fnc;
		
		rjs.mousepresses.push(this);
	};
	
	this.mousepressLoop = function () {
		if(!rjs.MousePressed) return;
		rjs.mousepresses.forEach((o) => {
			if(o.active)
				o.fnc();
		});
	};
	
	
	
	
	//Mouse
	
	this._mouse = {
		x: 0,
		y: 0,
		touchID: 0,
		get: function (layer, scale = false, parallax = false) {
			scale = scale || layer.scale;
			parallax = parallax || layer.parallax;
			const m = vec2(rjs._mouse.x / scale.x, rjs._mouse.y / scale.y);
			return vec2(m.x + rjs.currentCamera.pos.x * parallax.x / 100, m.y + rjs.currentCamera.pos.y * parallax.y / 100);
		}
	};
	
	this.Mouse = function () {
		this.pos = rjs._mouse;
		return this.pos;
	};

	this.Touch = function () {
		this.touches = rjs.touches;
		return this.touches;
	};
	
	this.MouseOver = function (o) {
		const m = vec2(rjs._mouse.x / o.layer.scale.x, rjs._mouse.y / o.layer.scale.y);
		return rjs.collision(o, {
			pos: vec2(m.x + rjs.currentCamera.pos.x * o.layer.parallax.x / 100, m.y + rjs.currentCamera.pos.y * o.layer.parallax.y / 100),
			size: vec2(0, 0),
			type: 'sprite',
			scale: vec2(1, 1),
			origin: vec2(0, 0),
			angle: 0
		});
	};
	
	
	
	//Families
	
	this.families = {};
	this.familyCount = 0;
	
	
	this.Family = function (id = `family_${rjs.familyCount}`) {
		this.id = id;
		this.objects = {};
		this.type = 'family';
		this.onadd = [];
		this.onrem = [];
		rjs.families[id] = this;
		rjs.familyCount ++;
	};

	this.Family.prototype.get = function (id) {
		return this.objects[id];
	};

	this.Family.prototype.getByIndex = function (index) {
		let i = 0;
		for(let j in this.objects) {
			if(i == index)
				return this.objects[j];
			i ++;
		}
	};

	this.Family.prototype.isset = function (o) {
		return (o.id in this.objects);
	};
	
	this.Family.prototype.for = function (fnc) {
		for(let i in this.objects) {
			fnc(this.objects[i]);
		}
	};
	
	this.Family.prototype.forNearTo = function (_pos, fnc, dist = 100) {
		const family = this;
		if(true) {
			family.for(o => {
				if(o.scene != rjs.currentScene)
					return;
				let scale = rjs.currentScene.layers[o.layer.id].scale;
				let cam = rjs.currentCamera;
				let pos = vec2();
				pos.x = _pos.x/scale.x+cam.pos.x;
				pos.y = _pos.y/scale.y+cam.pos.y;
				if(Math.pow(pos.x-o.pos.x, 2) + Math.pow(pos.y-o.pos.y, 2) <= Math.pow(dist, 2))
					fnc(o);
			});
		}
		
	};
	
	this.Family.prototype.count = function () {
		let count = 0;
		for(let i in this.objects) {
			count ++;
		}
		return count;
	};
	
	this.Family.prototype.add = function (o) {
		this.objects[o.id] = o;
		o.families[this.id] = this;
		this.onadd.forEach(c => c(o));
	};
	
	this.Family.prototype.remove = function (o) {
		delete this.objects[o.id];
		delete o.families[this.id];
		this.onrem.forEach(c => c(o));
	};

	this.Family.prototype.onAdd = function (callback) {
		this.onadd.push(callback);
	};

	this.Family.prototype.onRem = function (callback) {
		this.onrem.push(callback);
	};	
	
	//Fonts
	
	
	this.loadFont = function (name, src = null) {

		if(src != null) {
			style = document.createElement('style');
			
			style.innerHTML = `
			
				@font-face {
					font-family: ${name};
					src: url(${rjs.src(src)});
				}
			
			`;
			document.body.appendChild(style);
			
		}

		return name;
		
	};
	
	
	//Sounds
	
	this.sounds = [];
	
	this.Sound = function (src) {
		this.audio = new Audio();
		this.audio.src = rjs.src(src);
		this.id = rjs.sounds.length;
		this.object = 'none';
		this.volume = 100;
		this.distanse = 100;
		this.load = false;
		const th2 = this;
		this.audio.onloadedmetadata = function (e) {
			th2.load = true;
		};
		
		rjs.sounds.push(this);
	};
	
	this.Sound.prototype = {
		
		play: function () {
			this.audio.play();
		},
		stop: function () {
			this.audio.pause();
		},
		reset: function () {
			this.audio.currentTime = 0;
			this.stop();
		},
		restart: function () {
			this.audio.currentTime = 0;
			this.play();
		},
		getDuration: function () {
			return this.audio.duration;
		},
		setTime: function (time) {
			this.audio.currentTime = time;
		},
		getTime: function () {
			return this.audio.currentTime;
		},
		setVolume: function (vol) {
			if(vol > 100) vol = 100;
			this.volume = vol;
			this.audio.volume = vol/100;
		},
		getVolume: function () {
			return this.volume;
		},
		bind: function (o) {
			this.object = o;
		},
		unbind: function (o) {
			this.object = 'none';
		}
	};
	
	this.audioLoop = function () {
		
		for(let i in rjs.sounds) {
			const s = rjs.sounds[i];
			if(s.load) {
				if(s.object != 'none') {
					
					const c = rjs.currentCamera.pos;
					
					const dist = Math.floor(rjs.getDistanse(vec2(c.x * s.object.layer.parallax.y / 100, c.y * s.object.layer.parallax.y / 100), s.object.pos));
					
					let volume = s.volume/dist*s.distanse;
					
					if(volume > 100) volume = 100;
					if(volume <= 1) volume = 0;
					s.audio.volume = parseFloat(volume)/100;
					if(s.object.scene != rjs.currentScene) s.audio.volume = 0;
				}
			}
		}
	};
	
	this.getDistanse = function (a, b) {
		const c = vec2(b.x - a.x, b.y - a.y);
		return Math.sqrt(Math.pow(c.x, 2) + Math.pow(c.y, 2));
	};
	
	
	//initialization
	this.initGLOBAL = function () {
		for(let i in rjs._GLOBAL) {
			window[i] = rjs._GLOBAL[i];
		}
	};

	this.touches = {};

	this.initTouch = function () {
		rjs.touchStart = new rjs.TouchStart((e) => {
			for(let i = 0; i < e.changedTouches.length; i ++) {
				const rect = rjs.eventDetector.getBoundingClientRect();
				const prop = rjs.con_width / rjs.client.w;
				rjs.touches[i] = {};
				rjs.touches[i].get = function (layer) {
					const m = vec2(rjs.touches[i].x / layer.scale.x, rjs.touches[i].y / layer.scale.y);
					return vec2(m.x + rjs.currentCamera.pos.x * layer.parallax.x / 100, m.y + rjs.currentCamera.pos.y * layer.parallax.y / 100);
				};
				rjs.touches[i].x = (e.changedTouches[i].pageX-rect.x) / prop - rjs.client.w/2;
				rjs.touches[i].y = (e.changedTouches[i].pageY-rect.y) / prop - rjs.client.h/2;
			}
		});
		rjs.touchMove = new rjs.TouchMove((e) => {
			for(let i = 0; i < e.changedTouches.length; i ++) {
				const rect = rjs.eventDetector.getBoundingClientRect();
				const prop = rjs.con_width / rjs.client.w;
				rjs.touches[i] = {};
				rjs.touches[i].get = function (layer) {
					const m = vec2(rjs.touches[i].x / layer.scale.x, rjs.touches[i].y / layer.scale.y);
					return vec2(m.x + rjs.currentCamera.pos.x * layer.parallax.x / 100, m.y + rjs.currentCamera.pos.y * layer.parallax.y / 100);
				};
				rjs.touches[i].x = (e.changedTouches[i].pageX-rect.x) / prop - rjs.client.w/2;
				rjs.touches[i].y = (e.changedTouches[i].pageY-rect.y) / prop - rjs.client.h/2;
			}
		});
		rjs.touchEnd = new rjs.TouchEnd((e) => {
			for(let i = 0; i < e.changedTouches.length; i ++) {
				const rect = rjs.eventDetector.getBoundingClientRect();
				const prop = rjs.con_width / rjs.client.w;
				rjs.touches[i] = {};
				rjs.touches[i].get = function (layer) {
					const m = vec2(rjs.touches[i].x / layer.scale.x, rjs.touches[i].y / layer.scale.y);
					return vec2(m.x + rjs.currentCamera.pos.x * layer.parallax.x / 100, m.y + rjs.currentCamera.pos.y * layer.parallax.y / 100);
				};
				rjs.touches[i].x = (e.changedTouches[i].pageX-rect.x) / prop - rjs.client.w/2;
				rjs.touches[i].y = (e.changedTouches[i].pageY-rect.y) / prop - rjs.client.h/2;
			}
			for(let i = 0; i < e.changedTouches.length; i ++) {
				delete rjs.touches[i];
			}
		});
		return rjs.touches;
	};

	this.updateTouchMouse = function (e) {
		for(let i = 0; i < e.changedTouches.length; i ++) {
			const rect = rjs.eventDetector.getBoundingClientRect();
			const prop = rjs.con_width / rjs.client.w;
			rjs.touches[i] = {};
			rjs.touches[i].get = function (layer) {
				const m = vec2(rjs.touches[i].x / layer.scale.x, rjs.touches[i].y / layer.scale.y);
				return vec2(m.x + rjs.currentCamera.pos.x * layer.parallax.x / 100, m.y + rjs.currentCamera.pos.y * layer.parallax.y / 100);
			};
			rjs.touches[i].x = (e.changedTouches[i].pageX-rect.x) / prop - rjs.client.w/2;
			rjs.touches[i].y = (e.changedTouches[i].pageY-rect.y) / prop - rjs.client.h/2;
		}
		if(typeof rjs.touches[rjs._mouse.touchID] != 'undefined') {
			rjs._mouse.x = rjs.touches[rjs._mouse.touchID].x;
			rjs._mouse.y = rjs.touches[rjs._mouse.touchID].y;
		}
	};
	
	this.initMouse = function () {
		
		new rjs.RightClick((e) => {
			e.preventDefault();
			rjs.RightMousePressed = true;
		}, true, null, window);
		
		rjs.mosueLoop = new rjs.MouseMove((e) => {
			
			const prop = rjs.con_width / rjs.client.w;
			
			rjs._mouse.x = e.offsetX / prop - rjs.client.w/2;
			rjs._mouse.y = e.offsetY / prop - rjs.client.h/2;
			
		});

		rjs.touchMouseLoop = new rjs.TouchMove((e) => {
			
			const rect = rjs.eventDetector.getBoundingClientRect();
			const prop = rjs.con_width / rjs.client.w;

			rjs._mouse.x = (e.changedTouches[rjs._mouse.touchID].pageX-rect.x) / prop - rjs.client.w/2;
			rjs._mouse.y = (e.changedTouches[rjs._mouse.touchID].pageY-rect.y) / prop - rjs.client.h/2;
			
		});
		
		rjs.mousePressDownLoop = new rjs.MouseDown((e) => {
			rjs.MousePressed = true;
		}, true, null, rjs.ed);
		rjs.mousePressUpLoop = new rjs.MouseUp((e) => {
			rjs.MousePressed = false;
		}, true, null, rjs.ed);
		
	};

	let lastCalledTime = 0;

	this.FPS = 0;

	this.countFPS = function () {
		if(!lastCalledTime) {
		    lastCalledTime = Date.now();
		    rjs.FPS = 0;
		    return;
		}
		delta = (Date.now() - lastCalledTime)/1000;
		lastCalledTime = Date.now();
		rjs.FPS = Math.round(1/delta);
	};
	
	this.loadCollisionDetector = function () {
		require(rjs.engineSource+'collision.js')(rjs, {}); // jshint ignore:line
	};
	
	this.loadRenderer = function () {
		//rjs.renderCore = require(rjs.engineSource+'renderCore.js')(rjs); // jshint ignore:line
		rjs.renderer = require(rjs.engineSource+'renderer.js')(rjs);
		rjs.render = rjs.renderer.render;
	};
	
	this.init = function (){
		
		rjs.initGLOBAL();
		
		
		
		rjs.loadRenderer();

		fnc(rjs);

		rjs.loadCollisionDetector();
		rjs.initMouse();
		rjs.initKeyboard();
		rjs.initTouch();
		
		rjs.renderer.init(rjs);
		rjs.engineLoop([

			rjs.resizeCanvas, 
			rjs.keypressLoop, 
			rjs.mousepressLoop,
			rjs.intervalLoop,
			rjs.globalGameLoop, 
			rjs.animationLoop, 
			rjs.audioLoop,
			rjs.render,
			rjs.countFPS

		]);
		
	};
	
	rjs.init();
	
};

{// Version 0.7.1 - Copyright 2012 - 2018 -  Jim Riecken <jimr@jimr.ca>
//
// Released under the MIT License - https://github.com/jriecken/sat-js
//
// A simple library for determining intersections of circles and
// polygons using the Separating Axis Theorem.
/** @preserve SAT.js - Version 0.7.1 - Copyright 2012 - 2018 - Jim Riecken <jimr@jimr.ca> - released under the MIT License. https://github.com/jriecken/sat-js */

/*global define: false, module: false*/
/*jshint shadow:true, sub:true, forin:true, noarg:true, noempty:true,
  eqeqeq:true, bitwise:true, strict:true, undef:true,
  curly:true, browser:true */

// Create a UMD wrapper for SAT. Works in:
//
//  - Plain browser via global SAT variable
//  - AMD loader (like require.js)
//  - Node.js
//
// The quoted properties all over the place are used so that the Closure Compiler
// does not mangle the exposed API in advanced mode.
/**
 * @param {*} root - The global scope
 * @param {Function} factory - Factory that creates SAT module
 */
(function (root, factory) {
  "use strict";
  if (typeof define === 'function' && define['amd']) {
    define(factory);
  } else if (typeof exports === 'object') {
    module['exports'] = factory();
  } else {
    root['SAT'] = factory();
  }
}(this, function () {
  "use strict";

  var SAT = {};

  //
  // ## Vector
  //
  // Represents a vector in two dimensions with `x` and `y` properties.


  // Create a new Vector, optionally passing in the `x` and `y` coordinates. If
  // a coordinate is not specified, it will be set to `0`
  /**
   * @param {?number=} x The x position.
   * @param {?number=} y The y position.
   * @constructor
   */
  function Vector(x, y) {
    this['x'] = x || 0;
    this['y'] = y || 0;
  }
  SAT['Vector'] = Vector;
  // Alias `Vector` as `V`
  SAT['V'] = Vector;


  // Copy the values of another Vector into this one.
  /**
   * @param {Vector} other The other Vector.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['copy'] = Vector.prototype.copy = function(other) {
    this['x'] = other['x'];
    this['y'] = other['y'];
    return this;
  };

  // Create a new vector with the same coordinates as this on.
  /**
   * @return {Vector} The new cloned vector
   */
  Vector.prototype['clone'] = Vector.prototype.clone = function() {
    return new Vector(this['x'], this['y']);
  };

  // Change this vector to be perpendicular to what it was before. (Effectively
  // roatates it 90 degrees in a clockwise direction)
  /**
   * @return {Vector} This for chaining.
   */
  Vector.prototype['perp'] = Vector.prototype.perp = function() {
    var x = this['x'];
    this['x'] = this['y'];
    this['y'] = -x;
    return this;
  };

  // Rotate this vector (counter-clockwise) by the specified angle (in radians).
  /**
   * @param {number} angle The angle to rotate (in radians)
   * @return {Vector} This for chaining.
   */
  Vector.prototype['rotate'] = Vector.prototype.rotate = function (angle) {
    var x = this['x'];
    var y = this['y'];
    this['x'] = x * Math.cos(angle) - y * Math.sin(angle);
    this['y'] = x * Math.sin(angle) + y * Math.cos(angle);
    return this;
  };

  // Reverse this vector.
  /**
   * @return {Vector} This for chaining.
   */
  Vector.prototype['reverse'] = Vector.prototype.reverse = function() {
    this['x'] = -this['x'];
    this['y'] = -this['y'];
    return this;
  };


  // Normalize this vector.  (make it have length of `1`)
  /**
   * @return {Vector} This for chaining.
   */
  Vector.prototype['normalize'] = Vector.prototype.normalize = function() {
    var d = this.len();
    if(d > 0) {
      this['x'] = this['x'] / d;
      this['y'] = this['y'] / d;
    }
    return this;
  };

  // Add another vector to this one.
  /**
   * @param {Vector} other The other Vector.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['add'] = Vector.prototype.add = function(other) {
    this['x'] += other['x'];
    this['y'] += other['y'];
    return this;
  };

  // Subtract another vector from this one.
  /**
   * @param {Vector} other The other Vector.
   * @return {Vector} This for chaiing.
   */
  Vector.prototype['sub'] = Vector.prototype.sub = function(other) {
    this['x'] -= other['x'];
    this['y'] -= other['y'];
    return this;
  };

  // Scale this vector. An independent scaling factor can be provided
  // for each axis, or a single scaling factor that will scale both `x` and `y`.
  /**
   * @param {number} x The scaling factor in the x direction.
   * @param {?number=} y The scaling factor in the y direction.  If this
   *   is not specified, the x scaling factor will be used.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['scale'] = Vector.prototype.scale = function(x,y) {
    this['x'] *= x;
    this['y'] *= typeof y != 'undefined' ? y : x; // jshint ignore:line
    return this;
  };

  // Project this vector on to another vector.
  /**
   * @param {Vector} other The vector to project onto.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['project'] = Vector.prototype.project = function(other) {
    var amt = this.dot(other) / other.len2();
    this['x'] = amt * other['x'];
    this['y'] = amt * other['y'];
    return this;
  };

  // Project this vector onto a vector of unit length. This is slightly more efficient
  // than `project` when dealing with unit vectors.
  /**
   * @param {Vector} other The unit vector to project onto.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['projectN'] = Vector.prototype.projectN = function(other) {
    var amt = this.dot(other);
    this['x'] = amt * other['x'];
    this['y'] = amt * other['y'];
    return this;
  };

  // Reflect this vector on an arbitrary axis.
  /**
   * @param {Vector} axis The vector representing the axis.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['reflect'] = Vector.prototype.reflect = function(axis) {
    var x = this['x'];
    var y = this['y'];
    this.project(axis).scale(2);
    this['x'] -= x;
    this['y'] -= y;
    return this;
  };

  // Reflect this vector on an arbitrary axis (represented by a unit vector). This is
  // slightly more efficient than `reflect` when dealing with an axis that is a unit vector.
  /**
   * @param {Vector} axis The unit vector representing the axis.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['reflectN'] = Vector.prototype.reflectN = function(axis) {
    var x = this['x'];
    var y = this['y'];
    this.projectN(axis).scale(2);
    this['x'] -= x;
    this['y'] -= y;
    return this;
  };

  // Get the dot product of this vector and another.
  /**
   * @param {Vector}  other The vector to dot this one against.
   * @return {number} The dot product.
   */
  Vector.prototype['dot'] = Vector.prototype.dot = function(other) {
    return this['x'] * other['x'] + this['y'] * other['y'];
  };

  // Get the squared length of this vector.
  /**
   * @return {number} The length^2 of this vector.
   */
  Vector.prototype['len2'] = Vector.prototype.len2 = function() {
    return this.dot(this);
  };

  // Get the length of this vector.
  /**
   * @return {number} The length of this vector.
   */
  Vector.prototype['len'] = Vector.prototype.len = function() {
    return Math.sqrt(this.len2());
  };

  // ## Circle
  //
  // Represents a circle with a position and a radius.

  // Create a new circle, optionally passing in a position and/or radius. If no position
  // is given, the circle will be at `(0,0)`. If no radius is provided, the circle will
  // have a radius of `0`.
  /**
   * @param {Vector=} pos A vector representing the position of the center of the circle
   * @param {?number=} r The radius of the circle
   * @constructor
   */
  function Circle(pos, r) {
    this['pos'] = pos || new Vector();
    this['r'] = r || 0;
  }
  SAT['Circle'] = Circle;

  // Compute the axis-aligned bounding box (AABB) of this Circle.
  //
  // Note: Returns a _new_ `Polygon` each time you call this.
  /**
   * @return {Polygon} The AABB
   */
  Circle.prototype['getAABB'] = Circle.prototype.getAABB = function() {
    var r = this['r'];
    var corner = this["pos"].clone().sub(new Vector(r, r));
    return new Box(corner, r*2, r*2).toPolygon();
  };

  // ## Polygon
  //
  // Represents a *convex* polygon with any number of points (specified in counter-clockwise order)
  //
  // Note: Do _not_ manually change the `points`, `angle`, or `offset` properties. Use the
  // provided setters. Otherwise the calculated properties will not be updated correctly.
  //
  // `pos` can be changed directly.

  // Create a new polygon, passing in a position vector, and an array of points (represented
  // by vectors relative to the position vector). If no position is passed in, the position
  // of the polygon will be `(0,0)`.
  /**
   * @param {Vector=} pos A vector representing the origin of the polygon. (all other
   *   points are relative to this one)
   * @param {Array<Vector>=} points An array of vectors representing the points in the polygon,
   *   in counter-clockwise order.
   * @constructor
   */
  function Polygon(pos, points) {
    this['pos'] = pos || new Vector();
    this['angle'] = 0;
    this['offset'] = new Vector();
    this.setPoints(points || []);
  }
  SAT['Polygon'] = Polygon;

  // Set the points of the polygon.
  //
  // Note: The points are counter-clockwise *with respect to the coordinate system*.
  // If you directly draw the points on a screen that has the origin at the top-left corner
  // it will _appear_ visually that the points are being specified clockwise. This is just
  // because of the inversion of the Y-axis when being displayed.
  /**
   * @param {Array<Vector>=} points An array of vectors representing the points in the polygon,
   *   in counter-clockwise order.
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['setPoints'] = Polygon.prototype.setPoints = function(points) {
    // Only re-allocate if this is a new polygon or the number of points has changed.
    var lengthChanged = !this['points'] || this['points'].length !== points.length;
    if (lengthChanged) {
      var i;
      var calcPoints = this['calcPoints'] = [];
      var edges = this['edges'] = [];
      var normals = this['normals'] = [];
      // Allocate the vector arrays for the calculated properties
      for (i = 0; i < points.length; i++) {
        calcPoints.push(new Vector());
        edges.push(new Vector());
        normals.push(new Vector());
      }
    }
    this['points'] = points;
    this._recalc();
    return this;
  };

  // Set the current rotation angle of the polygon.
  /**
   * @param {number} angle The current rotation angle (in radians).
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['setAngle'] = Polygon.prototype.setAngle = function(angle) {
    this['angle'] = angle;
    this._recalc();
    return this;
  };

  // Set the current offset to apply to the `points` before applying the `angle` rotation.
  /**
   * @param {Vector} offset The new offset vector.
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['setOffset'] = Polygon.prototype.setOffset = function(offset) {
    this['offset'] = offset;
    this._recalc();
    return this;
  };

  // Rotates this polygon counter-clockwise around the origin of *its local coordinate system* (i.e. `pos`).
  //
  // Note: This changes the **original** points (so any `angle` will be applied on top of this rotation).
  /**
   * @param {number} angle The angle to rotate (in radians)
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['rotate'] = Polygon.prototype.rotate = function(angle) {
    var points = this['points'];
    var len = points.length;
    for (var i = 0; i < len; i++) {
      points[i].rotate(angle);
    }
    this._recalc();
    return this;
  };

  // Translates the points of this polygon by a specified amount relative to the origin of *its own coordinate
  // system* (i.e. `pos`).
  //
  // This is most useful to change the "center point" of a polygon. If you just want to move the whole polygon, change
  // the coordinates of `pos`.
  //
  // Note: This changes the **original** points (so any `offset` will be applied on top of this translation)
  /**
   * @param {number} x The horizontal amount to translate.
   * @param {number} y The vertical amount to translate.
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['translate'] = Polygon.prototype.translate = function (x, y) {
    var points = this['points'];
    var len = points.length;
    for (var i = 0; i < len; i++) {
      points[i]["x"] += x;
      points[i]["y"] += y;
    }
    this._recalc();
    return this;
  };


  // Computes the calculated collision polygon. Applies the `angle` and `offset` to the original points then recalculates the
  // edges and normals of the collision polygon.
  /**
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype._recalc = function() {
    // Calculated points - this is what is used for underlying collisions and takes into account
    // the angle/offset set on the polygon.
    var calcPoints = this['calcPoints'];
    // The edges here are the direction of the `n`th edge of the polygon, relative to
    // the `n`th point. If you want to draw a given edge from the edge value, you must
    // first translate to the position of the starting point.
    var edges = this['edges'];
    // The normals here are the direction of the normal for the `n`th edge of the polygon, relative
    // to the position of the `n`th point. If you want to draw an edge normal, you must first
    // translate to the position of the starting point.
    var normals = this['normals'];
    // Copy the original points array and apply the offset/angle
    var points = this['points'];
    var offset = this['offset'];
    var angle = this['angle'];
    var len = points.length;
    var i;
    for (i = 0; i < len; i++) {
      var calcPoint = calcPoints[i].copy(points[i]);
      calcPoint["x"] += offset["x"];
      calcPoint["y"] += offset["y"];
      if (angle !== 0) {
        calcPoint.rotate(angle);
      }
    }
    // Calculate the edges/normals
    for (i = 0; i < len; i++) {
      var p1 = calcPoints[i];
      var p2 = i < len - 1 ? calcPoints[i + 1] : calcPoints[0];
      var e = edges[i].copy(p2).sub(p1);
      normals[i].copy(e).perp().normalize();
    }
    return this;
  };


  // Compute the axis-aligned bounding box. Any current state
  // (translations/rotations) will be applied before constructing the AABB.
  //
  // Note: Returns a _new_ `Polygon` each time you call this.
  /**
   * @return {Polygon} The AABB
   */
  Polygon.prototype["getAABB"] = Polygon.prototype.getAABB = function() {
    var points = this["calcPoints"];
    var len = points.length;
    var xMin = points[0]["x"];
    var yMin = points[0]["y"];
    var xMax = points[0]["x"];
    var yMax = points[0]["y"];
    for (var i = 1; i < len; i++) {
      var point = points[i];
      if (point["x"] < xMin) {
        xMin = point["x"];
      }
      else if (point["x"] > xMax) {
        xMax = point["x"];
      }
      if (point["y"] < yMin) {
        yMin = point["y"];
      }
      else if (point["y"] > yMax) {
        yMax = point["y"];
      }
    }
    return new Box(this["pos"].clone().add(new Vector(xMin, yMin)), xMax - xMin, yMax - yMin).toPolygon();
  };

  // Compute the centroid (geometric center) of the polygon. Any current state
  // (translations/rotations) will be applied before computing the centroid.
  //
  // See https://en.wikipedia.org/wiki/Centroid#Centroid_of_a_polygon
  //
  // Note: Returns a _new_ `Vector` each time you call this.
  /**
   * @return {Vector} A Vector that contains the coordinates of the Centroid.
   */
  Polygon.prototype["getCentroid"] = Polygon.prototype.getCentroid = function() {
    var points = this["calcPoints"];
    var len = points.length;
    var cx = 0;
    var cy = 0;
    var ar = 0;
    for (var i = 0; i < len; i++) {
      var p1 = points[i];
      var p2 = i === len - 1 ? points[0] : points[i+1]; // Loop around if last point
      var a = p1["x"] * p2["y"] - p2["x"] * p1["y"];
      cx += (p1["x"] + p2["x"]) * a;
      cy += (p1["y"] + p2["y"]) * a;
      ar += a;
    }
    ar = ar * 3; // we want 1 / 6 the area and we currently have 2*area
    cx = cx / ar;
    cy = cy / ar;
    return new Vector(cx, cy);
  };


  // ## Box
  //
  // Represents an axis-aligned box, with a width and height.


  // Create a new box, with the specified position, width, and height. If no position
  // is given, the position will be `(0,0)`. If no width or height are given, they will
  // be set to `0`.
  /**
   * @param {Vector=} pos A vector representing the bottom-left of the box (i.e. the smallest x and smallest y value).
   * @param {?number=} w The width of the box.
   * @param {?number=} h The height of the box.
   * @constructor
   */
  function Box(pos, w, h) {
    this['pos'] = pos || new Vector();
    this['w'] = w || 0;
    this['h'] = h || 0;
  }
  SAT['Box'] = Box;

  // Returns a polygon whose edges are the same as this box.
  /**
   * @return {Polygon} A new Polygon that represents this box.
   */
  Box.prototype['toPolygon'] = Box.prototype.toPolygon = function() {
    var pos = this['pos'];
    var w = this['w'];
    var h = this['h'];
    return new Polygon(new Vector(pos['x'], pos['y']), [
     new Vector(), new Vector(w, 0),
     new Vector(w,h), new Vector(0,h)
    ]);
  };

  // ## Response
  //
  // An object representing the result of an intersection. Contains:
  //  - The two objects participating in the intersection
  //  - The vector representing the minimum change necessary to extract the first object
  //    from the second one (as well as a unit vector in that direction and the magnitude
  //    of the overlap)
  //  - Whether the first object is entirely inside the second, and vice versa.
  /**
   * @constructor
   */
  function Response() {
    this['a'] = null;
    this['b'] = null;
    this['overlapN'] = new Vector();
    this['overlapV'] = new Vector();
    this.clear();
  }
  SAT['Response'] = Response;

  // Set some values of the response back to their defaults.  Call this between tests if
  // you are going to reuse a single Response object for multiple intersection tests (recommented
  // as it will avoid allcating extra memory)
  /**
   * @return {Response} This for chaining
   */
  Response.prototype['clear'] = Response.prototype.clear = function() {
    this['aInB'] = true;
    this['bInA'] = true;
    this['overlap'] = Number.MAX_VALUE;
    return this;
  };

  // ## Object Pools

  // A pool of `Vector` objects that are used in calculations to avoid
  // allocating memory.
  /**
   * @type {Array<Vector>}
   */
  var T_VECTORS = [];
  for (var i = 0; i < 10; i++) { T_VECTORS.push(new Vector()); }

  // A pool of arrays of numbers used in calculations to avoid allocating
  // memory.
  /**
   * @type {Array<Array<number>>}
   */
  var T_ARRAYS = [];
  for (var i = 0; i < 5; i++) { T_ARRAYS.push([]); }

  // Temporary response used for polygon hit detection.
  /**
   * @type {Response}
   */
  var T_RESPONSE = new Response();

  // Tiny "point" polygon used for polygon hit detection.
  /**
   * @type {Polygon}
   */
  var TEST_POINT = new Box(new Vector(), 0.000001, 0.000001).toPolygon();

  // ## Helper Functions

  // Flattens the specified array of points onto a unit vector axis,
  // resulting in a one dimensional range of the minimum and
  // maximum value on that axis.
  /**
   * @param {Array<Vector>} points The points to flatten.
   * @param {Vector} normal The unit vector axis to flatten on.
   * @param {Array<number>} result An array.  After calling this function,
   *   result[0] will be the minimum value,
   *   result[1] will be the maximum value.
   */
  function flattenPointsOn(points, normal, result) {
    var min = Number.MAX_VALUE;
    var max = -Number.MAX_VALUE;
    var len = points.length;
    for (var i = 0; i < len; i++ ) {
      // The magnitude of the projection of the point onto the normal
      var dot = points[i].dot(normal);
      if (dot < min) { min = dot; }
      if (dot > max) { max = dot; }
    }
    result[0] = min; result[1] = max;
  }

  // Check whether two convex polygons are separated by the specified
  // axis (must be a unit vector).
  /**
   * @param {Vector} aPos The position of the first polygon.
   * @param {Vector} bPos The position of the second polygon.
   * @param {Array<Vector>} aPoints The points in the first polygon.
   * @param {Array<Vector>} bPoints The points in the second polygon.
   * @param {Vector} axis The axis (unit sized) to test against.  The points of both polygons
   *   will be projected onto this axis.
   * @param {Response=} response A Response object (optional) which will be populated
   *   if the axis is not a separating axis.
   * @return {boolean} true if it is a separating axis, false otherwise.  If false,
   *   and a response is passed in, information about how much overlap and
   *   the direction of the overlap will be populated.
   */
  function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {
    var rangeA = T_ARRAYS.pop();
    var rangeB = T_ARRAYS.pop();
    // The magnitude of the offset between the two polygons
    var offsetV = T_VECTORS.pop().copy(bPos).sub(aPos);
    var projectedOffset = offsetV.dot(axis);
    // Project the polygons onto the axis.
    flattenPointsOn(aPoints, axis, rangeA);
    flattenPointsOn(bPoints, axis, rangeB);
    // Move B's range to its position relative to A.
    rangeB[0] += projectedOffset;
    rangeB[1] += projectedOffset;
    // Check if there is a gap. If there is, this is a separating axis and we can stop
    if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
      T_VECTORS.push(offsetV);
      T_ARRAYS.push(rangeA);
      T_ARRAYS.push(rangeB);
      return true;
    }
    // This is not a separating axis. If we're calculating a response, calculate the overlap.
    if (response) {
      var overlap = 0;
      // A starts further left than B
      if (rangeA[0] < rangeB[0]) {
        response['aInB'] = false;
        // A ends before B does. We have to pull A out of B
        if (rangeA[1] < rangeB[1]) {
          overlap = rangeA[1] - rangeB[0];
          response['bInA'] = false;
        // B is fully inside A.  Pick the shortest way out.
        } else {
          var option1 = rangeA[1] - rangeB[0];
          var option2 = rangeB[1] - rangeA[0];
          overlap = option1 < option2 ? option1 : -option2;
        }
      // B starts further left than A
      } else {
        response['bInA'] = false;
        // B ends before A ends. We have to push A out of B
        if (rangeA[1] > rangeB[1]) {
          overlap = rangeA[0] - rangeB[1];
          response['aInB'] = false;
        // A is fully inside B.  Pick the shortest way out.
        } else {
          var option1 = rangeA[1] - rangeB[0];
          var option2 = rangeB[1] - rangeA[0];
          overlap = option1 < option2 ? option1 : -option2;
        }
      }
      // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
      var absOverlap = Math.abs(overlap);
      if (absOverlap < response['overlap']) {
        response['overlap'] = absOverlap;
        response['overlapN'].copy(axis);
        if (overlap < 0) {
          response['overlapN'].reverse();
        }
      }
    }
    T_VECTORS.push(offsetV);
    T_ARRAYS.push(rangeA);
    T_ARRAYS.push(rangeB);
    return false;
  }
  SAT['isSeparatingAxis'] = isSeparatingAxis;

  // Calculates which Voronoi region a point is on a line segment.
  // It is assumed that both the line and the point are relative to `(0,0)`
  //
  //            |       (0)      |
  //     (-1)  [S]--------------[E]  (1)
  //            |       (0)      |
  /**
   * @param {Vector} line The line segment.
   * @param {Vector} point The point.
   * @return  {number} LEFT_VORONOI_REGION (-1) if it is the left region,
   *          MIDDLE_VORONOI_REGION (0) if it is the middle region,
   *          RIGHT_VORONOI_REGION (1) if it is the right region.
   */
  function voronoiRegion(line, point) {
    var len2 = line.len2();
    var dp = point.dot(line);
    // If the point is beyond the start of the line, it is in the
    // left voronoi region.
    if (dp < 0) { return LEFT_VORONOI_REGION; }
    // If the point is beyond the end of the line, it is in the
    // right voronoi region.
    else if (dp > len2) { return RIGHT_VORONOI_REGION; }
    // Otherwise, it's in the middle one.
    else { return MIDDLE_VORONOI_REGION; }
  }
  // Constants for Voronoi regions
  /**
   * @const
   */
  var LEFT_VORONOI_REGION = -1;
  /**
   * @const
   */
  var MIDDLE_VORONOI_REGION = 0;
  /**
   * @const
   */
  var RIGHT_VORONOI_REGION = 1;

  // ## Collision Tests

  // Check if a point is inside a circle.
  /**
   * @param {Vector} p The point to test.
   * @param {Circle} c The circle to test.
   * @return {boolean} true if the point is inside the circle, false if it is not.
   */
  function pointInCircle(p, c) {
    var differenceV = T_VECTORS.pop().copy(p).sub(c['pos']);
    var radiusSq = c['r'] * c['r'];
    var distanceSq = differenceV.len2();
    T_VECTORS.push(differenceV);
    // If the distance between is smaller than the radius then the point is inside the circle.
    return distanceSq <= radiusSq;
  }
  SAT['pointInCircle'] = pointInCircle;

  // Check if a point is inside a convex polygon.
  /**
   * @param {Vector} p The point to test.
   * @param {Polygon} poly The polygon to test.
   * @return {boolean} true if the point is inside the polygon, false if it is not.
   */
  function pointInPolygon(p, poly) {
    TEST_POINT['pos'].copy(p);
    T_RESPONSE.clear();
    var result = testPolygonPolygon(TEST_POINT, poly, T_RESPONSE);
    if (result) {
      result = T_RESPONSE['aInB'];
    }
    return result;
  }
  SAT['pointInPolygon'] = pointInPolygon;

  // Check if two circles collide.
  /**
   * @param {Circle} a The first circle.
   * @param {Circle} b The second circle.
   * @param {Response=} response Response object (optional) that will be populated if
   *   the circles intersect.
   * @return {boolean} true if the circles intersect, false if they don't.
   */
  function testCircleCircle(a, b, response) {
    // Check if the distance between the centers of the two
    // circles is greater than their combined radius.
    var differenceV = T_VECTORS.pop().copy(b['pos']).sub(a['pos']);
    var totalRadius = a['r'] + b['r'];
    var totalRadiusSq = totalRadius * totalRadius;
    var distanceSq = differenceV.len2();
    // If the distance is bigger than the combined radius, they don't intersect.
    if (distanceSq > totalRadiusSq) {
      T_VECTORS.push(differenceV);
      return false;
    }
    // They intersect.  If we're calculating a response, calculate the overlap.
    if (response) {
      var dist = Math.sqrt(distanceSq);
      response['a'] = a;
      response['b'] = b;
      response['overlap'] = totalRadius - dist;
      response['overlapN'].copy(differenceV.normalize());
      response['overlapV'].copy(differenceV).scale(response['overlap']);
      response['aInB']= a['r'] <= b['r'] && dist <= b['r'] - a['r'];
      response['bInA'] = b['r'] <= a['r'] && dist <= a['r'] - b['r'];
    }
    T_VECTORS.push(differenceV);
    return true;
  }
  SAT['testCircleCircle'] = testCircleCircle;

  // Check if a polygon and a circle collide.
  /**
   * @param {Polygon} polygon The polygon.
   * @param {Circle} circle The circle.
   * @param {Response=} response Response object (optional) that will be populated if
   *   they interset.
   * @return {boolean} true if they intersect, false if they don't.
   */
  function testPolygonCircle(polygon, circle, response) {
    // Get the position of the circle relative to the polygon.
    var circlePos = T_VECTORS.pop().copy(circle['pos']).sub(polygon['pos']);
    var radius = circle['r'];
    var radius2 = radius * radius;
    var points = polygon['calcPoints'];
    var len = points.length;
    var edge = T_VECTORS.pop();
    var point = T_VECTORS.pop();

    // For each edge in the polygon:
    for (var i = 0; i < len; i++) {
      var next = i === len - 1 ? 0 : i + 1;
      var prev = i === 0 ? len - 1 : i - 1;
      var overlap = 0;
      var overlapN = null;

      // Get the edge.
      edge.copy(polygon['edges'][i]);
      // Calculate the center of the circle relative to the starting point of the edge.
      point.copy(circlePos).sub(points[i]);

      // If the distance between the center of the circle and the point
      // is bigger than the radius, the polygon is definitely not fully in
      // the circle.
      if (response && point.len2() > radius2) {
        response['aInB'] = false;
      }

      // Calculate which Voronoi region the center of the circle is in.
      var region = voronoiRegion(edge, point);
      // If it's the left region:
      if (region === LEFT_VORONOI_REGION) {
        // We need to make sure we're in the RIGHT_VORONOI_REGION of the previous edge.
        edge.copy(polygon['edges'][prev]);
        // Calculate the center of the circle relative the starting point of the previous edge
        var point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);
        region = voronoiRegion(edge, point2);
        if (region === RIGHT_VORONOI_REGION) {
          // It's in the region we want.  Check if the circle intersects the point.
          var dist = point.len();
          if (dist > radius) {
            // No intersection
            T_VECTORS.push(circlePos);
            T_VECTORS.push(edge);
            T_VECTORS.push(point);
            T_VECTORS.push(point2);
            return false;
          } else if (response) {
            // It intersects, calculate the overlap.
            response['bInA'] = false;
            overlapN = point.normalize();
            overlap = radius - dist;
          }
        }
        T_VECTORS.push(point2);
      // If it's the right region:
      } else if (region === RIGHT_VORONOI_REGION) {
        // We need to make sure we're in the left region on the next edge
        edge.copy(polygon['edges'][next]);
        // Calculate the center of the circle relative to the starting point of the next edge.
        point.copy(circlePos).sub(points[next]);
        region = voronoiRegion(edge, point);
        if (region === LEFT_VORONOI_REGION) {
          // It's in the region we want.  Check if the circle intersects the point.
          var dist = point.len();
          if (dist > radius) {
            // No intersection
            T_VECTORS.push(circlePos);
            T_VECTORS.push(edge);
            T_VECTORS.push(point);
            return false;
          } else if (response) {
            // It intersects, calculate the overlap.
            response['bInA'] = false;
            overlapN = point.normalize();
            overlap = radius - dist;
          }
        }
      // Otherwise, it's the middle region:
      } else {
        // Need to check if the circle is intersecting the edge,
        // Change the edge into its "edge normal".
        var normal = edge.perp().normalize();
        // Find the perpendicular distance between the center of the
        // circle and the edge.
        var dist = point.dot(normal);
        var distAbs = Math.abs(dist);
        // If the circle is on the outside of the edge, there is no intersection.
        if (dist > 0 && distAbs > radius) {
          // No intersection
          T_VECTORS.push(circlePos);
          T_VECTORS.push(normal);
          T_VECTORS.push(point);
          return false;
        } else if (response) {
          // It intersects, calculate the overlap.
          overlapN = normal;
          overlap = radius - dist;
          // If the center of the circle is on the outside of the edge, or part of the
          // circle is on the outside, the circle is not fully inside the polygon.
          if (dist >= 0 || overlap < 2 * radius) {
            response['bInA'] = false;
          }
        }
      }

      // If this is the smallest overlap we've seen, keep it.
      // (overlapN may be null if the circle was in the wrong Voronoi region).
      if (overlapN && response && Math.abs(overlap) < Math.abs(response['overlap'])) {
        response['overlap'] = overlap;
        response['overlapN'].copy(overlapN);
      }
    }

    // Calculate the final overlap vector - based on the smallest overlap.
    if (response) {
      response['a'] = polygon;
      response['b'] = circle;
      response['overlapV'].copy(response['overlapN']).scale(response['overlap']);
    }
    T_VECTORS.push(circlePos);
    T_VECTORS.push(edge);
    T_VECTORS.push(point);
    return true;
  }
  SAT['testPolygonCircle'] = testPolygonCircle;

  // Check if a circle and a polygon collide.
  //
  // **NOTE:** This is slightly less efficient than polygonCircle as it just
  // runs polygonCircle and reverses everything at the end.
  /**
   * @param {Circle} circle The circle.
   * @param {Polygon} polygon The polygon.
   * @param {Response=} response Response object (optional) that will be populated if
   *   they interset.
   * @return {boolean} true if they intersect, false if they don't.
   */
  function testCirclePolygon(circle, polygon, response) {
    // Test the polygon against the circle.
    var result = testPolygonCircle(polygon, circle, response);
    if (result && response) {
      // Swap A and B in the response.
      var a = response['a'];
      var aInB = response['aInB'];
      response['overlapN'].reverse();
      response['overlapV'].reverse();
      response['a'] = response['b'];
      response['b'] = a;
      response['aInB'] = response['bInA'];
      response['bInA'] = aInB;
    }
    return result;
  }
  SAT['testCirclePolygon'] = testCirclePolygon;

  // Checks whether polygons collide.
  /**
   * @param {Polygon} a The first polygon.
   * @param {Polygon} b The second polygon.
   * @param {Response=} response Response object (optional) that will be populated if
   *   they interset.
   * @return {boolean} true if they intersect, false if they don't.
   */
  function testPolygonPolygon(a, b, response) {
    var aPoints = a['calcPoints'];
    var aLen = aPoints.length;
    var bPoints = b['calcPoints'];
    var bLen = bPoints.length;
    // If any of the edge normals of A is a separating axis, no intersection.
    for (var i = 0; i < aLen; i++) {
      if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, a['normals'][i], response)) {
        return false;
      }
    }
    // If any of the edge normals of B is a separating axis, no intersection.
    for (var i = 0;i < bLen; i++) {
      if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, b['normals'][i], response)) {
        return false;
      }
    }
    // Since none of the edge normals of A or B are a separating axis, there is an intersection
    // and we've already calculated the smallest overlap (in isSeparatingAxis).  Calculate the
    // final overlap vector.
    if (response) {
      response['a'] = a;
      response['b'] = b;
      response['overlapV'].copy(response['overlapN']).scale(response['overlap']);
    }
    return true;
  }
  SAT['testPolygonPolygon'] = testPolygonPolygon;

  return SAT;
}));
}
