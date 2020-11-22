(rjs) => {

	var tools = {};

	tools.createShader = function (gl, type, code) {
		var shader = gl.createShader(type);
		gl.shaderSource(shader, code);
		gl.compileShader(shader);
		
		var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if(success) {
			return shader;
		}
		else {
			log(gl.getShaderInfoLog(shader));
			gl.deleteShader(shader);
		}
	};
	
	tools.createProgram = function (gl, vs, fs) {
		
		var program = gl.createProgram();
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		gl.linkProgram(program);
		
		var success = gl.getProgramParameter(program, gl.LINK_STATUS);
		if(success) {
			return program;
		}
		else {
			log(gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
		}
		
	};

	tools.getAtan = function (a, b, c) {
		var A = vec2(a.x-c.x, a.y-c.y);
		var B = vec2(b.x-c.x, b.y-c.y);
		var a1 = Math.atan2(A.x, A.y) * 180 / Math.PI;
		var a2 = Math.atan2(B.x, B.y) * 180 / Math.PI;
		return a2 - a1;
	}

	tools.getN = function (vertList, n) {
		if(n >= vertList.length)
			n -= vertList.length;
		return n;
	}

	tools.getVert = function (vertList, n) {
		n = tools.getN(vertList, n);
		if(typeof vertList[n] != 'undefined')
			return vertList[n];
		else
			return tools.getVert(vertList, n+1);
	}

	tools.getVertID = function (vertList, n) {
		n = tools.getN(vertList, n);
		if(typeof vertList[n] != 'undefined')
			return n;
		else
			return tools.getVertID(vertList, n+1);
	}

	tools.triStep = function (vertList, triList, n) {
		if(count(vertList) < 3)
			return;
		n = tools.getN(vertList, n);
		if(typeof vertList[n] != 'undefined') {
			var A_ID = tools.getVertID(vertList, n);
			var C_ID = tools.getVertID(vertList, A_ID+1);
			var B_ID = tools.getVertID(vertList, C_ID+1);
			var A = vertList[A_ID];
			var B = vertList[B_ID];
			var C = vertList[C_ID];
			var atan = tools.getAtan(A, B, C);
			if(atan < 180) {
				triList.push(A);
				triList.push(B);
				triList.push(C);
				delete vertList[C_ID];
			}
		}
		n ++;
		tools.triStep(vertList, triList, n);
	}
	
	tools.triangulation = function (vertices = []) {

		var vertList = [];

		for(var i in vertices) {
			vertList[i] = vertices[i];
		}
		
		var triList = [];
		var n = 0;

		tools.triStep(vertList, triList, n);

		return triList;
		
	}

	//converting an array of points to WebGL vertices array
	tools.getVerticesArray = function (o) {
		
		var vertices = [];
		
		var vert;
		if(o.type == 'polygon') {
			vert = tools.triangulation(o.vertices);
		}

		else if(o.type == 'sprite') {
			var w = o.size.x/2;
			var h = o.size.y/2;
			vert = [
				vec2(-w, -h),
				vec2(w, -h),
				vec2(w, h),
				vec2(w, h),
				vec2(-w, h),
				vec2(-w, -h)
			];
		}
		else if(o.type == 'text') {
			vert = [];
		}
		
		for(var i = 0; i < vert.length; i ++) {
			vertices[i*2+0] = vert[i].x;
			vertices[i*2+1] = vert[i].y;
		}

		return vertices;
		
	};
	
	//returns texture coordinates (for shaders)
	tools.getTexcoordArray = function (o, vertices, texture = null) {
		
		var texcoord = [];
		
		var bb = tools.getBoundingBox(vertices);

		var mx = 1;
		var my = 1;

		if(texture == null) {
			for(var i = 0; i < vertices.length; i += 2) {
				var x = (vertices[i] - bb.minX) / bb.w;
				var y = (vertices[i+1] - bb.minY) / bb.h;
				texcoord[i] = x;
				texcoord[i+1] = y;
			}
		}

		else if(texture.type == 'tiled') {
			var mx = 1;
			var my = 1;
			if(o.type == 'sprite') {
				mx = o.size.x;
				my = o.size.y;
				bb.minX *= mx;
				bb.minY *= my;
				bb.maxX *= mx;
				bb.maxY *= my;
				bb.w *= mx;
				bb.h *= my;
			}
			var tx = typeof texture.size.x == 'number' ? texture.size.x : bb.w;
			var ty = typeof texture.size.y == 'number' ? texture.size.y : bb.h;
			var size = vec2(tx, ty);
			for(var i = 0; i < vertices.length; i += 2) {
				var x = (vertices[i]*mx - bb.minX) / size.x;
				var y = (vertices[i+1]*my - bb.minY) / size.y;
				texcoord[i] = x;
				texcoord[i+1] = y;
			}
		}

		else if(texture.type == 'croped') {
			for(var i = 0; i < vertices.length; i += 2) {
				var x = ((vertices[i] - bb.minX) / bb.w + texture.pos.x / (texture.size.x)) / (texture.tex.canvas.width/texture.size.x);// + texture.pos.x / (texture.tex.image.width/texture.size.x)) / (texture.tex.image.width/texture.size.x);
				var y = ((vertices[i+1] - bb.minY) / bb.h + texture.pos.y / (texture.size.y)) / (texture.tex.canvas.height/texture.size.y);// + texture.pos.y / (texture.tex.image.width/texture.size.x))  / (texture.tex.image.height/texture.size.y);
				texcoord[i] = x;
				texcoord[i+1] = y;
			}
		}
		
		return texcoord;
		
	};
	
	tools.getBoundingBox = function (vertices) {
		var minX = vertices[0];
		var minY = vertices[1];
		var maxX = vertices[0];
		var maxY = vertices[1];
		for(var i = 0; i < vertices.length; i += 2) {
			if(vertices[i] < minX)
				minX = vertices[i];
			if(vertices[i+1] < minY)
				minY = vertices[i+1];
			if(vertices[i] > maxX)
				maxX = vertices[i];
			if(vertices[i+1] > maxY)
				maxY = vertices[i+1];
		}
		return {
			w: maxX - minX,
			h: maxY - minY,
			minX: minX,
			minY: minY,
			maxX: maxX,
			maxY: maxY
		};
	};
	
	//matrices
	tools.projectionMatrix = function (w, h) {
		return [
			2 / w, 0, 0,
			0, -2 / h, 0,
			0, 0, 1
		];
	};
	
	tools.translationMatrix = function (tx, ty) {
		return [
			1, 0, 0,
			0, 1, 0,
			tx, ty, 1
		];
	};
	
	tools.scalingMatrix = function (sx, sy) {
		return [
			sx, 0, 0,
			0, sy, 0,
			0, 0, 1
		];
	};
	
	tools.rotationMatrix = function (angle) {
		var a = angle;
		var sin = 0;
		var cos = 1;
		if(a != 0) {
			a = -angle * Math.PI / 180;
			sin = Math.sin(a);
			cos = Math.cos(a);
		}
		return [
			cos, -sin, 0,
			sin, cos, 0,
			0, 0, 1
		];
	};
	
	tools.multiplyMatrix = function (a, b) {
		var a00 = a[0 * 3 + 0];
		var a01 = a[0 * 3 + 1];
		var a02 = a[0 * 3 + 2];
		var a10 = a[1 * 3 + 0];
		var a11 = a[1 * 3 + 1];
		var a12 = a[1 * 3 + 2];
		var a20 = a[2 * 3 + 0];
		var a21 = a[2 * 3 + 1];
		var a22 = a[2 * 3 + 2];
		var b00 = b[0 * 3 + 0];
		var b01 = b[0 * 3 + 1];
		var b02 = b[0 * 3 + 2];
		var b10 = b[1 * 3 + 0];
		var b11 = b[1 * 3 + 1];
		var b12 = b[1 * 3 + 2];
		var b20 = b[2 * 3 + 0];
		var b21 = b[2 * 3 + 1];
		var b22 = b[2 * 3 + 2];
		return [
			b00 * a00 + b01 * a10 + b02 * a20,
			b00 * a01 + b01 * a11 + b02 * a21,
			b00 * a02 + b01 * a12 + b02 * a22,
			b10 * a00 + b11 * a10 + b12 * a20,
			b10 * a01 + b11 * a11 + b12 * a21,
			b10 * a02 + b11 * a12 + b12 * a22,
			b20 * a00 + b21 * a10 + b22 * a20,
			b20 * a01 + b21 * a11 + b22 * a21,
			b20 * a02 + b21 * a12 + b22 * a22,
		];
	};

	tools.compareVectors = function (v1, v2) {
		return (v1.x == v2.x && v1.y == v2.y);
	};

	tools.compareVectorArrays = function (arr1, arr2) {
		for(let i in arr1) {
			if(!tools.compareVectors(arr1[i], arr2[i]))
				return false;
		}
		return true;
	};

	tools.compareArrays = function (arr1, arr2) {
		for(let i in arr1) {
			if(typeof arr1[i] != 'function' && arr1[i] != arr2[i])
				return false;
		}
		return true;
	};

	tools.compare2dArrays = function (arr1, arr2) {
		for(let i in arr1) {
			if(!tools.compareArrays(arr1[i], arr2[i]))
				return false;
		}
		return true;
	};

	tools.clearTextureBuffer = function () {
		tools.staticTex = {};
		tools.staticTexIds = [];
	};

	tools.staticTex = {};
	tools.staticTexSize = rjs.gl.getParameter(rjs.gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
	tools.staticTexIds = new Array(tools.staticTexSize);

	tools.staticTexUsed = {};
	
	//loading texture to WebGL TEXTURE_2D buffer
	tools.setTexture = function (t, buffer = 0) {
		var gl = rjs.gl;
		if(t != null && (t.type == 'tiled' || t.type == 'croped')) {
			t = t.tex;
		}
		if(t == null) {
			gl.activeTexture(gl[`TEXTURE${buffer}`]);
			gl.bindTexture(gl.TEXTURE_2D, tools.STANDART_TEXTURE);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
		}
		else if(!t.image.loaded) {
			gl.activeTexture(gl[`TEXTURE${buffer}`]);
			gl.bindTexture(gl.TEXTURE_2D, tools.STANDART_TEXTURE);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
			return buffer;
		}
		else if(t.src in tools.staticTex) {
			buffer = tools.staticTex[t.src].index;
			gl.activeTexture(gl[`TEXTURE${buffer}`]);
			tools.staticTexUsed[t.src] = t;
			return buffer;
		}
		else {
			let coll = 0;
			for(let i = 1; i < tools.staticTexSize-1; i ++) {
				if(typeof(tools.staticTexIds[i]) == 'undefined') {
					coll = i;
					break;
				}
			}
			if(coll != 0) {
				let id = coll;
				tools.staticTex[t.src] = tools.staticTexIds[id] = {
					name: t.src,
					index: id,
					tex: t
				};
				buffer = tools.staticTex[t.src].index;
			}
			tools.staticTexUsed[t.src] = t;
			gl.activeTexture(gl[`TEXTURE${buffer}`]);
			gl.bindTexture(gl.TEXTURE_2D, tools.STANDART_TEXTURE);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
			gl.bindTexture(gl.TEXTURE_2D, t.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t.canvas);
			if(rjs.renderer.DRAWING_MODE == 'linear') {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			}
			else if(rjs.renderer.DRAWING_MODE == 'pixel') {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			}
			else if(rjs.renderer.DRAWING_MODE == 'mipmap') {
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				gl.generateMipmap(gl.TEXTURE_2D);
			}
			return buffer;
		}
	};

	tools.drawText = function (t) {

		if(typeof t == 'undefined' || !t.render)
			return false;
		if(rjs.renderer.TEXT_RENDER_MODE == '2D' || rjs.renderer.TEXT_RENDER_MODE == '2D_VIRTUAL') {
			var ctx = rjs.ctx;

			var prop = rjs.canvas_width / rjs.client.w;
			var x = ((t.pos.x+t.offset.x*t.scale.x) * t.layer.scale.x + rjs.client.w/2 - rjs.currentCamera.pos.x * t.layer.scale.x * t.layer.parallax.x/100) * prop;
			var y = ((t.pos.y+t.offset.y*t.scale.y) * t.layer.scale.y + rjs.client.h/2 - rjs.currentCamera.pos.y * t.layer.scale.y * t.layer.parallax.y/100) * prop;
			var size = t.size * prop;
			var ox = t.origin.split('-')[0].trim();
			var oy = t.origin.split('-')[1].trim();
			var text = t.text.toString();
			var angle = t.angle * Math.PI / 180;

			var color = rgba(t.color.r, t.color.g, t.color.b, (typeof t.color.a ? t.color.a : 255));
			for(var k in t.filters) {
				color.r *= t.filters[k].r/255;
				color.g *= t.filters[k].g/255;
				color.b *= t.filters[k].b/255;
				color.a *= t.filters[k].a/255;
			}

			var lines = text.split('\n');

			for(var i in lines) {
				let modY;

				if(oy == 'top') {
					modY = i * size * t.scale.y * t.layer.scale.y;
				}
				if(oy == 'middle') {
					modY = (i - (lines.length-1)/2) * size * t.scale.y * t.layer.scale.y;
				}
				if(oy == 'bottom') {
					modY = (i - (lines.length-1)) * size * t.scale.y * t.layer.scale.y;
				}

				ctx.save();
				ctx.translate(x, y);
				ctx.scale(t.layer.scale.x, t.layer.scale.y);
				ctx.rotate(angle);
				ctx.translate(0, modY);
				ctx.scale(t.scale.x, t.scale.y);
				ctx.textAlign = ox;
				ctx.textBaseline = oy;
				ctx.fillStyle = color.toStringCSS();
				ctx.globalAlpha = t.opacity / 100;
				ctx.font = `${size}px ${t.font}`;
				ctx.fillText(lines[i], 0, 0);
				ctx.restore();
			}

		}
		else if(rjs.renderer.TEXT_RENDER_MODE == 'CSS') {
			if(t.DOM == null) {
				t.DOM = document.createElement('div');
				rjs.container.appendChild(t.DOM);
				t.DOM.style.position = 'absolute';
				t.DOM.style.userSelect = 'none';
				t.DOM.style.overflow = 'hidden';
			}
			t.DOM.style.width = 'auto';
			t.DOM.style.height = 'auto';
			t.DOM.style.transform = `rotate(${0}deg)`;
			var lines = t.text.toString().split('\n');
			var text = '';
			for(var i in lines) {
				text += lines[i] + '<br/>';
			}
			t.DOM.innerHTML = `<div>${text}</div>`;
			var div = t.DOM.getElementsByTagName('div')[0];
			div.style = t.CSS;
			var tb = t.DOM.getBoundingClientRect();
			var cvs = rjs.container.getBoundingClientRect();
			var cx = cvs.left;
			var cy = cvs.top;
			var prop = rjs.canvas_width / rjs.client.w;
			var tx = (t.pos.x * t.layer.scale.x + rjs.client.w/2 - rjs.currentCamera.pos.x * t.layer.scale.x * t.layer.parallax.x / 100) * prop;
			var ty = (t.pos.y * t.layer.scale.y + rjs.client.h/2 - rjs.currentCamera.pos.y * t.layer.scale.y * t.layer.parallax.y / 100) * prop;
			t.DOM.style.fontSize = t.size * prop + "px";
			t.DOM.style.fontFamily = t.font;
			t.DOM.style.left = (tx) - tb.width + "px";
			t.DOM.style.top = (ty) - tb.height + "px";
			var color = rgba(t.color.r, t.color.g, t.color.b, (typeof t.color.a ? t.color.a : 255));
			for(var k in t.filters) {
				color.r *= t.filters[k].r/255;
				color.g *= t.filters[k].g/255;
				color.b *= t.filters[k].b/255;
				color.a *= t.filters[k].a/255;
			}
			color.a /= 255;
			color.a *= t.opacity/100;
			t.DOM.style.color = color.toString();
			var ox = t.origin.split('-')[0].trim();
			var oy = t.origin.split('-')[1].trim();
			
			div.style.position = 'absolute';
			if(ox == 'right') {
				div.style.left = tb.width + 'px';
			}
			if(ox == 'center') {
				div.style.left = tb.width/2 + 'px';
			}
			if(ox == 'left') {
				div.style.left = 0 + 'px';
			}
			if(oy == 'bottom') {
				div.style.top = tb.height + 'px';
			}
			if(oy == 'middle') {
				div.style.top = tb.height/2 + 'px';
			}
			if(oy == 'top') {
				div.style.top = 0 + 'px';
			}
			t.DOM.style.width = tb.width * 2 + 'px';
			t.DOM.style.height = tb.height * 2 + 'px';
			t.DOM.style.transform = `scale(${t.layer.scale.x}, ${t.layer.scale.y}) rotate(${t.angle}deg) scale(${t.scale.x}, ${t.scale.y})`;
		}
	};

	tools.drawPattern = function (pattern) {
		if(rjs.currentCamera == null)
			return;

		var gl = rjs.gl;

		var vertices = pattern.type == 'sprite' ? [-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5] : tools.getVerticesArray(pattern);
		var texcoordChanged = true;
		if(pattern.type == 'sprite') {
			if(tools.posBuffer != 'sprite_position') {
				tools.bindBuffer('sprite_position', 'position');
			}
		}
		else if(pattern.type == 'polygon') {

			if(tools.posBuffer != 'position')
				tools.bindBuffer('position', 'position');
			tools.bufferData('position', vertices);
		}

		var colors = [];

		for(let k in pattern.colors) {
			let c = pattern.colors[k];
			let r = c.r/255;
			let g = c.g/255;
			let b = c.b/255;
			let a = (typeof c.a != 'undefined' ? c.a : 255)/255;
			colors[k*4] = r;
			colors[k*4+1] = g;
			colors[k*4+2] = b;
			colors[k*4+3] = a;
		}

		tools.bindBuffer('color', 'color', 4);
		tools.bufferData('color', colors);

		if(rjs.renderer.CHUNKS_MODE) {
			var textures = {};
			let chunks = pattern.chunks;
			let cam = rjs.currentCamera;
			let start = tools.getChunkPos(cam.pos);
			start.x = Math.round(start.x-rjs.renderer.CHUNKS_VIEWPORT.x/2);
			start.y = Math.round(start.y-rjs.renderer.CHUNKS_VIEWPORT.y/2);
			let end = tools.getChunkPos(cam.pos);
			end.x = Math.round(end.x+rjs.renderer.CHUNKS_VIEWPORT.x/2);
			end.y = Math.round(end.y+rjs.renderer.CHUNKS_VIEWPORT.y/2);
			for(let i = start.x; i < end.x; i ++) {
				for(let j = start.y; j < end.y; j ++) {
					if(typeof chunks[i] != 'undefined' && typeof chunks[i][j] != 'undefined') {
						let chunk = chunks[i][j];
						for(let k in chunk.textures) {
							if(!(k in textures))
								textures[k] = [];
							textures[k] = [...textures[k], ...chunk.textures[k]];
						}
					}
				}
			}
			for(let k in pattern.no_chunks) {
				if(!(k in textures))
					textures[k] = [];
				textures[k] = [...textures[k], ...pattern.no_chunks[k]];
			}
			for(let k in textures) {
				texcoordChanged = tools.drawPatternTexture(pattern, vertices, textures, k, texcoordChanged);
			}
		}
		else {
			for(let k in pattern.textures) {
				texcoordChanged = tools.drawPatternTexture(pattern, vertices, pattern.textures, k, texcoordChanged);
			}
		}

	};

	tools.drawPatternTexture = function (pattern, vertices, textures, k, texcoordChanged) {
		let tex_buffer;
		if(k == 'default' || k in rjs.textures) {
			if(count(textures[k]) > 0) {
				let texture = k != 'default' ? rjs.textures[k] : null;

				if(texcoordChanged) {
					if(pattern.type == 'sprite') {
						if(tools.texBuffer != 'sprite_texcoord') {
							tools.bindBuffer('sprite_texcoord', 'texcoord');
						}
						texcoordChanged = false;
					}
					else if(pattern.type == 'polygon') {
						if(tools.texBuffer != 'texcoord')
							tools.bindBuffer('texcoord', 'texcoord');
						var texcoord = tools.getTexcoordArray(pattern, vertices);
						tools.bufferData('texcoord', texcoord);
						texcoordChanged = false;
					}
				}
				
				if(texture != null && texture.type == 'animation') {
					texture = texture.frames[texture.currentIndex];

				}
				if(texture != null && (texture.type == 'tiled' || texture.type == 'croped')) {
					if(tools.texBuffer != 'texcoord')
						tools.bindBuffer('texcoord', 'texcoord');
					
					var texcoord = tools.getTexcoordArray(pattern, vertices, texture);

					tools.bufferData('texcoord', texcoord);
					
					tex_buffer = tools.setTexture(texture);
					texcoordChanged = true;
				}
				else
					tex_buffer = tools.setTexture(texture);
			}
			else {
				delete pattern.textures[k];
			}
		}
		for(let l in textures[k]) {
			let o = textures[k][l];
			if(typeof o != 'undefined') {
				if(o.type == 'sprite' || o.type == 'polygon')
					tools.drawPatternObject(o, vertices, tex_buffer);
				else if(o.type == 'text')
					if(rjs.renderer.TEXT_RENDER_MODE == '2D_VIRTUAL')
						tools.textBuffer[o.id] = o;
					else
						tools.drawText(o);
			}
			
		}
		return texcoordChanged;
	};

	tools.drawPatternObject = function (o, vertices, tex_buffer) {

		if(typeof o == 'undefined' || o == null || !o.render)
			return;
		
		var gl = rjs.gl;
		
		// var o_bb = rjs.getBoundingBox(o);
		// var c_p = rjs.currentCamera.pos;
		// var c_pos = vec2(c_p.x * o.layer.parallax.x / 100, c_p.y * o.layer.parallax.y / 100);
		// var c_bb = {
		// 	x1: c_pos.x - rjs.client.w / 1.8 / o.layer.scale.x,
		// 	y1: c_pos.y - rjs.client.h / 1.8 / o.layer.scale.y,
		// 	x2: c_pos.x + rjs.client.w / 1.8 / o.layer.scale.x,
		// 	y2: c_pos.y + rjs.client.h / 1.8 / o.layer.scale.y
		// };
		
		// if(!rjs.AABB(c_bb, o_bb))
		// 	return;

		var sx = o.type == 'sprite' ? o.size.x : 1;
		var sy = o.type == 'sprite' ? o.size.y : 1;
		
		var lm = tools.scalingMatrix(o.layer.scale.x, o.layer.scale.y);
		var pm = tools.projectionMatrix(rjs.client.w, rjs.client.h);
		var cm = tools.translationMatrix(o.pos.x-rjs.currentCamera.pos.x * o.layer.parallax.x / 100, o.pos.y-rjs.currentCamera.pos.y * o.layer.parallax.y / 100);
		var rm = tools.rotationMatrix(o.angle);
		var sm = tools.scalingMatrix(o.scale.x*sx, o.scale.y*sy);
		var om = tools.translationMatrix(-o.origin.x/sx, -o.origin.y/sy);
		
		var matrix = tools.multiplyMatrix(lm, pm);
		matrix = tools.multiplyMatrix(matrix, cm);
		matrix = tools.multiplyMatrix(matrix, rm);
		matrix = tools.multiplyMatrix(matrix, sm);
		matrix = tools.multiplyMatrix(matrix, om);

		
		gl.uniformMatrix3fv(tools.uniforms.matrix, false, matrix);
		gl.uniform1i(tools.uniforms.texture, tex_buffer);
		gl.uniform2f(tools.uniforms.opacity, o.opacity/100, 0);
		var color = rgba(o.color.r, o.color.g, o.color.b, (typeof o.color.a != 'undefined' ? o.color.a : 255));
		for(var k in o.filters) {
			color.r *= o.filters[k].r/255;
			color.g *= o.filters[k].g/255;
			color.b *= o.filters[k].b/255;
			color.a *= (typeof o.filters[k].a != 'undefined' ? o.filters[k].a : 255)/255;
		}
		gl.uniform4f(tools.uniforms.filter, color.r/255, color.g/255, color.b/255, color.a/255);
		
		gl.drawArrays(gl.TRIANGLES, 0, vertices.length/2);

		if(rjs.renderer.TEXT_RENDER_MODE == '2D' && o.textOverlap) {

			tools.clearTextObject(o, vertices, sx, sy);
			
		}

	}

	tools.clearTextObject = function (o, vertices, sx, sy) {
		var ctx = rjs.ctx;

		var prop = rjs.canvas_width/rjs.client.w;
		ctx.save();
		
		ctx.scale(o.layer.scale.x*prop, o.layer.scale.y*prop);
		ctx.translate(rjs.client.w/2, rjs.client.h/2);
		ctx.translate(-rjs.currentCamera.pos.x * o.layer.parallax.x / 100, -rjs.currentCamera.pos.y * o.layer.parallax.y / 100);
		ctx.translate(o.pos.x, o.pos.y);
		ctx.scale(o.scale.x*sx, o.scale.y*sy);
		ctx.rotate(o.angle * Math.PI / 180);
		ctx.translate(-o.origin.x, -o.origin.y);
		ctx.beginPath();
		ctx.moveTo(vertices[0], vertices[1]);
		for(var i = 2; i < vertices.length; i += 2) {
			var x = vertices[i];
			var y = vertices[i+1];
			ctx.lineTo(x, y);
		}
		ctx.closePath();
		ctx.clip();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, rjs.canvas_width, rjs.canvas_height);
		ctx.restore();
	};

	tools.drawObject = function (o) {

		if(typeof o == 'undefined' || o == null || !o.render)
			return;

		var gl = rjs.gl;

		var o_bb = rjs.getBoundingBox(o);
		var c_p = rjs.currentCamera.pos;
		var c_pos = vec2(c_p.x * o.layer.parallax.x / 100, c_p.y * o.layer.parallax.y / 100);
		var c_bb = {
			x1: c_pos.x - rjs.client.w / 1.8 / o.layer.scale.x,
			y1: c_pos.y - rjs.client.h / 1.8 / o.layer.scale.y,
			x2: c_pos.x + rjs.client.w / 1.8 / o.layer.scale.x,
			y2: c_pos.y + rjs.client.h / 1.8 / o.layer.scale.y
		};
		
		if(!rjs.AABB(c_bb, o_bb))
			return;
		
		var vertices = o.type == 'sprite' ? [-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5] : tools.getVerticesArray(o);
		

		if(o.type == 'sprite') {
			if(tools.posBuffer != 'sprite_position') {
				tools.bindBuffer('sprite_position', 'position');
			}
			if(o.texture != null && o.texture.type == 'tiled') {
				if(tools.texBuffer != 'texcoord') {
					tools.bindBuffer('texcoord', 'texcoord');
				}
				var texcoord = tools.getTexcoordArray(o, vertices, o.texture);
				tools.bufferData('texcoord', texcoord);
			}
			else {
				tools.bindBuffer('sprite_texcoord', 'texcoord');
			}
		}
		else if(o.type == 'polygon') {

			if(tools.posBuffer != 'position')
				tools.bindBuffer('position', 'position');
			if(tools.texBuffer != 'texcoord')
				tools.bindBuffer('texcoord', 'texcoord');
			
			tools.bufferData('position', vertices);

			if(o.texture != null && o.texture.type == 'tiled')
				var texcoord = tools.getTexcoordArray(o, vertices, o.texture);
			else
				var texcoord = tools.getTexcoordArray(o, vertices);

			tools.bufferData('texcoord', texcoord);

		}

		var sx = o.type == 'sprite' ? o.size.x : 1;
		var sy = o.type == 'sprite' ? o.size.y : 1;
		
		var lm = tools.scalingMatrix(o.layer.scale.x, o.layer.scale.y);
		var pm = tools.projectionMatrix(rjs.client.w, rjs.client.h);
		var cm = tools.translationMatrix(-rjs.currentCamera.pos.x * o.layer.parallax.x / 100, -rjs.currentCamera.pos.y * o.layer.parallax.y / 100);
		var tm = tools.translationMatrix(o.pos.x, o.pos.y);
		var rm = tools.rotationMatrix(o.angle);
		var sm = tools.scalingMatrix(o.scale.x*sx, o.scale.y*sy);
		var om = tools.translationMatrix(-o.origin.x/sx, -o.origin.y/sy);
		
		var matrix = tools.multiplyMatrix(lm, pm);
		matrix = tools.multiplyMatrix(matrix, cm);
		matrix = tools.multiplyMatrix(matrix, tm);
		matrix = tools.multiplyMatrix(matrix, rm);
		matrix = tools.multiplyMatrix(matrix, sm);
		matrix = tools.multiplyMatrix(matrix, om);

		var buffer;
		
		if(o.texture != null && o.texture.type == 'animation')
			buffer = tools.setTexture(o.texture.frames[o.texture.currentIndex]);
		else
			buffer = tools.setTexture(o.texture);
		
		gl.uniformMatrix3fv(tools.uniforms.matrix, false, matrix);
		gl.uniform1i(tools.uniforms.texture, buffer);
		gl.uniform2f(tools.uniforms.opacity, o.opacity/100, 0);
		var color = rgba(o.color.r, o.color.g, o.color.b, (typeof o.color.a != 'undefined' ? o.color.a : 255));
		for(var k in o.filters) {
			color.r *= o.filters[k].r/255;
			color.g *= o.filters[k].g/255;
			color.b *= o.filters[k].b/255;
			color.a *= (typeof o.filters[k].a != 'undefined' ? o.filters[k].a : 255)/255;
		}
		gl.uniform4f(tools.uniforms.filter, color.r/255, color.g/255, color.b/255, color.a/255);
		
		gl.drawArrays(gl.TRIANGLES, 0, vertices.length/2);

		if(rjs.renderer.TEXT_RENDER_MODE == '2D' && o.textOverlap) {

			var ctx = rjs.ctx;

			var prop = rjs.canvas_width/rjs.client.w;
			ctx.save();
			
			ctx.scale(o.layer.scale.x*prop, o.layer.scale.y*prop);
			ctx.translate(rjs.client.w/2, rjs.client.h/2);
			ctx.translate(-rjs.currentCamera.pos.x * o.layer.parallax.x / 100, -rjs.currentCamera.pos.y * o.layer.parallax.y / 100);
			ctx.translate(o.pos.x, o.pos.y);
			ctx.scale(o.scale.x, o.scale.y);
			ctx.rotate(o.angle * Math.PI / 180);
			ctx.translate(-o.origin.x, -o.origin.y);
			ctx.beginPath();
			ctx.moveTo(vertices[0], vertices[1]);
			for(var i = 2; i < vertices.length; i += 2) {
				var x = vertices[i];
				var y = vertices[i+1];
				ctx.lineTo(x, y);
			}
			ctx.closePath();
			ctx.clip();
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, rjs.canvas_width, rjs.canvas_height);
			ctx.restore();

		}

	};

	tools.getChunkPos = function (pos) {
		var x = Math.floor(pos.x/rjs.renderer.CHUNKS_SIZE.x);
		var y = Math.floor(pos.y/rjs.renderer.CHUNKS_SIZE.y);
		return vec2(x, y);
	};

	tools.createChunk = function (o) {
		var chunk = {};
		chunk.x = Math.floor(o.pos.x/rjs.renderer.CHUNKS_SIZE.x);
		chunk.y = Math.floor(o.pos.y/rjs.renderer.CHUNKS_SIZE.y);
		chunk.textures = {
			default: []
		};
		chunk.add = function (o) {
			var tex = o.texture != null ? o.texture.src : 'default';
			if(typeof chunk.textures[tex] == 'undefined')
				chunk.textures[tex] = [];
			var id = chunk.textures[tex].length;
			chunk.textures[tex][id] = o;
			o.patternLoc.chunkX = chunk.x;
			o.patternLoc.chunkY = chunk.y;
			o.patternLoc.chunkObjectIndex = id;
		}
		return chunk;
	};

	tools.createPattern = function (o, id) {
		var pattern = {};
		pattern.textures = {
			default: []
		};
		pattern.id = id;
		pattern.type = o.type;
		pattern.size = o.size || null;
		pattern.vertices = o.type == 'polygon' ? o.vertices : [];
		pattern.colors = o.colors;
		pattern.layerID = o.layer.id;
		pattern.chunks = [];
		pattern.no_chunks = [];
		pattern.belong = function (o) {
			if(pattern.type == o.type) {
				if(pattern.type == 'sprite' && (o.texture == null || o.texture.type != 'tiled' || tools.compareVectors(o.size, pattern.size)) && tools.compare2dArrays(o.colors, pattern.colors))
					return true;
				if(pattern.type == 'polygon' && tools.compareVectorArrays(o.vertices, pattern.vertices) && tools.compare2dArrays(o.colors, pattern.colors))
					return true;
				if(pattern.type == 'text')
					return true;
			}
			return false;
		};
		pattern.add = function (o) {
			var tex = o.texture != null ? o.texture.src : 'default';
			if(typeof pattern.textures[tex] == 'undefined')
				pattern.textures[tex] = [];
			var id = pattern.textures[tex].length;
			pattern.textures[tex][id] = o;
			o.patternLoc.textureID = tex;
			o.patternLoc.objectIndex = id;
			o.patternLoc.patternID = pattern.id;
			o.patternLoc.layerID = pattern.layerID;
			if(rjs.renderer.CHUNKS_MODE) {
				if(o.enable_chunks) {
					var c = tools.getChunkPos(o.pos);
					if(typeof pattern.chunks[c.x] == 'undefined')
						pattern.chunks[c.x] = [];
					if(typeof pattern.chunks[c.x][c.y] == 'undefined') {
						pattern.chunks[c.x][c.y] = tools.createChunk(o);
					}
					var chunk = pattern.chunks[c.x][c.y];
					chunk.add(o);
				}
				else {
					var tex = o.texture != null ? o.texture.src : 'default';
					if(typeof pattern.no_chunks[tex] == 'undefined')
						pattern.no_chunks[tex] = [];
					var id = pattern.no_chunks[tex].length;
					pattern.no_chunks[tex][id] = o;
					o.patternLoc.chunkObjectIndex = id;
				}
			}
		};
		return pattern;
	};

	tools.drawTextLayer = function () {

		let gl = rjs.gl;

		let data = rjs.ctx2D_Canvas;

		var w = rjs.client.w/2;
		var h = rjs.client.h/2;

		var k1 = w*2;
		var k2 = h*2;

		var b1 = w/k1;
		var b2 = h/k2;
		
		var vertices = [
			-w, -h,
			w, -h,
			w, h,
			w, h,
			-w, h,
			-w, -h
		];

		var texcoord = [
			-w/k1-b1, -h/k2-b2,
			w/k1-b1, -h/k2-b2,
			w/k1-b1, h/k2-b2,
			w/k1-b1, h/k2-b2,
			-w/k1-b1, h/k2-b2,
			-w/k1-b1, -h/k2-b2
		];
		
		gl.bindBuffer(gl.ARRAY_BUFFER, tools.buffers.position);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, tools.buffers.texcoord);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoord), gl.STATIC_DRAW);
		
		var matrix = tools.projectionMatrix(rjs.client.w, rjs.client.h);
		
		gl.bindTexture(gl.TEXTURE_2D, tools.STANDART_TEXTURE);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		
		gl.uniformMatrix3fv(tools.uniforms.matrix, false, matrix);
		gl.uniform1i(tools.uniforms.texture, 0);
		gl.uniform2f(tools.uniforms.opacity, 1, 0);

		gl.uniform4f(tools.uniforms.filter, 1, 1, 1, 1);
		
		gl.drawArrays(gl.TRIANGLES, 0, vertices.length/2);
		
	};

	

	tools.posBuffer = null;
	tools.texBuffer = null;

	tools.texToBuffer = function (tex) {
		for(let i = 0; i < tools.texBufferSize; i ++) {
			if(tools.texIds[i] == null) {
				tools.texNames[tex.id] = tools.texIds[i] = {
					name: tex.id,
					index: i,
					tex: tex
				};
			}
		}
	};

	tools.bufferData = function (buffer, data) {
		var gl = rjs.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, tools.buffers[buffer]);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	}

	tools.bindBuffer = function (buffer, attrib, p = 2) {
		var gl = rjs.gl;
		if(attrib == 'position')
			tools.posBuffer = buffer;
		else if(attrib == 'texcoord')
			tools.texBuffer = buffer;
		gl.enableVertexAttribArray(tools.attribs[attrib]);
		gl.bindBuffer(gl.ARRAY_BUFFER, tools.buffers[buffer]);
		gl.vertexAttribPointer(tools.attribs[attrib], p, gl.FLOAT, false, 0, 0);
	};
	
	//buffers and WebGL shader variables locations

	rjs.renderTools = tools;


	tools.buffers = {};
	tools.programs = {};
	tools.uniforms = {};
	tools.attribs = {};

	tools.textBuffer = {};

	for(var i in tools) {
		eval(`var ${i} = tools['${i}']`);
	}

	tools.tilemaps = [];
	tools.tilemapCount = 0;

	tools.Tilemap = function (images) {
		this.images = images;
		this.coords = {};
		this.sizes = {};
		this.counter = 0;
		this.canvas = document.createElement('canvas');
		this.canvas.width = 16384;
		this.canvas.height = 16384;
		this.canvas.style.background = 'white';
		this.context = this.canvas.getContext('2d');
		//document.body.appendChild(this.canvas);
		this.id = tools.tilemapCount;
		tools.tilemaps[this.id] = this;
		var dir = -1;
		for(let i in this.images) {
			let image = this.images[i];
			let size = vec2(`${image.size}*${image.scale}`);
			let coord = tools.getImageCoords(image, this, dir);
			this.coords[this.counter] = coord;
			this.sizes[this.counter] = size;
			this.context.drawImage(image.image, coord.x, coord.y, size.x, size.y);
			this.counter ++;
			image.tilemapPosA = copy(coord);
			image.tilemapPosB = vec2(`${coord}+${size}`);
			image.pos = coord;
			image.size = size;
			image.type = 'croped';
		}
		this.canvas.loaded = true;
		this.canvas.src = 'TILEMAP_'+tools.tilemapCount;
		var dom = new rjs.TextureDOM(this.canvas, vec2(1, 1), vec2(this.canvas.width, this.canvas.height));
		for(let i in this.images) {
			this.images[i].tex = dom;
		}
		tools.tilemapCount ++;
	};

	tools.getImageCoords = function (image, map, dir) {

		var coords = copy(map.coords);
		var sizes = copy(map.sizes);
		var size = vec2(`${image.size}*${image.scale}`);

		if(dir < 0) {

			let pos = vec2(map.canvas.width, 0);
			let cnt = 0;

			let coordsList = {};
			let sizesList = {};
			let dxList = {};

			while(true) {

				let done = false;
				let D = map.canvas.width;				

				while(!done) {

					let min_dx = map.canvas.width;
					let min_dx_i = null;

					for(let i in coords) {
						let dx = pos.x-(coords[i].x+sizes[i].x);

						if(dx <= min_dx) {
							min_dx = dx;
							min_dx_i = i;
						}
					}

					if(typeof coords[min_dx_i] != 'undefined') {

						coordsList[cnt] = coords[min_dx_i];
						sizesList[cnt] = sizes[min_dx_i];
						dxList[cnt] = min_dx;
						delete coords[min_dx_i];
						cnt ++;

					}
					else
						done = true;

				}

				for(var i in coordsList) {

					let coord = coordsList[i];
					let sz = sizesList[i];
					let dx = dxList[i];

					let yColl = pos.y < coord.y + sz.y && pos.y + size.y > coord.y;

					if(yColl) {
						D = dx;
						break;
					}
				
				}

				if(D < size.x) {
					pos.y += sizesList[i].y;
				}
				else {
					pos.x -= D;
					return pos;
				}
			}

		}

	};
	
	var RENDERER =  {
		
		init: function () {

			var gl = rjs.gl;

			var vertexShaderCode = require(rjs.engineSource+'Shaders/vertex-shader.glsl', 'text');
			var fragmentShaderCode = require(rjs.engineSource+'Shaders/fragment-shader.glsl', 'text');

			var vertexShader = tools.createShader(gl, gl.VERTEX_SHADER, vertexShaderCode);
			var fragmentShader = tools.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderCode);

			tools.programs.def = tools.createProgram(gl, vertexShader, fragmentShader);

			tools.attribs.position = gl.getAttribLocation(tools.programs.def, 'a_position');
			tools.attribs.texcoord = gl.getAttribLocation(tools.programs.def, 'a_texcoord');
			tools.attribs.color = gl.getAttribLocation(tools.programs.def, 'a_color');
			
			tools.uniforms.matrix = gl.getUniformLocation(tools.programs.def, 'u_matrix');
			tools.uniforms.texture = gl.getUniformLocation(tools.programs.def, 'u_texture');
			tools.uniforms.opacity = gl.getUniformLocation(tools.programs.def, 'u_opacity');
			tools.uniforms.filter = gl.getUniformLocation(tools.programs.def, 'u_filter');

			tools.buffers.position = gl.createBuffer();
			tools.buffers.sprite_position = gl.createBuffer();
			tools.buffers.texcoord = gl.createBuffer();
			tools.buffers.sprite_texcoord = gl.createBuffer();
			tools.buffers.color = gl.createBuffer();

			//gl.enableVertexAttribArray(tools.attribs.position);

			gl.bindBuffer(gl.ARRAY_BUFFER, tools.buffers.sprite_position);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5]), gl.STATIC_DRAW);

			gl.bindBuffer(gl.ARRAY_BUFFER, tools.buffers.sprite_texcoord);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1]), gl.STATIC_DRAW);
			
			tools.STANDART_TEXTURE = gl.createTexture();

		},

		initLayer: function (layer) {

			layer.patterns = [];

		},
		
		getPatterns: function (layer) {
			


		},


		createTexture: function () {
			return rjs.gl.createTexture();
		},
		//default
		//sprite

		PATTERN_MODE: false,
		CHUNKS_MODE: false,

		DEBUG_MODE: false,

		AUTO_CHUNKS_VIEWPORT_UPDATE: false,
		CHUNKS_VIEWPORT_MODIFER: vec2(3, 2),
		
		CHUNKS_SIZE: vec2(256, 256),
		CHUNKS_VIEWPORT: vec2(1, 1),

		TEXT_RENDER_MODE: '2D',
		//2D
		//2D_VIRTUAL
		//CSS

		DRAWING_MODE: 'mipmap',
		//linear
		//pixel
		//mipmap

		ACTIVE: true,
		//true
		//false

		updateTilemaps: function () {

			new tools.Tilemap(rjs.images);

		},
		
		updatePatterns: function (scene = rjs.currentScene) {

			if(!rjs.renderer.PATTERN_MODE) {
				warning('RectJS.renderer.updatePatterns(): PATTERN_MODE is off');
				return;
			}

			var layers = scene.layers;

			for(let i in layers) {
				let layer = layers[i];
				layer.patterns = [];
				let patterns = layer.patterns;
				for(let j in layer.objects) {
					let o = layer.objects[j];
					o.patternLoc = {
						layerID: null,
						patternID: null,
						textureID: null,
						objectIndex: null,
						chunkX: null,
						chunkY: null,
						chunkObjectIndex: null
					};
					let inPattern = false;
					for(let k in patterns) {
						let pattern = patterns[k];
						if(!inPattern && pattern.belong(o)) {
							pattern.add(o);
							inPattern = true;
						}
					}
					if(!inPattern) {
						let id = patterns.length;
						patterns[id] = tools.createPattern(o, id);
						let pattern = patterns[id];
						pattern.add(o);
						inPattern = true;
					}
				}
			}
		},

		updateObject: function (o) {

			if(!rjs.renderer.PATTERN_MODE)
				return;

			if(rjs.renderer.deleteObject(o) == "ERROR")
				return;

			var layer = o.layer;
			var patterns = layer.patterns;

			var inPattern = false;

			o.patternLoc = {
				layerID: null,
				patternID: null,
				textureID: null,
				objectIndex: null,
				chunkX: null,
				chunkY: null,
				chunkObjectIndex: null
			};

			for(let i in patterns) {
				let pattern = patterns[i];
				if(pattern.belong(o) && !inPattern) {
					pattern.add(o);
					inPattern = true;
				}
			}
			if(!inPattern) {
				let id = patterns.length;
				patterns[id] = tools.createPattern(o, id);
				let pattern = patterns[id];
				pattern.add(o);
				inPattern = true;
			}

		},

		deleteObject: function (o) {

			if(!rjs.renderer.PATTERN_MODE || typeof o.patternLoc == 'undefined')
				return;
			
			var patternID = o.patternLoc.patternID;
			var textureID = o.patternLoc.textureID;
			var objectIndex = o.patternLoc.objectIndex;
			var layerID = o.patternLoc.layerID;
			var chunkX = o.patternLoc.chunkX;
			var chunkY = o.patternLoc.chunkY;
			var chunkObjectIndex = o.patternLoc.chunkObjectIndex;

			try {

			delete o.scene.layers[layerID].patterns[patternID].textures[textureID][objectIndex];

			if(rjs.renderer.CHUNKS_MODE) {
				if(o.enable_chunks) {
					delete o.scene.layers[layerID].patterns[patternID].chunks[chunkX][chunkY].textures[textureID][chunkObjectIndex];
				}
				else {
					delete o.scene.layers[layerID].patterns[patternID].no_chunks[textureID][chunkObjectIndex];
				}
			}

			} catch (err) {
				log("Error in RectJS.Object.update() !!! Fixed automatically");
				for(let i in rjs.currentScene.layers) {
					let layer = rjs.currentScene.layers[i];
					for(let j in layer.patterns) {
						let pattern = layer.patterns[j];
						for(let k in pattern.textures) {
							let texture = pattern.textures[k]
							for(let l in texture) {
								let obj = texture[l];
								if(obj.id == o.id) {
									o.patternLoc.layerID = i;
									o.patternLoc.patternID = j;
									o.patternLoc.textureID = k;
									o.patternLoc.objectIndex = l;
									rjs.renderer.deleteObject(o);
								}
							}
						}
					}
				}
			}

		},
		
		render: function () {

			if(!rjs.renderer.ACTIVE)
				return false;
			
			var scene = rjs.currentScene;

			if(scene == null)
				return;

			var layers = scene.layers;

			if(rjs.renderer.TEXT_RENDER_MODE == '2D_VIRTUAL')
				rjs.ctx2D_Canvas.style.display = 'none';
			else
				rjs.ctx2D_Canvas.style.display = 'inline';

			let gl = rjs.gl;

			gl.viewport(0, 0, rjs.canvas_width, rjs.canvas_height);
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			
			gl.enable(gl.BLEND);
			gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
				
			gl.useProgram(tools.programs.def);
			
			
			gl.enableVertexAttribArray(tools.attribs.position);
			gl.bindBuffer(gl.ARRAY_BUFFER, tools.buffers.position);
			
			gl.vertexAttribPointer(tools.attribs.position, 2, gl.FLOAT, false, 0, 0);
			
			
			gl.enableVertexAttribArray(tools.attribs.texcoord);
			gl.bindBuffer(gl.ARRAY_BUFFER, tools.buffers.texcoord);
			
			gl.vertexAttribPointer(tools.attribs.texcoord, 2, gl.FLOAT, false, 0, 0);
				

			if(rjs.renderer.PATTERN_MODE && rjs.renderer.AUTO_CHUNKS_VIEWPORT_UPDATE) {
				let minScaleX = 1;
				let minScaleY = 1;
				let cnt = 0;
				for(let i in layers) {
					let layer = layers[i];
					if(cnt == 0) {
						minScaleX = layer.scale.x;
						minScaleY = layer.scale.y;
					}
					if(layer.scale.x < minScaleX)
						minScaleX = layer.scale.x;
					if(layer.scale.y < minScaleY)
						minScaleY = layer.scale.y;
					cnt ++;
				}
				let vx = Math.floor((rjs.client.w+rjs.renderer.CHUNKS_SIZE.x)/rjs.renderer.CHUNKS_SIZE.x/minScaleX)+rjs.renderer.CHUNKS_VIEWPORT_MODIFER.x;
				let vy = Math.floor((rjs.client.h+rjs.renderer.CHUNKS_SIZE.y)/rjs.renderer.CHUNKS_SIZE.y/minScaleY)+rjs.renderer.CHUNKS_VIEWPORT_MODIFER.y;
				rjs.renderer.CHUNKS_VIEWPORT = vec2(vx, vy);
			}

			for(let i in layers) {
				let layer = layers[i];
				tools.textBuffer = {};
				if(!rjs.renderer.PATTERN_MODE) {
					for(let j in layer.objects) {
						let o = layer.objects[j];
						if(o.type == 'sprite' || o.type == 'polygon')
							tools.drawObject(o);
						else if(o.type == 'text') {
							if(rjs.renderer.TEXT_RENDER_MODE == '2D_VIRTUAL')
								tools.textBuffer[o.id] = o;
							else
								tools.drawText(o);
						}
					}
				}
				else {
					for(let j in layer.patterns) {
						let pattern = layer.patterns[j];
						tools.drawPattern(pattern);
					}
				}
				if(rjs.renderer.TEXT_RENDER_MODE == '2D_VIRTUAL' && count(tools.textBuffer) > 0) {
					let ctx = rjs.ctx;
					ctx.setTransform(1, 0, 0, 1, 0, 0);
					ctx.clearRect(0, 0, rjs.canvas_width, rjs.canvas_height);
					for(let j in tools.textBuffer) {
						let o = tools.textBuffer[j];
						tools.drawText(o);
					}
					tools.drawTextLayer();
				}
			}

			for(let i in tools.staticTex) {
				if(!(i in tools.staticTexUsed)) {
					delete tools.staticTex[i];
				}
			}

			tools.staticTexUsed = {};

			tools.posBuffer = null;
			tools.texBuffer = null;
			if(rjs.renderer.DEBUG_MODE)
				debugger;
		}
	}

	return RENDERER;
	
}
