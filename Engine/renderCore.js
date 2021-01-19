(rjs) => {

    const gl = rjs.gl;
    const m3 = rjs.matrix = require(rjs.engineSource+'matrix.js')();

    let idNum = 0;
    let glBlendMode = null;
    let glProgram = null;

    function getID () {
        const id = idNum;
        idNum ++;
        return id;
    }

    class RenderCore {

        constructor () {

            this.shaders = {};
            this.programs = {};
            this.blendModes = {
                "DEFAULT": [gl.ONE, gl.ONE_MINUS_SRC_ALPHA]
            };
            this.attribNames = [
                "vertex",
                "UV",
                "color",
                "matrix"
            ];
            this.uniformNames = [
                "colorMode",
                "uColor",
                "tex"
            ];
            this.commonBuffers = {};
            
            this.blendMode = "DEFAULT";
            this.program = "DEFAULT";
            this.INDEX_BUFFER = "SPRITE_INDEX";

            this.textureBuffer = {};
            this.textureBufferUsed = {};
            this.textureBufferSize = {};
            this.textureBufferIds = {};

        }

        createShader (type, code, id = getID()) {
            let _type = null;
            if(type == "VERTEX")
                _type = gl.VERTEX_SHADER;
            else if(type == "FRAGMENT")
                _type = gl.FRAGMENT_SHADER;
            if(_type == null)
                return error(`Error creating shader! "${type}" is not a type of shader!`);
            const shader = gl.createShader(_type);
            gl.shaderSource(shader, code);
            gl.compileShader(shader);
            if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.log("Shader compilation error: " + gl.getShaderInfoLog(shader))
                gl.deleteShader(shader);
                return null;
            }
            shader.id = id;
            if(!(id in this.shaders))
                this.shaders[id] = {};
            this.shaders[id][type] = shader;
            return shader;
        }

        createProgram (id, vertex = id, fragment = id) {
            const program = gl.createProgram();
            gl.attachShader(program, this.shaders[vertex.toString()].VERTEX);
            gl.attachShader(program, this.shaders[fragment.toString()].FRAGMENT);
            for(let i in this.attribNames) {
                gl.bindAttribLocation(program, i, this.attribNames[i]);
            }
            gl.linkProgram(program);
            if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.log("Error attaching program! Check varying variables!");
            }
            program.id = id;
            program.attribs = {};
            program.uniforms = {};
            program.buffers = {};
            for(let i in this.attribNames) {
                this.initAttrib(program, this.attribNames[i]);
            }
            for(let i in this.commonBuffers) {
                program.buffers[i] = this.commonBuffers[i];
            }
            for(let i in this.uniformNames) {
                this.initUniform(program, this.uniformNames[i]);
            }
            this.programs[id] = program;
            return program;
        }

        useProgram (id) {
            if(glProgram != id) {
                //log(id);
                gl.useProgram(this.programs[id]);
                glProgram = id;
            }
        }

        // buffers

        createBuffer () {
            return gl.createBuffer();
        }

        bindBuffer (buffer, BIND = gl.ARRAY_BUFFER) {
            gl.bindBuffer(BIND, buffer);
        }

        bufferData (buffer, data, iSize = 2, { BIND = gl.ARRAY_BUFFER, MODE = gl.STATIC_DRAW, iNum = 0, ARRAY = Float32Array } = {}) {
            this.bindBuffer(buffer, BIND);
            gl.bufferData(BIND, new ARRAY(data), MODE);
            buffer.iSize = iSize;
            buffer.iNum = iNum;
        }

        // attribs

        enableAttrib (program, name) {
            let loc = program;
            if(typeof program == "object")
                loc = program.attribs[name];
            gl.enableVertexAttribArray(loc);
        }

        disableAttrib (program, name) {
            let loc = program;
            if(typeof program == "object")
                loc = program.attribs[name];
            gl.disableVertexAttribArray(loc);
        }

        initAttrib (program, name, enable = true) {
            const loc = gl.getAttribLocation(program, name);
            program.attribs[name] = loc;
            program.buffers[name] = this.createBuffer();
            if(enable)
                this.enableAttrib(program, name);
        }

        attribPointer (name, buffer_name = name, divisor = 0) {

            const program = this.Program;

            const loc = program.attribs[name];
            const buffer = program.buffers[buffer_name]

            this.bindBuffer(buffer);
            gl.vertexAttribPointer(loc, buffer.iSize, gl.FLOAT, false, 0, 0)
            gl.vertexAttribDivisor(loc, divisor);

        }

        // uniforms

        initUniform (program, name) {
            const loc = gl.getUniformLocation(program, name);
            program.uniforms[name] = loc;
        }

        setUniform (name, type, ...args) {

            const program = this.Program;
            const loc = program.uniforms[name];

            gl[`uniform${type}`](loc, ...args);
            //gl.uniformMatrix3fv(loc, false, new Float32Array(data))

        }

        // matrices

        calcMatrix (mat3, o) {

            // tools.scaling(2/rjs.client.w*o.layer.scale.x, -2/rjs.client.h*o.layer.scale.y, 1, matrices[instance]);
            // tools.translate(matrices[instance], o.pos.x-rjs.currentCamera.pos.x * o.layer.parallax.x / 100, o.pos.y-rjs.currentCamera.pos.y * o.layer.parallax.y / 100, 0, matrices[instance]);
            // tools.zRotate(matrices[instance], o.angle*Math.PI/180, matrices[instance]);
            // tools.scale(matrices[instance], o.scale.x*sx, o.scale.y*sy, 1, matrices[instance]);
            // tools.translate(matrices[instance], -o.origin.x/sx, -o.origin.y/sy, 0, matrices[instance]);

            const sx = o.type == 'sprite' ? o.size.x : 1,
                  sy = o.type == 'sprite' ? o.size.y : 1;

            m3.identity(mat3);
            m3.translation(mat3, -o.origin.x/sx, -o.origin.y/sy);
            m3.scaling(mat3, o.scale.x*sx, o.scale.y*sy);
            m3.rotation(mat3, o.angle);
            m3.translation(mat3, o.pos.x-rjs.currentCamera.pos.x * o.layer.parallax.x / 100, o.pos.y-rjs.currentCamera.pos.y * o.layer.parallax.y / 100);
            m3.scaling(mat3, 2/rjs.client.w*o.layer.scale.x, 2/rjs.client.h*o.layer.scale.y);

            return mat3;

        }

        // preparing

        clearTextureBuffer () {
            
            this.textureBuffer = {};
            this.textureBufferIds = new Array(this.textureBufferSize);

        }

        createTexture () {
            return gl.createTexture();
        }

        setTexFilters (mode, repeat = false) {

            if(repeat) {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            }
            else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            }

            if(mode == 'linear') {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            }
            else if(mode == 'pixel') {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            }
            else if(mode == 'mipmap') {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.generateMipmap(gl.TEXTURE_2D);
            }

        }

        setEmptyTexture (buffer, STANDART_TEXTURE) {

            this.activeTexture(buffer);
            gl.bindTexture(gl.TEXTURE_2D, STANDART_TEXTURE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));

        }

        setTexture (t, buffer) {

            this.activeTexture(buffer);
            gl.bindTexture(gl.TEXTURE_2D, t.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, t.canvas);

        }

        activeTexture (buffer) {
            gl.activeTexture(gl.TEXTURE0+buffer);
        }

        setTextureUniform (buffer, TEXTURE_BUFFER, _DRAWN) {
            
            if(TEXTURE_BUFFER != buffer) {
                this.setUniform("tex", "1i", buffer);
                TEXTURE_BUFFER = buffer;
                return false;
            }

            return _DRAWN;
        }

        setBlendMode (mode) {
            if(glBlendMode != mode) {
                gl.blendFunc(this.blendModes[mode][0], this.blendModes[mode][1]);
                glBlendMode = mode;
            }
        }

        clearViewport () {
            gl.viewport(0, 0, rjs.canvas_width, rjs.canvas_height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.enable(gl.BLEND);
            this.setBlendMode(this.blendMode);
            rjs.ctx.clearRect(0, 0, rjs.canvas_width, rjs.canvas_height);
        }

        // rendering

        drawOne (count) {

            gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);

        }

        draw (instance_num, count) {

            gl.drawElementsInstanced(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0, instance_num);

        }

        drawText (t) {

            if(typeof t == 'undefined' || !t.render)
                return false;
            if(rjs.renderer.TEXT_RENDER_MODE == '2D') {
                
                const ctx = rjs.ctx;

                // получение параметров отрисовки текста
                const prop = rjs.canvas_width / rjs.client.w;
                const x = ((t.pos.x+t.offset.x*t.scale.x) * t.layer.scale.x + rjs.client.w/2 - rjs.currentCamera.pos.x * t.layer.scale.x * t.layer.parallax.x/100) * prop;
                const y = ((t.pos.y+t.offset.y*t.scale.y) * t.layer.scale.y + rjs.client.h/2 - rjs.currentCamera.pos.y * t.layer.scale.y * t.layer.parallax.y/100) * prop;
                const size = t.size * prop;
                const ox = t.origin.split('-')[0].trim();
                const oy = t.origin.split('-')[1].trim();
                const text = t.text.toString();
                const angle = t.angle * Math.PI / 180;

                const color = rgba(t.color.r, t.color.g, t.color.b, (typeof t.color.a ? t.color.a : 255));
                for(let k in t.filters) {
                    color.r *= t.filters[k].r/255;
                    color.g *= t.filters[k].g/255;
                    color.b *= t.filters[k].b/255;
                    color.a *= t.filters[k].a/255;
                }

                const lines = text.split('\n');

                // отрисовка строчек текста
                for(let i in lines) {
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

        }

        clearArea (o) {

            if(o.type != "sprite") {
                let t = o.type;
                t[0] = t[0].toUpperCase();
                return warning(`RectJS.${t} doesn't support ".textOverlap" mode`);
            }

            const ctx = rjs.ctx;

            const sx = o.size.x;
            const sy = o.size.y;

            const prop = rjs.canvas_width/rjs.client.w;
            ctx.save();

            const px = rjs.client.w/2-rjs.currentCamera.pos.x * o.layer.parallax.x / 100-o.pos.x;
            const py = rjs.client.h/2-rjs.currentCamera.pos.y * o.layer.parallax.y / 100-o.pos.y;
            
            ctx.scale(o.layer.scale.x*prop, o.layer.scale.y*prop);
            ctx.translate(px, py);
            ctx.scale(o.scale.x*sx, o.scale.y*sy);
            ctx.rotate(o.angle * Math.PI / 180);
            ctx.translate(-o.origin.x, -o.origin.y);
            ctx.clearRect(-1/2, -1/2, 1, 1);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            
            ctx.restore();

        }

        //getters

        get Program () {
            return this.programs[glProgram];
        }
        
        set Program (value) {
            glProgram = value;
            return value;
        }

        get BlendMode () {
            return this.blendModes[glBlendMode];
        }

        

    }

    return new RenderCore();

}