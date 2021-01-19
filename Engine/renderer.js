(rjs) => {

    const gl = rjs.gl;
    const Core = rjs.renderTools = rjs.renderCore = require(rjs.engineSource+'renderCore.js')(rjs);
    const Vert = rjs.Vert = require(rjs.engineSource+'vert.js')(rjs);

    function ae (a, b) {
        if(a == null || b == null || a.length != b.length)
            return false;
        for(let i in a) {
            if(a[i] != b[i])
                return false;
        }
        return true;
    }

    const SPRITE_VERTEX = [
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5
    ];

    const SPRITE_INDEX = [0, 1, 2, 2, 3, 0];

    const SPRITE_UV = [
        0, 0,
        1, 0,
        1, 1,
        0, 1
    ];

    let VERTEX_TYPE = null;
    let VERTICES = [];
    let UVs = [];

    let INSTANCES = [];

    let COLORS = [];
    let COLOR_MODE = null;

    let _DRAWN = false;
    let DRAWN = false;

    let STANDART_TEXTURE = null;

    let TEXTURE = NaN;
    let TEXTURE_BUFFER = NaN;

    class Renderer {

        constructor() {

            this.DRAWING_MODE = "pixel";
            this.TEXT_RENDER_MODE = "2D";
            this.DPCF = 0;

        }

        updatePatterns () {}

        initLayer () {}

        createTexture () {}

        getVerticesArray () {}

        setColors (o) {

            const color = rgba(o.color.r, o.color.g, o.color.b, (typeof o.color.a != 'undefined' ? o.color.a*o.opacity/100 : o.opacity/100*255));
            for(let i in o.filters) {
                color.r *= o.filters[i].r/255;
                color.g *= o.filters[i].g/255;
                color.b *= o.filters[i].b/255;
                color.a *= (typeof o.filters[i].a != 'undefined' ? o.filters[i].a : 255)/255;
            }

            if(o.colorMode != COLOR_MODE) {
                if(!DRAWN) {
                    RENDERER.draw();
                }
                COLOR_MODE = o.colorMode;
                const program = Core.Program;
                if(o.colorMode == "UNIFORM") {
                    Core.disableAttrib(program, "color");
                    Core.setUniform("colorMode", "1i", 1);
                }
                else {
                    Core.enableAttrib(program, "color");
                    Core.setUniform("colorMode", "1i", 0);
                }
            }

            if(o.colorMode == "SINGLE") {

                COLORS.push(color.r/255, color.g/255, color.b/255, color.a/255);
                _DRAWN = false;

            }

            else if(o.colorMode == "VERTEX") {

                const colors = [];

                for(let i in o.colors) {
                    const index = parseInt(i)*4;
                    colors[index+0] = o.colors[i].r/255 * color.r/255;
                    colors[index+1] = o.colors[i].g/255 * color.g/255;
                    colors[index+2] = o.colors[i].b/255 * color.b/255;
                    colors[index+3] = (typeof o.colors[i].a == "undefined" ? 255 : o.colors[i].a)/255 * color.a/255;
                }

                if(!ae(COLORS, colors)) {

                    if(!DRAWN)
                        RENDERER.draw();
                    
                    COLORS = colors;
                    _DRAWN = false;

                }

            }

            else if(o.colorMode == "UNIFORM") {
                
                if(color.toString() != COLORS.toString()) {

                    Core.setUniform("uColor", "4f", color.r/255, color.g/255, color.b/255, color.a/255);
                    COLORS = color;

                    _DRAWN = false;

                }

            }

        }

        getTexture (o) {

            let t = null;

            if(o.texture != null && o.texture.type == "animation")
                t = o.texture.frames[o.texture.currentIndex];
            else
                t = o.texture;

            return t;

        }

        toTextureBuffer (t) {
            let coll = 0;
            for(let i = 1; i < Core.textureBufferSize-1; i ++) {
                if(typeof(Core.textureBufferIds[i]) == 'undefined') {
                    coll = i;
                    break;
                }
            }
            if(coll != 0) {
                let id = coll;
                Core.textureBuffer[t.src] = Core.textureBufferIds[id] = {
                    name: t.src,
                    index: id,
                    tex: t
                };
                return Core.textureBuffer[t.src].index;
            }
        }

        useTexture (t) {

            Core.textureBufferUsed[t.src] = t;

        }

        setTexture (o) {

            

            let t = this.getTexture(o);
            let buffer = 0;

            let type = "plain";

            if(t != null)
                type = t.type || "plain";

            if(t != null && (t.type == 'tiled' || t.type == 'croped')) {
                t = t.tex;
            }

            if(TEXTURE != t) {
                
                if(!DRAWN)
                    RENDERER.draw();

                if(t == null || !t.image.loaded) {

                    Core.setEmptyTexture(buffer, STANDART_TEXTURE);
                    _DRAWN = Core.setTextureUniform(buffer, TEXTURE_BUFFER, _DRAWN);

                    TEXTURE = t;

                }
                else if(t.src in Core.textureBuffer) {

                    buffer = Core.textureBuffer[t.src].index;

                    Core.activeTexture(buffer);
                    this.useTexture(t);
                    
                    _DRAWN = Core.setTextureUniform(buffer, TEXTURE_BUFFER, _DRAWN);

                    TEXTURE = t;

                }
                else {
                    
                    buffer = this.toTextureBuffer(t, buffer);

                    this.useTexture(t);
                    Core.setTexture(t, buffer);
                    Core.setTexFilters(RENDERER.DRAWING_MODE, type == 'tiled');

                    _DRAWN = Core.setTextureUniform(buffer, TEXTURE_BUFFER, _DRAWN);

                    TEXTURE = t;
                }
                return {buffer: buffer, texture: t};
            }
            else {
                _DRAWN = false;
                return {buffer: TEXTURE_BUFFER, texture: TEXTURE};
            }

        }

        setVertices (o, texture) {

            const program = Core.Program;

            

            if(VERTEX_TYPE == o.type || ae(VERTICES, (o.vertices || null))) {
                return;
            }

            if(o.type == "sprite") {
                if(!DRAWN)
                    RENDERER.draw();

                Core.attribPointer("vertex", "SPRITE_VERTEX");
                Core.attribPointer("UV", "SPRITE_UV");

                Core.bufferData(program.buffers.SPRITE_INDEX, SPRITE_INDEX, 0, { BIND: gl.ELEMENT_ARRAY_BUFFER, ARRAY: Uint16Array, iNum: SPRITE_INDEX.length });

                Core.INDEX_BUFFER = "SPRITE_INDEX";

                VERTEX_TYPE = o.type;

                UVs = [];
                VERTICES = [];

                _DRAWN = false;

            }
            else if(o.type == "polygon") {

                if(!DRAWN) {
                    RENDERER.draw();
                }

                Core.INDEX_BUFFER = "INDEX";
                const { vertices, indices } = Vert.getVerticesArray(o);

                VERTICES = [];
                
                const UVs = Vert.getUV_Array(o, vertices, texture);//[0,0,0,0,0,0,0,0];
                VERTICES = o.vertices;
                
                Core.bufferData(program.buffers.VERTEX, vertices, 2);
                Core.bufferData(program.buffers.UV, UVs, 2);
                Core.bufferData(program.buffers.INDEX, indices, 0, { BIND: gl.ELEMENT_ARRAY_BUFFER, ARRAY: Uint16Array, iNum: indices.length });

                Core.attribPointer("vertex", "VERTEX");
                Core.attribPointer("UV", "UV");

                VERTEX_TYPE = o.type;

                _DRAWN = false;
            }

        }

        setProgram (o) {

            const program = o.program || Core.programs.DEFAULT;

            if(Core.Program == null) {
                if(!DRAWN)
                    RENDERER.draw();
            }
            else if(program.id != Core.Program.id) {
                if(!DRAWN)
                    RENDERER.draw();
            }

            Core.useProgram(program.id);

            _DRAWN = false;

        }

        drawScene (scene) {

            for(let i in scene.layers) {
                const layer = scene.layers[i];
                RENDERER.drawLayer(layer);
            }

        }

        drawLayer (layer) {

            // if(layer.id == "form_bg")
            //     return;

            //log(layer.id);

            let c = 0;

            for(let i in layer.objects) {
                const object = layer.objects[i];
                RENDERER.drawObject(object);
                c ++;
            }

        }

        drawObject (o) {
            
            if(!o.render)
                return;
            
            if(o.type == "sprite" || o.type == "polygon") {

                this.setProgram(o);
                
                const { buffer, texture } = this.setTexture(o);
                this.setVertices(o, texture);
                this.setColors(o);

                if(o.textOverlap)
                    Core.clearArea(o);

                INSTANCES.push(o);

                DRAWN = _DRAWN;

            }
            else if(o.type == "text") {

                Core.drawText(o);

            }
            

            //Core.drawOne(Core.commonBuffers.SPRITE_INDEX.iNum);

        }

        draw () {

            const matrixData = new Float32Array(INSTANCES.length * 9);
            const matrices = [];

            const program = Core.Program;

            const mat = "matrix";
            Core.bufferData(program.buffers[mat], matrixData.byteLength, 0, { MODE: gl.DYNAMIC_DRAW });

            for(let i in INSTANCES) {

                const o = INSTANCES[i];

                const byteOffsetToMatrix = i * 9 * 4;
                const numFloatsForView = 9;
                
                matrices.push(new Float32Array(
                    matrixData.buffer,
                    byteOffsetToMatrix,
                    numFloatsForView));
                
                Core.calcMatrix(matrices[i], o);

            }

            Core.bindBuffer(program.buffers[mat]);

            const bytesPerMatrix = 4 * 9;
            
            for (let i = 0; i < 3; i ++) {
                const loc = program.attribs[mat] + i;
                const offset = i * 12;
                Core.enableAttrib(loc);
                gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, bytesPerMatrix, offset);
                gl.vertexAttribDivisor(loc, 1);
            }

            Core.bindBuffer(program.buffers[mat]);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, matrixData);

            if(COLOR_MODE != "UNIFORM") {
                let colorMode;
                let colorDiv;

                if(COLOR_MODE == "SINGLE") {
                    colorMode = gl.DYNAMIC_DRAW;
                    colorDiv = 1;
                }
                else if(COLOR_MODE == "VERTEX") {
                    colorMode = gl.STATIC_DRAW;
                    colorDiv = 0;
                }
                
                Core.bufferData(program.buffers.color, COLORS, 4, { MODE: colorMode });
                Core.attribPointer("color", "color", colorDiv);
            }

            Core.draw(INSTANCES.length, program.buffers[Core.INDEX_BUFFER].iNum);

            INSTANCES = [];
            COLORS = [];
            DRAWN = _DRAWN = true;

            this.DPCF ++;
        }

        init () {

            Core.commonBuffers.SPRITE_VERTEX = Core.createBuffer();
            Core.commonBuffers.SPRITE_UV = Core.createBuffer();
            Core.commonBuffers.SPRITE_INDEX = Core.createBuffer();

            Core.commonBuffers.VERTEX = Core.createBuffer();
            Core.commonBuffers.UV = Core.createBuffer();
            Core.commonBuffers.INDEX = Core.createBuffer();

            const vertex = new rjs.Shader("VERTEX", rjs.engineSource+"glsl/vertex.glsl", "DEFAULT");
            const fragment = new rjs.Shader("FRAGMENT", rjs.engineSource+"glsl/fragment.glsl", "DEFAULT");

            new rjs.Program();
            
            Core.bufferData(Core.commonBuffers.SPRITE_VERTEX, SPRITE_VERTEX, 2);
            Core.bufferData(Core.commonBuffers.SPRITE_UV, SPRITE_UV, 2);
            Core.bufferData(Core.commonBuffers.SPRITE_INDEX, SPRITE_INDEX, 0, { BIND: gl.ELEMENT_ARRAY_BUFFER, ARRAY: Uint16Array, iNum: SPRITE_INDEX.length });

            STANDART_TEXTURE = Core.createTexture();
            Core.textureBuffer = {};
            Core.textureBufferSize = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
            Core.textureBufferIds = new Array(Core.textureBufferSize);
            Core.textureBufferUsed = [];

        }

        render () {

            VERTEX_TYPE = null;
            DRAWN = true;
            VERTICES = [];
            INSTANCES = [];
            COLORS = [];
            COLOR_MODE = null;

            RENDERER.DPCF = 0;

            //TEXTURE = TEXTURE_BUFFER = NaN;
            
            Core.clearViewport();
            
            //Core.Program = null;

            const scene = rjs.currentScene;
            if(scene == null)
                return;

            RENDERER.drawScene(scene);

            if(!DRAWN)
                RENDERER.draw();

            for(let i in Core.textureBuffer) {
                if(!(i in Core.textureBufferUsed)) {
                    delete Core.textureBufferIds[Core.textureBuffer[i].index];
                    delete Core.textureBuffer[i];
                }
            }

            Core.textureBufferUsed = {};

            //log(rjs.FPS);

        }

    }

    const RENDERER = new Renderer();

    return RENDERER;

}