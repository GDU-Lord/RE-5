(rjs) => {

	var tools = {};
 	
 	// создание шейдера
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
	
	// создание шейдерной программы
	tools.createProgram = function (gl, vs, fs) {
		
		var program = gl.createProgram();
		gl.attachShader(program, vs);
		gl.attachShader(program, fs);
		// установка индексов атрибутов
		gl.bindAttribLocation(program, 0, "a_position");
		gl.bindAttribLocation(program, 1, "a_texcoord");
		gl.bindAttribLocation(program, 2, "a_filter");
		gl.bindAttribLocation(program, 3, "a_opacity");
		gl.bindAttribLocation(program, 4, "a_matrix");
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
 	
 	// получение угла между двумя векторами
	tools.getAtan = function (a, b, c) {
		var A = vec2(a.x-c.x, a.y-c.y);
		var B = vec2(b.x-c.x, b.y-c.y);
		var a1 = Math.atan2(A.x, A.y) * 180 / Math.PI;
		var a2 = Math.atan2(B.x, B.y) * 180 / Math.PI;
		return a2 - a1;
	}

	// получение индекса последнего элеммента массива
	tools.getN = function (vertList, n) {
		if(n >= vertList.length)
			n -= vertList.length;
		return n;
	}

	// получение вершины
	tools.getVert = function (vertList, n) {
		n = tools.getN(vertList, n);
		if(typeof vertList[n] != 'undefined')
			return vertList[n];
		else
			return tools.getVert(vertList, n+1);
	}

	// получение идентификатора вершины
	tools.getVertID = function (vertList, n) {
		n = tools.getN(vertList, n);
		if(typeof vertList[n] != 'undefined')
			return n;
		else
			return tools.getVertID(vertList, n+1);
	}

	// шаг разбиения фигуры на триугольники
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
	
	// разбиение фигуры на триугольники
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

	// получение массива вершин
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
	
	// получение координат текстуры
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
	
	// получение bounding box'а
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
	
	// умножение матриц
	tools.multiply = function (a, b, dst) {
		dst = dst || new Float32Array(16);
		var b00 = b[0 * 4 + 0];
		var b01 = b[0 * 4 + 1];
		var b02 = b[0 * 4 + 2];
		var b03 = b[0 * 4 + 3];
		var b10 = b[1 * 4 + 0];
		var b11 = b[1 * 4 + 1];
		var b12 = b[1 * 4 + 2];
		var b13 = b[1 * 4 + 3];
		var b20 = b[2 * 4 + 0];
		var b21 = b[2 * 4 + 1];
		var b22 = b[2 * 4 + 2];
		var b23 = b[2 * 4 + 3];
		var b30 = b[3 * 4 + 0];
		var b31 = b[3 * 4 + 1];
		var b32 = b[3 * 4 + 2];
		var b33 = b[3 * 4 + 3];
		var a00 = a[0 * 4 + 0];
		var a01 = a[0 * 4 + 1];
		var a02 = a[0 * 4 + 2];
		var a03 = a[0 * 4 + 3];
		var a10 = a[1 * 4 + 0];
		var a11 = a[1 * 4 + 1];
		var a12 = a[1 * 4 + 2];
		var a13 = a[1 * 4 + 3];
		var a20 = a[2 * 4 + 0];
		var a21 = a[2 * 4 + 1];
		var a22 = a[2 * 4 + 2];
		var a23 = a[2 * 4 + 3];
		var a30 = a[3 * 4 + 0];
		var a31 = a[3 * 4 + 1];
		var a32 = a[3 * 4 + 2];
		var a33 = a[3 * 4 + 3];
		dst[ 0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
		dst[ 1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
		dst[ 2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
		dst[ 3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
		dst[ 4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
		dst[ 5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
		dst[ 6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
		dst[ 7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
		dst[ 8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
		dst[ 9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
		dst[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
		dst[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
		dst[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
		dst[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
		dst[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
		dst[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
		return dst;
	};

	// создание матрици переноса
	tools.translation = function(tx, ty, tz, dst) {
		dst = dst || new Float32Array(16);

		dst[ 0] = 1;
		dst[ 1] = 0;
		dst[ 2] = 0;
		dst[ 3] = 0;
		dst[ 4] = 0;
		dst[ 5] = 1;
		dst[ 6] = 0;
		dst[ 7] = 0;
		dst[ 8] = 0;
		dst[ 9] = 0;
		dst[10] = 1;
		dst[11] = 0;
		dst[12] = tx;
		dst[13] = ty;
		dst[14] = tz;
		dst[15] = 1;

		return dst;
	};

	// перенос матрици
	tools.translate = function(m, tx, ty, tz, dst) {
		dst = dst || new Float32Array(16);

		var m00 = m[0];
		var m01 = m[1];
		var m02 = m[2];
		var m03 = m[3];
		var m10 = m[1 * 4 + 0];
		var m11 = m[1 * 4 + 1];
		var m12 = m[1 * 4 + 2];
		var m13 = m[1 * 4 + 3];
		var m20 = m[2 * 4 + 0];
		var m21 = m[2 * 4 + 1];
		var m22 = m[2 * 4 + 2];
		var m23 = m[2 * 4 + 3];
		var m30 = m[3 * 4 + 0];
		var m31 = m[3 * 4 + 1];
		var m32 = m[3 * 4 + 2];
		var m33 = m[3 * 4 + 3];

		if (m !== dst) {
			dst[ 0] = m00;
			dst[ 1] = m01;
			dst[ 2] = m02;
			dst[ 3] = m03;
			dst[ 4] = m10;
			dst[ 5] = m11;
			dst[ 6] = m12;
			dst[ 7] = m13;
			dst[ 8] = m20;
			dst[ 9] = m21;
			dst[10] = m22;
			dst[11] = m23;
		}

		dst[12] = m00 * tx + m10 * ty + m20 * tz + m30;
		dst[13] = m01 * tx + m11 * ty + m21 * tz + m31;
		dst[14] = m02 * tx + m12 * ty + m22 * tz + m32;
		dst[15] = m03 * tx + m13 * ty + m23 * tz + m33;

		return dst;
	};

	// создание матрици поворота
	tools.zRotation = function(angleInRadians, dst) {
		dst = dst || new Float32Array(16);
		var c = Math.cos(angleInRadians);
		var s = Math.sin(angleInRadians);

		dst[ 0] = c;
		dst[ 1] = s;
		dst[ 2] = 0;
		dst[ 3] = 0;
		dst[ 4] = -s;
		dst[ 5] = c;
		dst[ 6] = 0;
		dst[ 7] = 0;
		dst[ 8] = 0;
		dst[ 9] = 0;
		dst[10] = 1;
		dst[11] = 0;
		dst[12] = 0;
		dst[13] = 0;
		dst[14] = 0;
		dst[15] = 1;

		return dst;
	};

	// поворот матрици
	tools.zRotate = function(m, angleInRadians, dst) {
		dst = dst || new Float32Array(16);

		var m00 = m[0 * 4 + 0];
		var m01 = m[0 * 4 + 1];
		var m02 = m[0 * 4 + 2];
		var m03 = m[0 * 4 + 3];
		var m10 = m[1 * 4 + 0];
		var m11 = m[1 * 4 + 1];
		var m12 = m[1 * 4 + 2];
		var m13 = m[1 * 4 + 3];
		var c = Math.cos(angleInRadians);
		var s = Math.sin(angleInRadians);

		dst[ 0] = c * m00 + s * m10;
		dst[ 1] = c * m01 + s * m11;
		dst[ 2] = c * m02 + s * m12;
		dst[ 3] = c * m03 + s * m13;
		dst[ 4] = c * m10 - s * m00;
		dst[ 5] = c * m11 - s * m01;
		dst[ 6] = c * m12 - s * m02;
		dst[ 7] = c * m13 - s * m03;

		if (m !== dst) {
			dst[ 8] = m[ 8];
			dst[ 9] = m[ 9];
			dst[10] = m[10];
			dst[11] = m[11];
			dst[12] = m[12];
			dst[13] = m[13];
			dst[14] = m[14];
			dst[15] = m[15];
		}

		return dst;
	}

	// создание матрици изменения размера
	tools.scaling = function(sx, sy, sz, dst) {
		dst = dst || new Float32Array(16);

		dst[ 0] = sx;
		dst[ 1] = 0;
		dst[ 2] = 0;
		dst[ 3] = 0;
		dst[ 4] = 0;
		dst[ 5] = sy;
		dst[ 6] = 0;
		dst[ 7] = 0;
		dst[ 8] = 0;
		dst[ 9] = 0;
		dst[10] = sz;
		dst[11] = 0;
		dst[12] = 0;
		dst[13] = 0;
		dst[14] = 0;
		dst[15] = 1;

		return dst;
	}

	// изменение размера матрици
	tools.scale = function(m, sx, sy, sz, dst) {
		dst = dst || new Float32Array(16);

		dst[ 0] = sx * m[0 * 4 + 0];
		dst[ 1] = sx * m[0 * 4 + 1];
		dst[ 2] = sx * m[0 * 4 + 2];
		dst[ 3] = sx * m[0 * 4 + 3];
		dst[ 4] = sy * m[1 * 4 + 0];
		dst[ 5] = sy * m[1 * 4 + 1];
		dst[ 6] = sy * m[1 * 4 + 2];
		dst[ 7] = sy * m[1 * 4 + 3];
		dst[ 8] = sz * m[2 * 4 + 0];
		dst[ 9] = sz * m[2 * 4 + 1];
		dst[10] = sz * m[2 * 4 + 2];
		dst[11] = sz * m[2 * 4 + 3];

		if (m !== dst) {
			dst[12] = m[12];
			dst[13] = m[13];
			dst[14] = m[14];
			dst[15] = m[15];
		}

		return dst;
	};

	// справнение векторов
	tools.compareVectors = function (v1, v2) {
		return (v1.x == v2.x && v1.y == v2.y);
	};

	// сравнение массивов векторов
	tools.compareVectorArrays = function (arr1, arr2) {
		for(let i in arr1) {
			if(!tools.compareVectors(arr1[i], arr2[i]))
				return false;
		}
		return true;
	};

	// сравнение массивов
	tools.compareArrays = function (arr1, arr2) {
		for(let i in arr1) {
			if(typeof arr1[i] != 'function' && arr1[i] != arr2[i])
				return false;
		}
		return true;
	};

	// сравнение двухмерных массивов
	tools.compare2dArrays = function (arr1, arr2) {
		for(let i in arr1) {
			if(!tools.compareArrays(arr1[i], arr2[i]))
				return false;
		}
		return true;
	};

	// очищение буфера текстур
	tools.clearTextureBuffer = function () {
		tools.staticTex = {};
		tools.staticTexIds = [];
	};

	// создание буфера текстур
	tools.staticTex = {};
	tools.staticTexSize = rjs.gl.getParameter(rjs.gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
	tools.staticTexIds = new Array(tools.staticTexSize);

	tools.staticTexUsed = {};
	
	// загрузка текстуры в буфер видеокарты
	tools.setTexture = function (t, buffer = 0) {
		var gl = rjs.gl;
		if(t != null && (t.type == 'tiled' || t.type == 'croped')) {
			t = t.tex;
		}
		if(t == null) {
			// создание пустой текстуры
			gl.activeTexture(gl[`TEXTURE${buffer}`]);
			gl.bindTexture(gl.TEXTURE_2D, tools.STANDART_TEXTURE);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
		}
		else if(!t.image.loaded) {
			// создание пустой текстуры
			gl.activeTexture(gl[`TEXTURE${buffer}`]);
			gl.bindTexture(gl.TEXTURE_2D, tools.STANDART_TEXTURE);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
			return buffer;
		}
		else if(t.src in tools.staticTex) {
			// выбор текстуры из буфера текстур
			buffer = tools.staticTex[t.src].index;
			gl.activeTexture(gl[`TEXTURE${buffer}`]);
			tools.staticTexUsed[t.src] = t;
			return buffer;
		}
		else {
			// добавление текстуры в буфер текстур
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
			// загрузка текстуры в буфер видеокарты
			gl.activeTexture(gl[`TEXTURE${buffer}`]);
			gl.bindTexture(gl.TEXTURE_2D, tools.STANDART_TEXTURE);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
			gl.bindTexture(gl.TEXTURE_2D, t.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t.canvas);
			// установка параметров текстуры
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

	// отрисовка текста

	tools.drawText = function (t) {

		if(typeof t == 'undefined' || !t.render)
			return false;
		if(rjs.renderer.TEXT_RENDER_MODE == '2D') {
			var ctx = rjs.ctx;

			// получение параметров отрисовки текста
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

			// отрисовка строчек текста
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
		// else if(rjs.renderer.TEXT_RENDER_MODE == 'CSS') {
		// 	if(t.DOM == null) {
		// 		t.DOM = document.createElement('div');
		// 		rjs.container.appendChild(t.DOM);
		// 		t.DOM.style.position = 'absolute';
		// 		t.DOM.style.userSelect = 'none';
		// 		t.DOM.style.overflow = 'hidden';
		// 	}
		// 	t.DOM.style.width = 'auto';
		// 	t.DOM.style.height = 'auto';
		// 	t.DOM.style.transform = `rotate(${0}deg)`;
		// 	var lines = t.text.toString().split('\n');
		// 	var text = '';
		// 	for(var i in lines) {
		// 		text += lines[i] + '<br/>';
		// 	}
		// 	t.DOM.innerHTML = `<div>${text}</div>`;
		// 	var div = t.DOM.getElementsByTagName('div')[0];
		// 	div.style = t.CSS;
		// 	var tb = t.DOM.getBoundingClientRect();
		// 	var cvs = rjs.container.getBoundingClientRect();
		// 	var cx = cvs.left;
		// 	var cy = cvs.top;
		// 	var prop = rjs.canvas_width / rjs.client.w;
		// 	var tx = (t.pos.x * t.layer.scale.x + rjs.client.w/2 - rjs.currentCamera.pos.x * t.layer.scale.x * t.layer.parallax.x / 100) * prop;
		// 	var ty = (t.pos.y * t.layer.scale.y + rjs.client.h/2 - rjs.currentCamera.pos.y * t.layer.scale.y * t.layer.parallax.y / 100) * prop;
		// 	t.DOM.style.fontSize = t.size * prop + "px";
		// 	t.DOM.style.fontFamily = t.font;
		// 	t.DOM.style.left = (tx) - tb.width + "px";
		// 	t.DOM.style.top = (ty) - tb.height + "px";
		// 	var color = rgba(t.color.r, t.color.g, t.color.b, (typeof t.color.a ? t.color.a : 255));
		// 	for(var k in t.filters) {
		// 		color.r *= t.filters[k].r/255;
		// 		color.g *= t.filters[k].g/255;
		// 		color.b *= t.filters[k].b/255;
		// 		color.a *= t.filters[k].a/255;
		// 	}
		// 	color.a /= 255;
		// 	color.a *= t.opacity/100;
		// 	t.DOM.style.color = color.toString();
		// 	var ox = t.origin.split('-')[0].trim();
		// 	var oy = t.origin.split('-')[1].trim();
			
		// 	div.style.position = 'absolute';
		// 	if(ox == 'right') {
		// 		div.style.left = tb.width + 'px';
		// 	}
		// 	if(ox == 'center') {
		// 		div.style.left = tb.width/2 + 'px';
		// 	}
		// 	if(ox == 'left') {
		// 		div.style.left = 0 + 'px';
		// 	}
		// 	if(oy == 'bottom') {
		// 		div.style.top = tb.height + 'px';
		// 	}
		// 	if(oy == 'middle') {
		// 		div.style.top = tb.height/2 + 'px';
		// 	}
		// 	if(oy == 'top') {
		// 		div.style.top = 0 + 'px';
		// 	}
		// 	t.DOM.style.width = tb.width * 2 + 'px';
		// 	t.DOM.style.height = tb.height * 2 + 'px';
		// 	t.DOM.style.transform = `scale(${t.layer.scale.x}, ${t.layer.scale.y}) rotate(${t.angle}deg) scale(${t.scale.x}, ${t.scale.y})`;
		// }
	};

	// отрисовка шаблона объектов с одинаковыми вершинами

	tools.drawPattern = function (pattern) {

		if(rjs.currentCamera == null)
			return;

		var gl = rjs.gl;

		// создание массива вершин
		if(pattern.type == 'sprite')
			pattern.verticesArray = [-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5];
		else if(typeof(pattern.verticesArray) == 'undefined' || pattern.verticesArray == null) {
			pattern.verticesArray = tools.getVerticesArray(pattern);
		}

		var vertices = pattern.verticesArray;
		
		var texcoordChanged = true;
		// загрузка массива вершин
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

		// отрисовка объектов в видимых чанках в чанковом режиме
		if(rjs.renderer.CHUNKS_MODE) {
			var textures = {};
			let chunks = pattern.chunks;
			let cam = rjs.currentCamera;
			// выделение области отрисовки чанков
			let start = tools.getChunkPos(cam.pos);
			start.x = Math.round(start.x-rjs.renderer.CHUNKS_VIEWPORT.x/2);
			start.y = Math.round(start.y-rjs.renderer.CHUNKS_VIEWPORT.y/2);
			let end = tools.getChunkPos(cam.pos);
			end.x = Math.round(end.x+rjs.renderer.CHUNKS_VIEWPORT.x/2);
			end.y = Math.round(end.y+rjs.renderer.CHUNKS_VIEWPORT.y/2);
			// создание массива всех объектов в выбраной области
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
			// добавление объектов вне чанковой системы
			for(let k in pattern.no_chunks) {
				if(!(k in textures))
					textures[k] = [];
				textures[k] = [...textures[k], ...pattern.no_chunks[k]];
			}
			// отрисовка групп объектов с одинаковой текстурой
			for(let k in textures) {
				texcoordChanged = tools.drawPatternTexture(pattern, vertices, textures, k, texcoordChanged);
			}
		}
		// отрисовка объектов с выключеным чанковым режимом
		else {
			// отрисовка групп объектов с одинаковой текстурой
			for(let k in pattern.textures) {
				texcoordChanged = tools.drawPatternTexture(pattern, vertices, pattern.textures, k, texcoordChanged);
			}
		}

	};

	tools.drawPatternTexture = function (pattern, vertices, textures, k, texcoordChanged) {
		let tex_buffer;
		let texcoord = false;
		// привязка текстуры
		if(k == 'default' || k in rjs.textures) {
			if(count(textures[k]) > 0) {
				let texture = k != 'default' ? rjs.textures[k] : null;

				// загрузка текстурных координат
				if(texcoordChanged) {
					if(pattern.type == 'sprite') {
						if(tools.texBuffer != 'sprite_texcoord') {
							tools.bindBuffer('sprite_texcoord', 'texcoord');
							
						}
						texcoord = true;
						texcoordChanged = false;
					}
					else if(pattern.type == 'polygon') {
						if(tools.texBuffer != 'texcoord')
							tools.bindBuffer('texcoord', 'texcoord');
						texcoord = tools.getTexcoordArray(pattern, vertices);
						tools.bufferData('texcoord', texcoord);
						texcoordChanged = false;
					}
				} else
					texcoord = true;
				
				// выбор кадра анимации
				if(texture != null && texture.type == 'animation') {
					texture = texture.frames[texture.currentIndex];
				}
				// загрузка текстуры
				if(texture != null && (texture.type == 'tiled' || texture.type == 'croped')) {
					if(tools.texBuffer != 'texcoord')
						tools.bindBuffer('texcoord', 'texcoord');
					texcoord = tools.getTexcoordArray(pattern, vertices, texture);

					tools.bufferData('texcoord', texcoord);
					
					tex_buffer = tools.setTexture(texture);
					texcoordChanged = true;
				}
				else
					tex_buffer = tools.setTexture(texture);
			}
			// удаление пустого текстур
			else {
				delete pattern.textures[k];
			}
		}
		
		// отрисовка спрайтов и полигонов
    	if(pattern.type == 'sprite' || pattern.type == 'polygon') {
    		let instances = 0;
			let numInstances = 0;
			let gl = rjs.gl;

			let i = 0;
			
			// подсчёт объектов для отрисовки
			for(let l in textures[k]) {
	    		let o = textures[k][l];
				if(typeof o != 'undefined') {
					if(o.render) {
						numInstances ++;
					}
				}
	    	}
	    	
	    	//создание массивов для атрибутов
	    	let colors = [];
	    	let opacities = [];
	    	let matrices = [];
	    	let matrixData = new Float32Array(numInstances * 16);

	    	// отрисовка каждого объекта
    		for(let l in textures[k]) {
				let o = textures[k][l];
				if(typeof o != 'undefined') {
					if(o.render) {
						tools.drawPatternObject(o, vertices, colors, opacities, matrices, matrixData, instances);
						instances ++;
					}
				}
			}

			// выбор текстуры в  буфере
			gl.uniform1i(tools.uniforms.texture, tex_buffer);

			// загрузка матриц в буфер
			gl.bindBuffer(gl.ARRAY_BUFFER, tools.buffers.matrix);
			gl.bufferData(gl.ARRAY_BUFFER, matrixData.byteLength, gl.DYNAMIC_DRAW);
		    gl.bufferSubData(gl.ARRAY_BUFFER, 0, matrixData);

		    // подготовка 4 атрибутов для матрици
		   	const bytesPerMatrix = 4*16;
			for (let i = 0; i < 4; i ++) {
				let loc = tools.attribs.matrix + i
				gl.enableVertexAttribArray(loc);
				const offset = i*16;
				gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, bytesPerMatrix, offset);
				gl.vertexAttribDivisor(loc, 1);
			}
		 	
		 	// загрузка массива цветов в буфер
		 	tools.bufferData('filter', colors);
		 	tools.bindBuffer('filter', 'filter', 4);
		    gl.vertexAttribDivisor(tools.attribs.filter, 1);

		    // загрузка массива прозрачностей и градиентов в буфер
		 	tools.bufferData('opacity', opacities);
		 	tools.bindBuffer('opacity', 'opacity', 3);
		    gl.vertexAttribDivisor(tools.attribs.opacity, 1);

		    // вызов отрисовки
		    gl.drawArraysInstanced(gl.TRIANGLES, 0, vertices.length/2, numInstances);
		    rjs.renderer.DCPF ++;
    	}
    	// отрисовка текстов
    	else if(pattern.type == 'text') {
			for(let l in textures[k]) {
				let o = textures[k][l];
				if(typeof o != 'undefined') {
					if(o.type == 'text') {
						// отрисовка текста
						tools.drawText(o);
						rjs.renderer.DCPF ++;
					}
				}
				
			}
    	}
		return texcoordChanged;
	};

	tools.uniform2f = function (name, v2) {
		// загрузка двухмерного вектора в видеокарту
		var gl = rjs.gl;
		var uv = tools.uniform2f_values;
		if(typeof uv[name] != 'object' || uv[name].x != v2.x || uv[name].y != v2.y) {
			uv[name] = v2;
			gl.uniform2f(tools.uniforms[name], v2.x, v2.y);
		}
	};

	// отрисовка объекта
	tools.drawPatternObject = function (o, vertices, colors, opacities, matrices, matrixData, instance) {

		if(typeof o == 'undefined' || o == null || !o.render) {
			return false;
		}
		
		let gl = rjs.gl;

		let sx = o.type == 'sprite' ? o.size.x : 1;
		let sy = o.type == 'sprite' ? o.size.y : 1;

		// добавление матрици в массив
    	let byteOffsetToMatrix = instance * 16 * 4;
    	let numFloatsForView = 16;
    	matrices[instance] = new Float32Array(matrixData.buffer, byteOffsetToMatrix, numFloatsForView);

    	// трансформация матрици
    	tools.scaling(2/rjs.client.w*o.layer.scale.x, -2/rjs.client.h*o.layer.scale.y, 1, matrices[instance]);
    	tools.translate(matrices[instance], o.pos.x-rjs.currentCamera.pos.x * o.layer.parallax.x / 100, o.pos.y-rjs.currentCamera.pos.y * o.layer.parallax.y / 100, 0, matrices[instance]);
    	tools.zRotate(matrices[instance], o.angle*Math.PI/180, matrices[instance]);
    	tools.scale(matrices[instance], o.scale.x*sx, o.scale.y*sy, 1, matrices[instance]);
    	tools.translate(matrices[instance], -o.origin.x/sx, -o.origin.y/sy, 0, matrices[instance]);
		
		// подсчёт цвета
		let color = rgba(o.color.r, o.color.g, o.color.b, (typeof o.color.a != 'undefined' ? o.color.a : 255));
		for(let k in o.filters) {
			color.r *= o.filters[k].r/255;
			color.g *= o.filters[k].g/255;
			color.b *= o.filters[k].b/255;
			color.a *= (typeof o.filters[k].a != 'undefined' ? o.filters[k].a : 255)/255;
		}

		// добавление цвета в массив
		colors.push(color.r/255, color.g/255, color.b/255, color.a/255);

		// добавление прзрачности и градиентов в массив
		let og = o.opacityGradient;
		opacities.push(o.opacity/100, og.x, og.y);


		if(rjs.renderer.TEXT_RENDER_MODE == '2D' && o.textOverlap) {

			// перекрытие текстов объектом
			tools.clearTextObject(o, vertices, sx, sy);
			
		}

		return true;

	}

	// перекрытие текстов обхектом
	tools.clearTextObject = function (o, vertices, sx, sy) {
		let ctx = rjs.ctx;

		let prop = rjs.canvas_width/rjs.client.w;
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
		for(let i = 2; i < vertices.length; i += 2) {
			let x = vertices[i];
			let y = vertices[i+1];
			ctx.lineTo(x, y);
		}
		ctx.closePath();
		ctx.clip();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, rjs.canvas_width, rjs.canvas_height);
		ctx.restore();
	};

	// получение позции чанка
	tools.getChunkPos = function (pos) {
		var x = Math.floor(pos.x/rjs.renderer.CHUNKS_SIZE.x);
		var y = Math.floor(pos.y/rjs.renderer.CHUNKS_SIZE.y);
		return vec2(x, y);
	};

	// создание чанка
	tools.createChunk = function (o) {
		var chunk = {};
		chunk.x = Math.floor(o.pos.x/rjs.renderer.CHUNKS_SIZE.x);
		chunk.y = Math.floor(o.pos.y/rjs.renderer.CHUNKS_SIZE.y);
		chunk.textures = {
			default: []
		};
		// добавление объекта в чанк
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

	// создание шаблона
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

		// проверка принадлежности объекта к шаблону
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

		// добавление объекта в шаблон
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
					// добавление объекта в чанк
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
					// добавление объекта шаблон вне чанка
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

	// tools.drawTextLayer = function () {

	// 	let gl = rjs.gl;

	// 	let data = rjs.ctx2D_Canvas;

	// 	var w = rjs.client.w/2;
	// 	var h = rjs.client.h/2;

	// 	var k1 = w*2;
	// 	var k2 = h*2;

	// 	var b1 = w/k1;
	// 	var b2 = h/k2;
		
	// 	var vertices = [
	// 		-w, -h,
	// 		w, -h,
	// 		w, h,
	// 		w, h,
	// 		-w, h,
	// 		-w, -h
	// 	];

	// 	var texcoord = [
	// 		-w/k1-b1, -h/k2-b2,
	// 		w/k1-b1, -h/k2-b2,
	// 		w/k1-b1, h/k2-b2,
	// 		w/k1-b1, h/k2-b2,
	// 		-w/k1-b1, h/k2-b2,
	// 		-w/k1-b1, -h/k2-b2
	// 	];
		
	// 	gl.bindBuffer(gl.ARRAY_BUFFER, tools.buffers.position);
	// 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		
	// 	gl.bindBuffer(gl.ARRAY_BUFFER, tools.buffers.texcoord);
	// 	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoord), gl.STATIC_DRAW);
		
	// 	var matrix = tools.projectionMatrix(rjs.client.w, rjs.client.h);
		
	// 	gl.bindTexture(gl.TEXTURE_2D, tools.STANDART_TEXTURE);
	// 	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);
	// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	// 	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		
	// 	gl.uniformMatrix3fv(tools.uniforms.matrix, false, matrix);
	// 	gl.uniform1i(tools.uniforms.texture, 0);
	// 	gl.uniform2f(tools.uniforms.opacity, 1, 0);

	// 	gl.uniform4f(tools.uniforms.filter, 1, 1, 1, 1);
		
	// 	gl.drawArrays(gl.TRIANGLES, 0, vertices.length/2);
		
	// };

	// маркеры активности буферов вершин и текстурных координат
	tools.posBuffer = null;
	tools.texBuffer = null;

	// добавление тектсуры в буфер текстур
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

	// загрузка данных в буфер
	tools.bufferData = function (buffer, data) {
		var gl = rjs.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, tools.buffers[buffer]);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	}

	// привязка буфера
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
	
	// ссылка на набор инструментов отрисовки
	rjs.renderTools = tools;

	// массивы буферов, программ и вводных данных шейдеров
	tools.buffers = {};
	tools.programs = {};
	tools.uniforms = {};
	tools.attribs = {};

	tools.uniform2f_values = {};

	tools.textBuffer = {};

	for(var i in tools) {
		eval(`var ${i} = tools['${i}']`);
	}

	// объединение тектср в тайлмапы (в разработке)
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

	// получение координат тектуры

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

	// интерфейс рендерера
	
	var RENDERER =  {
		
		// инициализация рендеринга
		init: function () {

			var gl = rjs.gl;

			// создание шейдерной программы
			var vertexShaderCode = require(rjs.engineSource+'Shaders/vertex-shader.glsl', 'text');
			var fragmentShaderCode = require(rjs.engineSource+'Shaders/fragment-shader.glsl', 'text');

			var vertexShader = tools.createShader(gl, gl.VERTEX_SHADER, vertexShaderCode);
			var fragmentShader = tools.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderCode);

			tools.programs.def = tools.createProgram(gl, vertexShader, fragmentShader);

			// подключение вводных параметров шейдеров
			tools.attribs.position = gl.getAttribLocation(tools.programs.def, 'a_position');
			tools.attribs.texcoord = gl.getAttribLocation(tools.programs.def, 'a_texcoord');
			
			tools.attribs.matrix = gl.getAttribLocation(tools.programs.def, 'a_matrix');

			tools.uniforms.texture = gl.getUniformLocation(tools.programs.def, 'u_texture');
			tools.attribs.opacity = gl.getAttribLocation(tools.programs.def, 'a_opacity');
			tools.attribs.filter = gl.getAttribLocation(tools.programs.def, 'a_filter');

			// создание буферов
			tools.buffers.position = gl.createBuffer();
			tools.buffers.sprite_position = gl.createBuffer();
			tools.buffers.texcoord = gl.createBuffer();
			tools.buffers.sprite_texcoord = gl.createBuffer();
			tools.buffers.color = gl.createBuffer();
			tools.buffers.filter = gl.createBuffer();
			tools.buffers.opacity = gl.createBuffer();
			tools.buffers.matrix = gl.createBuffer();

			// загрузка параметров отрисовки для спрайта
			gl.bindBuffer(gl.ARRAY_BUFFER, tools.buffers.sprite_position);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5]), gl.STATIC_DRAW);

			gl.bindBuffer(gl.ARRAY_BUFFER, tools.buffers.sprite_texcoord);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1]), gl.STATIC_DRAW);
			
			// создание стандартной текстуры
			tools.STANDART_TEXTURE = gl.createTexture();

		},

		// инийиализация слоя
		initLayer: function (layer) {

			layer.patterns = [];

		},
		

		getPatterns: function (layer) {
			


		},

		// создание текстуры
		createTexture: function () {
			return rjs.gl.createTexture();
		},

		// чанковый режим
		CHUNKS_MODE: false,

		// режим отладки
		DEBUG_MODE: false,

		// автоматическое обновление окна отрисовки чанков
		AUTO_CHUNKS_VIEWPORT_UPDATE: false,
		CHUNKS_VIEWPORT_MODIFER: vec2(3, 2),
		
		// параметры чанков
		CHUNKS_SIZE: vec2(256, 256),
		CHUNKS_VIEWPORT: vec2(1, 1),

		// режим отрисовки текста
		TEXT_RENDER_MODE: '2D',
		//2D

		// режим отрисовки
		DRAWING_MODE: 'mipmap',
		//linear
		//pixel
		//mipmap

		// статус рендеринга
		ACTIVE: true,
		//true
		//false

		// показатель количества вызовов отрисовки за кадр
		DCPF: 0,
		// draw calls per frame

		// обновление тайлмапов (в разработке)
		updateTilemaps: function () {

			new tools.Tilemap(rjs.images);

		},
		
		// обновление шабонов сцены
		updatePatterns: function (scene = rjs.currentScene) {

			var layers = scene.layers;

			// обновление слоёв
			for(let i in layers) {
				let layer = layers[i];
				layer.patterns = [];
				let patterns = layer.patterns;
				// обноление объектов
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
						// добавление объекта в шаблон
						if(!inPattern && pattern.belong(o)) {
							pattern.add(o);
							inPattern = true;
						}
					}
					// создание нового шаблона
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

		// обновление объекта
		updateObject: function (o) {

			//
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

			// добавление объекта в шаблон

			for(let i in patterns) {
				let pattern = patterns[i];
				if(pattern.belong(o) && !inPattern) {
					pattern.add(o);
					inPattern = true;
				}
			}

			// создание шаблона
			if(!inPattern) {
				let id = patterns.length;
				patterns[id] = tools.createPattern(o, id);
				let pattern = patterns[id];
				pattern.add(o);
				inPattern = true;
			}

		},

		// удаление объекта из шаблона
		deleteObject: function (o) {

			if(typeof o.patternLoc == 'undefined')
				return;
			
			var patternID = o.patternLoc.patternID;
			var textureID = o.patternLoc.textureID;
			var objectIndex = o.patternLoc.objectIndex;
			var layerID = o.patternLoc.layerID;
			var chunkX = o.patternLoc.chunkX;
			var chunkY = o.patternLoc.chunkY;
			var chunkObjectIndex = o.patternLoc.chunkObjectIndex;

			try {

				// удаление объекта из шаблона и очистка шаблона от пустых массивов
				if(typeof o.scene.layers[layerID].patterns[patternID].textures[textureID] != 'undefined') {
					delete o.scene.layers[layerID].patterns[patternID].textures[textureID][objectIndex];

					if(count(o.scene.layers[layerID].patterns[patternID].textures[textureID]) == 0)
						delete o.scene.layers[layerID].patterns[patternID].textures[textureID];
				}

				if(rjs.renderer.CHUNKS_MODE) {
					if(o.enable_chunks) {
						if(typeof o.scene.layers[layerID].patterns[patternID].chunks[chunkX][chunkY].textures[textureID] != 'undefined') {
							delete o.scene.layers[layerID].patterns[patternID].chunks[chunkX][chunkY].textures[textureID][chunkObjectIndex];
							if(count(o.scene.layers[layerID].patterns[patternID].chunks[chunkX][chunkY].textures[textureID]) == 0)
								delete o.scene.layers[layerID].patterns[patternID].chunks[chunkX][chunkY].textures[textureID];
						}
					}
					else {
						if(typeof o.scene.layers[layerID].patterns[patternID].no_chunks[textureID] != 'undefined') {
							delete o.scene.layers[layerID].patterns[patternID].no_chunks[textureID][chunkObjectIndex];
							if(count(o.scene.layers[layerID].patterns[patternID].no_chunks[textureID]) == 0)
								delete o.scene.layers[layerID].patterns[patternID].no_chunks[textureID];
						}
					}
				}

			} catch (err) {
				// исправление ошибки в случае её возникновения
				log("Error in RectJS.Object.update(). Fixed automatically");
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
		
		// цикл отрисовки
		render: function () {

			if(!rjs.renderer.ACTIVE)
				return false;
			
			var scene = rjs.currentScene;

			if(scene == null)
				return;

			var layers = scene.layers;

			// подготовка параметров
			rjs.renderer.DCPF = 0;

			rjs.ctx2D_Canvas.style.display = 'inline';

			let gl = rjs.gl;

			// установка параметров WebGL
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

			tools.uniform2f_values = {};

			// обновление окна отрисовки чанков
			if(rjs.renderer.AUTO_CHUNKS_VIEWPORT_UPDATE) {
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

			// отрисовка слоёв
			for(let i in layers) {
				let layer = layers[i];
				tools.textBuffer = {};
				// отрисовка шаблонов
				for(let j in layer.patterns) {
					let pattern = layer.patterns[j];
					tools.drawPattern(pattern);
				}
			}

			// удаление неиспользуемых текстур из буфера текстур
			for(let i in tools.staticTex) {
				if(!(i in tools.staticTexUsed)) {
					delete tools.staticTex[i];
				}
			}

			// обнуление буферов
			tools.staticTexUsed = {};

			tools.posBuffer = null;
			tools.texBuffer = null;
			if(rjs.renderer.DEBUG_MODE)
				debugger;
		}
	}

	return RENDERER;
	
}
