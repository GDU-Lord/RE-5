# Introduction

__Rect Engine 5__ (RE-5) - is the object-oriented engine-framework made by Black Square Studios for 2D games development with JavaScript. Graphic engine in RE-5 is based on [WebGL2](https://webgl2fundamentals.org) (browser adaptation of [OpenGL3.0](https://www.opengl.org)). Engine is suitable for small and big multiplayer games development as well. Engine has a flexible plugin system that expands its functionality. More lessons and guides to RE-5 you can find following [this link](http://bss.epizy.com/page/?f=re5lessons&lang=en).

# Setting up the project

- Install any local server or just use our small local [server on Node.js](https://github.com/BSS-Lord/local-server)
- Create project directory on the server
- Unpack this repository into that folder
- When you just open it in browser you sould see the tinged square rotating around and the caption "Rect Engine 5"

__WARNING!__ You can use any comfortable to you code editor, cause there's no native IDE for the engine yet.

# Project structure

- __Engine__ (engine files)
	- __Shaders__ (shaders)
		- __fragment-shader.glsl__ (fragment shader)
		- __vertex-shader.glsl__ (vertex shader)
	- __collision.js__ (collision detection)
	- __engine.js__ (engine logic, program interface)
	- __renderer.js__ (graphics engine shall)
	- __renderCore.js__ (graphics engine core)
	- __matrix.js__ (matrix maths)
	- __vert.js__ (object vertices)
- __Plugins__ (plugins)
- __Scene__ (scenes)
	- __new__ (scene files)
		- __end.js__ (runs when the scene ends)
		- __init.js__ (runs after the scene is initialized)
		- __start.js__ (runs every time when the scene starts)
- __Scripts__ (scripts)
	- __assets.js__ (for setting up assets)
	- __config.js__ (for setting up configurations and settings)
	- __families.js__ (for families initializing)
	- __sources.js__ (for source loading)
- __Sources__ (sources)
	- __audio__ (audio files)
	- __images__ (textures, tilemaps)
	- __json__ (JSON files)
	- __glsl__ (shaders)
- __index.html__ (runs engine.js and main.js)
- __main.js__ (engine initialization)

# What's the project consist of?

In the __*main.js*__ file there's the engine initializing, including all scripts from __*Scripts*__ falder, creating scenes, scripts from the __*Scenes/scene name*__ folder attaching to the scenes, switching to the certain scene.

In the __*config.js*__ script there's all project and engine settings.

In the __*families.js*__ script there's all families initializations

In the __*sources.js*__ script there's all needed sources loading (textures, sounds, fonts...)

In the __*assets.js*__ script there's all assets initializations.

You can add your own scripts in __*Scripts*__ folder or in the folders of the scenes and include it wherever and whenever you want.

In the every folder of the scene there's 3 files:
- __*init.js*__ - the script runs only at ones after the scene is initialized, there you have to create cameras, layers, most of the game objects, game loop for the scene and initialize all needed event listeners.
- __*start.js*__ - the script runs every single time when the scene starts, here the game switches to the necessary camera, the engine settings change, the level starts, for example enemy takes their places on the level.
- __*end.js*__ - the script runs every single time when the scene ends, game engine settings turns back to normal, the game progress could be saved.

# Methods and properties
## Content
### [Initialization](#initialization)
- [new RectJS()](#new-rectjscallback-sourcehost-enginesource-pluginsource-eventdetector)
- [require()](#requiresrc-type)
- [RectJS.Script()](#rectjsscriptsrc)
- [new RectJS.Scene()](#new-rectjsscenename-initonload-id])
- [Scene.set()](#scenesetstartparams-endparams)
- [Scene.update()](#sceneupdate)
### [Special methods](#special-methods)
- [new RectJS.Vector2()](#new-rectjsvector2x-y)
- [Vector2.toString()](#vector2tostring)
- [Vector2.fromString()](#vector2fromstringv)
- [Vector2.len](#vector2len)
- [Vector2.angle](#vector2angle)
- [Vector2.add()](#vector2addv)
- [Vector2.sub()](#vector2subv)
- [Vector2.mult()](#vector2multv)
- [Vector2.div()](#vector2divv)
- [Vector2.dot()](#vector2dotv)
- [Vector2.norm()](#vector2norm)
- [Vector2.rot()](#vector2rota)
- [Vector2.abs()](#vector2abs)
- [vec2()](#vec2x-y)
- [rgb()](#rgbr-g-b)
- [rgba()](#rgbar-g-b-a)
- [colorRGB.toString()](#colorrgbtostring)
- [colorRGBA.toString()](#colorrgbatostring)
- [colorRGBA.toStringCSS()](#colorrgbatostringcss)
- [count()](#countobject)
- [copy()](#copyobject)
- [log()](#log)
- [RectJS.isObject()](#rectjsisobjectobject)
- [RectJS.checkSourceLoaded()](#rectjschecksourceloaded)
### [Cameras and layers](#cameras-and-layers)
- [new RectJS.Camera()](#new-rectjscameraoptions)
- [Camera.set()](#cameraset)
- [new RectJS.Layer()](#new-rectjslayerscene-parallax-scale-id-options)
- [new RectJS.Group()](#new-rectjsgrouplayer-id)
- [Group.isset()](#groupisseto)
- [Group.add()](#groupaddo)
- [Group.set()](#groupseto)
- [Group.remove()](#groupremoveo)
### [Game objects](#game-objects)
- [new RectJS.Polygon()](#new-rectjspolygonoptions)
- [new RectJS.Sprite()](#new-rectjsspriteoptions)
- [new RectJS.Text()](#new-rectjstextoptions)
- [Object.destroy()](#objectdestroy)
- [Object.setLayer()](#objectsetlayerlayer)
- [Object.getPoint()](#objectgetpointid)
- [Object.update()](#objectupdate)
### [Game loops](#game-loops)
- [new RectJS.GameLoop()](#new-rectjsgameloopcallback-active-scene-absl)
- [Loop.start()](#loopstart)
- [Loop.stop()](#loopstop)
- [new RectJS.Interval()](#new-rectjsintervalcallback-timeout-active-scene)
- [new RectJS.Wait()](#new-rectjswaitcallback-delay-active-scene-absl)
### [Sources](#sources)
- [new RectJS.Texture](#new-rectjstexturesrc-scale-custom_size)
- [RectJS.Image](#rectjsimagesrc-scale-custom_size)
- [new RectJS.Tiled()](#new-rectjstiledorigin-size)
- [new RectJS.Crop()](#new-rectjscroporigin-pos-size)
- [new RectJS.Animation()](#new-rectjsanimationoptions)
- [RectJS.loadFont()](#rectjsloadfontname-src)
- [RectJS.Font()](#rectjsfontname-src)
- [RectJS.JSON()](#rectjsjsonsrc)
- [new RectJS.Sound()](#new-rectjssoundsrc-distance)
- [RectJS.Audio()](#rectjsaudiosrc-distance)
- [Sound.play()](#soundplay)
- [Sound.stop()](#soundstop)
- [Sound.reset()](#soundreset)
- [Sound.restart()](#soundrestart)
- [Sound.getDuration()](#soundgetduration)
- [Sound.setTime()](#soundsettimetime)
- [Sound.getTime()](#soundgettime)
- [Sound.setVolume()](#soundsetvolumevolume)
- [Sound.getVolume()](#soundgetvolume)
- [Sound.bindObject](#soundbindobject)
- [Sound.unbindObject()](#soundunbindobject)
### [Shaders](#shaders)
- [new RectJS.Shader()](#new-rectjsshadertype-src-id)
- [new RectJS.Program()](#new-rectjsprogramoptions)
### [Vertex shader parameters](#vertex-shader-parameters)
- [VS attribute vertex](#attribute-vec2-vertex)
- [VS attribute UV](#attribute-vec2-uv)
- [VS attribute matrix](#attribute-mat3-matrix)
- [VS attribute color](#attribute-vec4-color)
- [VS varying vColor](#varying-vec4-vcolor)
- [VS varying vUV](#varying-vec2-vuv)
- [VS uniform colorMode](#uniform-bool-colormode)
- [VS uniform uColor](#uniform-vec4-ucolor)
### [Fragment shader parameters](#fragment-shader-parameters)
- [FS uniform tex](#uniform-sampler2d-tex)
- [FS varying vColor](#varying-vec4-vcolor-1)
- [FS varying vUV](#varying-vec2-vuv-1)
### [Mouse and keyboard](#mouse-and-keyboard)
- [new RectJS.Click()](#new-rectjsclickcallback-active-scene-target)
- [new RectJS.RightClick()](#new-rectjsrightclickcallback-active-scene-target)
- [new RectJS.MouseDown()](#new-rectjsmousedowncallback-active-scene-target)
- [new RectJS.MouseUp()](#new-rectjsmouseupcallback-active-scene-target)
- [new RectJS.MouseRightDown()](#new-rectjsmouserightdowncallback-active-scene-target)
- [new RectJS.MouseRightUp()](#new-rectjsmouserightupcallback-active-scene-target)
- [new RectJS.MouseWheelDown()](#new-rectjsmousewheeldowncallback-active-scene-target)
- [new RectJS.MouseWheelUp()](#new-rectjsmousewheelupcallback-active-scene-target)
- [new RectJS.MouseMove()](#new-rectjsmousemovecallback-active-scene-target)
- [new RectJS.Wheel()](#new-rectjswheelcallback-active-scene-target)
- [new RectJS.WheelUp()](#new-rectjswheelupcallback-active-scene-target)
- [new RectJS.WheelDown()](#new-rectjswheeldowncallback-active-scene-target)
- [new RectJS.MousePress()](#new-rectjsmousepresscallback-active-scene)
- [new RectJS.TouchStart()](#new-rectjstouchstartcallback-id-active-scene-target)
- [new RectJS.TouchEnd()](#new-rectjstouchendcallback-id-active-scene-target)
- [new RectJS.TouchMove()](#new-rectjstouchmovecallback-id-active-scene-target)
- [new RectJS.KeyDown()](#new-rectjskeydowncallback-key-active-scene-target)
- [new RectJS.KeyUp()](#new-rectjskeyupcallback-key-active-scene-target)
- [new RectJS.KeyPress()](#new-rectjskeypresscallback-key-active-scene)
- [Event.start()](#eventstart)
- [Event.stop()](#eventstop)
- [RectJS.KeyPressed()](#rectjskeypressedkey)
- [new RectJS.Mouse()](#new-rectjsmouse)
- [Mouse.get()](#mousegetlayer-scale-parallax)
- [new RectJS.Touch()](#new-rectjstouch)
- [Touch[index].get()](#touchindexgetlayer)
### [Families and assets](#families-and-assets)
- [new RectJS.Family()](#new-rectjsfamily)
- [Family.get()](#familygetid)
- [Family.getByIndex()](#familygetbyindexindex)
- [Family.isset()](#familyisseto)
- [Family.for()](#familyforcallback)
- [Family.forNearTo()](#familyforneartopos-callback-dist-chunk_mode-chunk_dist)
- [Family.count()](#familycount)
- [Family.add()](#familyaddobject)
- [Family.remove()](#familyremoveobject)
- [new RectJS.Asset()](#new-rectjsassetoptions)
- [new Asset()](#new-assetoptions)
### [Collision detection](#collision-detection)
- [RectJS.Collision()](#rectjscollisiona-b)
- [RectJS.getBoundingBox()](#rectjsgetboundingboxobject-calc_angle)
- [RectJS.AABB()](#rectjsaabba-b)
- [RectJS.MouseOver()](#rectjsmouseoverobject)
### [Engine properties](#engine-properties)
- [RectJS.sourceHOST](#rectjssourcehost)
- [RectJS.engineSource](#rectjsenginesource)
- [RectJS.pluginSource](#rectjspluginsource)
- [RectJS.Path](#rectjspath)
- [RectJS.scenePath](#rectjsscenepath)
- [RectJS.scriptPath](#rectjsscriptpath)
- [RectJS.jsonPath](#rectjsjsonpath)
- [RectJS.imagePath](#rectjsimagepath)
- [RectJS.audioPath](#rectjsaudiopath)
- [RectJS.fontPath](#rectjsfontpath)
- [RectJS.container](#rectjscontainer)
- [RectJS.WebGL_Canvas](#rectjswebgl_canvas)
- [RectJS.ctx2D_Canvas](#rectjsctx2d_canvas)
- [RectJS.eventDetector](#rectjseventdetector)
- [RectJS.gl](#rectjsgl)
- [RectJS.ctx](#rectjsctx)
- [RectJS.client.w](#rectjsclientw)
- [RectJS.client.h](#rectjsclienth)
- [RectJS.resolution.w](#rectjsresolutionw)
- [RectJS.resolution.h](#rectjsresolutionh)
- [RectJS.canvas_width](#rectjscanvas_width)
- [RectJS.canvas_height](#rectjscanvas_height)
- [RectJS.con_width](#rectjscon_width)
- [RectJS.con_height](#rectjscon_height)
- [RectJS.CLEAR_COLOR](#rectjsclear_color)
- [RectJS.BG_COLOR](#rectjsbg_color)
- [RectJS.scenes](#rectjsscenes)
- [RectJS.currentScene](#rectjscurrentscene)
- [RectJS.layers](#rectjslayers)
- [RectJS.sources](#rectjssources)
- [RectJS.images](#rectjsimages)
- [RectJS.textures](#rectjstextures)
- [RectJS.LOADER_MODE](#rectjsloader_mode)
- [RectJS.sourceLoaded](#rectjssourceloaded)
- [RectJS.timeStep](#rectjstimestep)
- [RectJS.animations](#rectjsanimations)
- [RectJS.cameras](#rectjscameras)
- [RectJS.currentCamera](#rectjscurrentcamera)
- [RectJS.waits](#rectjswaits)
- [RectJS.gameLoops](#rectjsgameloops)
- [RectJS.CUT_FPS](#rectjscut_fps)
- [RectJS.MAX_FPS](#rectjsmax_fps)
- [RectJS.SFRM](#rectjssfrm)
- [RectJS.events](#rectjsevents)
- [RectJS.MousePressed](#rectjsmousepressed)
- [RectJS.RightMousePressed](#rectjsrightmousepressed)
- [RectJS.families](#rectjsfamilies)
- [RectJS.FPS](#rectjsfps)
- [RectJS.render](#rectjsrender)
- [RectJS.renderCore](#rectjsrendercore)
- [RectJS.renderer](#rectjsrenderer)
- [RectJS.renderer.ACTIVE](#rectjsrendereractive)
- [RectJS.renderer.DRAWING_MODE](#rectjsrendererdrawing_mode)
- [RectJS.renderer.DCPF](#rectjsrendererdcpf)
- [RectJS.renderer.DEBUG_MODE](#rectjsrendererdebug_mode)
- [RectJS.renderer.DEBUG_CONSOLE_MODE](#rectjsrendererdebug_console_mode)
### [Plugins](#plugins)
- [new RectJS.Plugin()](#new-rectjspluginname-params)



## Initialization

### new RectJS(callback[, sourceHOST[, engineSource[, pluginSource[, eventDetector]]]])

- __callback__ `<function>` - this function takes the game engine instance as an argument
- __sourceHOST__ `<string>` __*Default:*__ `""` - the realtive path from the __*index.html*__ to __*main.js*__, engine and project folders.
- __engineSource__ `<string>` __*Default:*__ `"Engine/"` - the path from the folder set up in __sourceHOST__ to the engine folder.
- __pluginSource__ `<string>` __*Default:*__ `"Plugins/"` - the path from the folder set up in __sourceHOST__ to the plugins folder.
- __eventDetector__ `<object>` __*Default:*__ `null` - DOM element on the page to which all mouse event listeners is bound. If equal `null`, it sets by default to __RectJS.eventDetector__.

Engine initialization

### require(src[, type])

- __src__ `<string>` - relative path to the file
- __type__ `<string>` __*Default:*__ `"JS"` - file type
	- __"JS"__ - JavaScript. The method returns an arrow function from the script.
	- __"JSON"__ - JSON file. The method returns JavaScript-object from the JSON file.
	- __"TEXT"__ - Simple text. The method returns a text from the file as a string.

Loading an external script. Returns a function.

__WARNING!__ All available scripts actually are the arrow functions:
```javascript
(params) => {
	// code here
}
```
or the function taken in the brackets:
```javascript
(function (params) {
	// code here
})
```

__WARNING!__ If you want variable to be accessible form all of the scripts it need to be global. There's 3 ways to do that:
- declare the variable missing the keyword ('const', 'let' or 'var') (recommended)
`variable = 1;`
- declare the variable as a property of the __window__
`window.variable = 1;`
- declare the variable beyound the "onload" event listener in the __*main.js*__ script
```javascript
var variable = 1;

window.addEventListener('load', e => {
...
```

### RectJS.Script(src)

- __src__ `<string>` - path to the script relative to scripts folder (`RectJS.scriptPath`, `Scripts/` by default)

Loading external script. Returns a function.

### new RectJS.Scene(name[, initOnload[, id]])

- __name__ `<string>` - a name of the folder with scene files in the scenes folder (`RectJS.scenePath`, `Scenes/` by default)
- __initOnload__ `<boolean>` __*Default:*__ `true`
	- __true__ - initialization script runs emmidiately after the scene is declared
	- __false__ - initialization script runs right before the first scene start
- __id__ `<string>` __*Default:*__ `"scene_{scene number}"` - scene indentifier
		
Scene initializer. Returns the scene instance.

__!!!WARNING!!!__ To create a new scene you need to make a new folder with the name of the scene in `Scenes/` directory and put 3 script files there:

- __init.js__ - runs after the scene was initialized
- __start.js__ - runs when the player go to the scene
- __end.js__ - runs when the player leave the scene

These files will load automaticaly.

The __init.js__ script example:
```javascript
(scene) => {
	
	// create a camera
	
	// create some layers
	
	// objects, loops, listeners and game logics
	
}
```
The __start.js__ or __end.js__ script example:
```javascript
(scene, params) => {
	
	// some code
	
}
```

### Scene.set([startParams[ ,endParams]])

- __startParams__ `<object>` - parameters passes to the __start.js__ script of the scene
- __endParams__ `<object>` - parameters passes to the __end.js__ script of a scene

Switching to the scene

## Special methods

### new RectJS.Vector2([x, y])

- __x__ `<number>` | `<string>` __*Default:*__ `0` - x coordinate of the vector
- __y__ `<number>` | `<string>` __*Default:*__ `0` - y coordinate of the vector

2D vector creation. Returns the Vector2 object.

### Vector2.toString()

Converting the vector into a string. `"v{X coordinate};{Y coordinate}"`
```javascript
new rjs.Vector2(1, 3).toString() = "v1;3";
```

### Vector2.fromString(v)

- __v__ `<string>` - vector in the form of string

Converting vector from string into a Vector2 object.
```javascript
Vector2.fromString("v1;3") = new rjs.Vector2(1; 3);
```

### Vector2.len

Returns the length of the vector.

### Vector2.angle

Returns the angle between source vector and X+ axis.

### Vector2.add(v)
### Vector2.add([x[, y]])

- __v__ `<object>` (`<Vector2>`) - vector
- __x__ `<number>` __*Default:*__ `0` - x coordinate
- __y__ `<number>` __*Default:*__ `x` - y coordinate

Returns the total of the vectors.

### Vector2.sub(v)
### Vector2.sub(x[, y])

- __v__ `<object>` (`<Vector2>`) - vector
- __x__ `<number>` __*Default:*__ `0` - x coordinate
- __y__ `<number>` __*Default:*__ `x` - y coordinate

Returns the difference of the vectors.

### Vector2.mult(v)
### Vector2.mult(x[, y])

- __v__ `<object>` (`<Vector2>`) - vector
- __x__ `<number>` __*Default:*__ `0` - x coordinate
- __y__ `<number>` __*Default:*__ `x` - y coordinate

Returns the product of the vectors.

### Vector2.div(v)
### Vector2.div(x[, y])

- __v__ `<object>` (`<Vector2>`) - vector
- __x__ `<number>` __*Default:*__ `0` - x coordinate
- __y__ `<number>` __*Default:*__ `x` - y coordinate

Returns the division of the vectors.

### Vector2.dot(v)
### Vector2.dot(x[, y])

- __v__ `<object>` (`<Vector2>`) - vector
- __x__ `<number>` __*Default:*__ `0` - x coordinate
- __y__ `<number>` __*Default:*__ `x` - y coordinate

Returns a dot product of the vectors.

### Vector2.norm()

Returns the normalized vector.

### Vector2.rot(a)

- __a__ `<number>` - angle in degrees

Returns the source vector rotated on a given angle.

### Vector2.abs()

Returns the vector with positive values of `x` and `y`

### vec2([x, y])

2D vector creation. Returns __new RectJS.Vector2(x, y)__.

### rgb(r, g, b)

- __r__ `<number>` - red channel (0-255)
- __g__ `<number>` - green channel (0-255)
- __b__ `<number>` - blue channel (0-255)

Returns the colorRGB object.

### rgba(r, g, b[, a])

- __r__ `<number>` - red channel (0-255)
- __g__ `<number>` - green channel (0-255)
- __b__ `<number>` - blue channel (0-255)
- __a__ `<number>` __*Default:*__ `255` - alpha channel (0-255)

Returns the colorRGBA object.

### colorRGB.toString()
### colorRGBA.toString()

Returns the color as a string.

```javascript
const color = rgb(255, 255, 255);
console.log(color.toString());
// "rgb(255, 255, 255)"
```

```javascript
const color = rgba(255, 255, 255, 255);
console.log(color.toString());
// "rgba(255, 255, 255, 255)"
```

### colorRGBA.toStringCSS()

Returns the color converted to a string in CSS color type, where alpha channel is between 0 and 1.

```javascript
const color = rgba(255, 255, 255, 255);
console.log(color.toStringCSS());
// "rgba(255, 255, 255, 1)"
```

### count(object)

- __object__ `<array> | <object>` - an array or an object

Returns the amount of filled slots in the given object.

### copy(object)

- __object__ `<object>` (`<object> | <RectJS.Vector2>`) - JavaScript-object

Returns the copy of a 1D JavaScript-object or RectJS.Vector2.

### log()

THe reference to __console.log()__.

### RectJS.isObject(object)

- __object__ `<object>` - JavaScript-object

Returns `true` if the argument is a game object.

### RectJS.checkSourceLoaded()

In loader mode `RectJS.LOADER_MODE` checks for sources that wasn't loaded yet. If they are - `RectJS.sourceLoaded` sets to `false`, otherwise - `true`.

## Cameras and layers

### new RectJS.Camera(options)

- __options__ `<object>` __*Default:*__ `new Object()`
	- __pos__ `<object>` (`<RectJS.Vector2` | `<RectJS.vec2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - a camera position on a scene
	- __id__ `<string>` __*Default:*__ `"camera_{camera number}"` - camera identifier

Returns the Camera object.

### Camera.set()

Switching to the camera.

### new RectJS.Layer(scene[, parallax[, scale[, id[, options]]]])

- __scene__ `<object>` (`<RectJS.Scene>`) - the layer scene
- __paralalx__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(100, 100)` - percentage of the layer parallax
- __scale__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(1, 1)` - the layer scaling
- __id__ `<string>` __*Default:*__ `"layer_{номер слоя}"` - layer identifier
- __options__ `<object>` __*Default:*__ `new Object()`
	- __visible__ `<boolean>` __*Default:*__ `true` - layer visibility
	
Returns a Layer object.
__WARNING!__ The RE-5 renderer draw all the layers in order of their initialization.

### new RectJS.Group(layer[, id])

- __layer__ - the layer of the group
- __id__ __*Default:*__ `"group_{group number}"`

Returns a rendering group. Rendering groups can help you to increase the performance by reducing unnecessary draw calls. If you have lost of different object on the layer you can add the objects with similar appearences to the render group, to optimize the rendering order. Pay attention to the following properties:

- Textures
- Shaders
- Vertices
- Colors
- Color modes

__!!!WARNING!!!__ If you move the object from one layer to another in runtime, make sure that you've removed it from all of the render groups. Mistakes like that can couse serious rendering bugs.

### Group.isset(o)

- __o__ `<object>` (`<RectJS.Sprite> | <RectJS.Polygon>`) - a game object

Returns `true` if the game object is apart of the group, otherwise it returns `false`.

### Group.add(o)

- __o__ `<object>` (`<RectJS.Sprite> | <RectJS.Polygon>`) - a game object

Adds an object to the group.

__!!!WARNING!!!__ Use this method only if you want object to be rendered several times on a single frame. Make sure you know what are you doing.

### Group.set(o)

- __o__ `<object>` (`<RectJS.Sprite> | <RectJS.Polygon>`) - a game object

Adds an object to the group and removes it from all of its current groups.

### Group.remove(o)

- __o__ `<object>` (`<RectJS.Sprite> | <RectJS.Polygon>`) - a game object

Removes an object from the group.

## Game objects

### new RectJS.Polygon(options)

- __options__ `<object>`
	- __pos__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - position on the scene
	- __vertices__ `<array>` [`<RectJS.Vector2>`, ...] __*Default:*__ `new Array()` - array of the vertices
	- __scale__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(1, 1)` - object scaling
	- __angle__ `<number>` __*Default:*__ `0` - angle (degrees)
	- __origin__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - origin offset
	- __points__ `<array>` [`<RectJS.Vector2>`, ...] __*Default:*__ `new Array()` - bounding points
	- __texture__ `<object>` (`RectJS.Texture`) __*Default:*__ `null` - texture
	- __color__ `<arrat>` (`<rgb> | <rgba>`) __*Default:*__ `rgb(255, 255, 255)` - color
	- __colors__ `<array>` [`<rgb> | <rgba>`, ...] __*Default:*__ `[...this.color]` - Array with color of every single vertex. Works only if __colorMode__ = `"VERTEX"`!
	- __colorMode__ `<string>` __*Default:*__ `SINGLE` - Color mode. Theres're 3 modes:
		- `"SINGLE"` - the object is entirely filled with one single color. Amount of objects with different colors doesn't affect on the performance.
		- `"UNIFORM"` - useful in case when there are a lot of objects with the same color, on a large scale increases the performance.
		- `"VERTEX"` - works almost like "SINGLE", but allows to color every single vertex (colors set in the __colors__ property)
	- __filters__ `<array>` [`<rgb> | <rgba>`, ...] __*Default:*__ `new Array()` - array with color filters
	- __opacity__ `<number>` __*Default:*__ `100` - percentage of the opacity
	- __render__ `<boolean>` __*Default:*__ `true` - object visibility
	- __layer__ `<object>` (`<RectJS.Layer>`) - object layer
	- __id__ `<string>` __*Default:*__ `"object_{object number}"` - object unique identifier
	- __textOverlap__ `<boolean>` __*Default:*__ `false` - texts overlapping
	- __families__ `<array>` [`<RectJS.Family>`, ...] __*Default:*__ `new Array()` - object families
	- __program__ `<object>` (`<RectJS.Program>`) __*Default:*__ `RectJS.renderer.programs["DEFAULT"]` - shader program (large amount of different shaders on the scene decreases the performane)
	- __private__ `<object>` __*Default:*__ `new Object()` - object with custom properties and methods.
		- __init__ `<function>` __*Default:*__ `undefined` - runs after the object created

Polygon object creation. Returns the game Object.

```javascript
var object = new rjs.Polygon({
	...
	private: {
		test: 123,
		init: function () {
			console.log(this.text);
			// "123"
		}
	}
});

console.log(object.test);
// "123"
```

You can access any parameter of an object (except of __private__) as it's property using point. Parameters and methods from __private__ object become regular object properties (check the code above).

### new RectJS.Sprite(options)

- __options__ `<object>`
	- __pos__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - position on the scene
	- __size__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - size of the sprite
	- __scale__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(1, 1)` - object scaling
	- __angle__ `<number>` __*Default:*__ `0` - angle (degrees)
	- __origin__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - origin offset
	- __points__ `<array>` [`<RectJS.Vector2>`, ...] __*Default:*__ `new Array()` - bounding points
	- __texture__ `<object>` (`RectJS.Texture`) __*Default:*__ `null` - texture
	- __color__ `<arrat>` (`<rgb> | <rgba>`) __*Default:*__ `rgb(255, 255, 255)` - color
	- __colors__ `<array>` [`<rgb> | <rgba>`, ...] __*Default:*__ `[...this.color]` - Array with color of every single vertex. Works only if __colorMode__ = `"VERTEX"`!
	- __colorMode__ `<string>` __*Default:*__ `SINGLE` - Color mode. Theres're 3 modes:
		- `"SINGLE"` - the object is entirely filled with one single color. Amount of objects with different colors doesn't affect on the performance.
		- `"UNIFORM"` - useful in case when there are a lot of objects with the same color, on a large scale increases the performance.
		- `"VERTEX"` - works almost like "SINGLE", but allows to color every single vertex (colors set in the __colors__ property)
	- __filters__ `<array>` [`<rgb> | <rgba>`, ...] __*Default:*__ `new Array()` - array with color filters
	- __opacity__ `<number>` __*Default:*__ `100` - percentage of the opacity
	- __render__ `<boolean>` __*Default:*__ `true` - object visibility
	- __layer__ `<object>` (`<RectJS.Layer>`) - object layer
	- __id__ `<string>` __*Default:*__ `"object_{object number}"` - object unique identifier
	- __textOverlap__ `<boolean>` __*Default:*__ `false` - texts overlapping
	- __families__ `<array>` [`<RectJS.Family>`, ...] __*Default:*__ `new Array()` - object families
	- __program__ `<object>` (`<RectJS.Program>`) __*Default:*__ `RectJS.renderer.programs["DEFAULT"]` - shader program (large amount of different shaders on the scene decreases the performane)
	- __private__ `<object>` __*Default:*__ `new Object()` - object with custom properties and methods.
		- __init__ `<function>` __*Default:*__ `undefined` - runs after the object created
		
Rectangle shaped object (Sprite) creation. Returns a game Object.

### new RectJS.Text(options)

- __options__ `<object>`	
	- __pos__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - position on the scene
	- __size__ `<number>` - text size
	- __scale__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(1, 1)` - object scaling
	- __angle__ `<number>` __*Default:*__ `0` - angle (degrees)
	- __origin__ `<string>` __*Default:*__ `"center-middle"` - text align
	- __points__ `<array>` [`<RectJS.Vector2>`, ...] __*Default:*__ `new Array()` - bounding points
	- __font__ `<string>` - text font
	- __text__ `<string>` - text content
	- __color__ `<arrat>` (`<rgb> | <rgba>`) __*Default:*__ `rgb(255, 255, 255)` - color
	- __filters__ `<array>` [`<rgb> | <rgba>`, ...] __*Default:*__ `new Array()` - array with color filters
	- __opacity__ `<number>` __*Default:*__ `100` - percentage of the opacity
	- __render__ `<boolean>` __*Default:*__ `true` - object visibility
	- __layer__ `<object>` (`<RectJS.Layer>`) - object layer
	- __id__ `<string>` __*Default:*__ `"object_{object number}"` - object unique identifier
	- __families__ `<array>` [`<RectJS.Family>`, ...] __*Default:*__ `new Array()` - object families
	- __private__ `<object>` __*Default:*__ `new Object()` - object with custom properties and methods.
		- __init__ `<function>` __*Default:*__ `undefined` - runs after the object created
		
Text creation. Returns a game Object.

### Object.destroy()

Destroying the object.

### Object.setLayer(layer)

- __layer__ `<object>` (`<RectJS.Layer>`) - new object layer

Changing a layer of the object

### Object.getPoint(id)

- __id__ `<number>` - bounding point index in the array `Object.points`

Returns the vector of bounding point position on the scene (according to it's transformations).

## Loops

### new RectJS.GameLoop(callback[, active[, scene[, absl]]])

- __callback__ `<function>` - callback function
- __active__ `<boolean>` __*Default:*__ `true` - loop status
- __scene__ `<object>` (`<RectJS.Scene>`) __*Default:*__ `null` - the loop works only on this scene. If = `null` - loop works on every scene in the game
- __absl__ `<boolean>` __*Default:*__ `false` - if `true` the loop works even in loader mode.

Game loop creation. Returns a loop object. `Loop.callback` runs synchronously before every single frame (if the is active of course)

### Loop.start()

Enable game loop.

### Loop.stop()

Disable game loop.

### new RectJS.Interval(callback, timeout[, active[, scene]])

- __callback__ `<function>` - interval callback
- __timeout__ `<number>` - interval in milliseconds
- __active__ `<boolean>` __*Default:*__ `true` - interval status
- __scene__ `<object>` (`<RectJS.Scene>`) __*Default:*__ `null` - the interval works only on this scene. If = `null` - the interval works on every scene in the game

Creation of the loop with given interval. Runs asynchronously.

### new RectJS.Wait(callback[, delay[, active[, scene[, absl]]]])

- __callback__ `<function>` - callback runs when the time is up
- __delay__ `<number>` __*Default:*__ `0` - delay in game ticks (~60/sec)
- __active__ `<boolean>` __*Default:*__ `true` - active status
- __scene__ `<object>` (`<RectJS.Scene>`) __*Default:*__ `null` -the delay works only on this scene. Если = `null` - the delay works on every scene in the game
- __absl__ `<boolean>` __*Default:*__ `false` - if `true` the delay works even in loader mode.

Crating a delay. Using that you can run some after the given delay set in milliseconds. Runs synchronously after all the loops and right before the scene rendering.

## Sources

### new RectJS.Texture(src[, scale[, custom_size]])

- __src__ `<string>` - relative path to the image file
- __scale__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(1, 1)` - source texture scaling, affects on the resolution of the texture
- __custom_size__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - absolute size of source texture, affects on the resolution of the texture. If = 0 - size will be set to the source image size automatically

Texture loading. Returns a source texture object.

### RectJS.Image(src[, scale[, custom_size]])

- __src__ `<string>` - relative path from the images directory (`RectJS.imagePath`, `Sources/images/` by default) to the image file
- __scale__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(1, 1)` - source texture scaling, affects on the resolution of the texture
- __custom_size__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - absolute size of source texture, affects on the resolution of the texture. If = 0 - size will be set to the source image size automatically

Texture loading. Returns a source texture object.

### new RectJS.Tiled(origin, size)

- __origin__ `<object>` (`RectJS.Texture`) - source texture
- __size__ `<object>` (`<RectJS.Vector2>`) - size of every single tile

Creation of the repeating texture. Returns a texture object.

### new RectJS.Crop(origin, pos, size)

- __origin__ `<object>` (`RectJS.Texture`) - source texture
- __pos__ `<object>` (`<RectJS.Vector2>`) - origin of the cropping area (its left-top corner)
- __size__ `<object>` (`<RectJS.Vector2>`) - size of the cropping area

Cropping a texture, one tiel from a tilemap for example. Returns a texture object.

### new RectJS.Animation(options)

- __options__ `<object>`
	- __frames__ `<array>` [`<RectJS.Texture>`, ...] __*Default:*__ `new Array()` - an array includes all of the frames
	- __speed__ `<number>` __*Default:*__ `60` - amount of animation frames per 60 game ticks
	- __id__ `<string>` __*Default*__ `"animation_{animation number}"` - animation indentifier
	
Animation creation. Returns an animation object.

You can access the index of the current frame using a `.currentIndex` property, you can set a certain frame by changing this property.
The speed of the animation can be accessed with `.speed` property, you can stop the animation, change its framerate or start it again by changing this property.

__WARNING!__ Animations in RE-5 aren't finished yet. All objects with a common animation will be animated at the time.

### RectJS.loadFont(name, src)

- __name__ `<string>` - unique name of the font
- __src__ `<string>` - path to the .ttf file

Loading a custom .ttf font. Returns the unique name of the font, you can pass it to the `font` property of a text object.

### RectJS.Font(name, src)

- __name__ `<string>` - unique name of the font
- __src__ `<string>` - relative path to the .ttf file from the fonts library (`RectJS.fontPath`, `Sources/fonts/` by default)

Loading a custom .ttf font. Returns the unique name of the font, you can pass it to the `font` property of a text object.

### RectJS.JSON(src)

- __src__ `<string>` - relative path to the JSON file from the fonts library (`RectJS.jsonPath`, `Sources/json/` by default)

Loading a JSON file. Returns an object with content of the JSON.

### new RectJS.Sound(src[, distance])

- __src__ `<string>` - path to the audio file
- __distance__ `<number>` __*Default*__ `100` - valume multiplier if the sound is bound to an object

Loading an external sound. Returns a sound object.

### RectJS.Audio(src[, distance])

- __src__ `<string>` - relative path to the audio file from the fonts library (`RectJS.audioPath`, `Sources/audio/` by default)
- __distance__ `<number>` __*Default*__ `100` - valume multiplier if the sound is bound to an object

Loading an external sound. Returns a sound object.

### Sound.play()

Start or resume the sound.

### Sound.stop()

Pause the sound.

### Sound.reset()

Stops the sound playing and reset the time.

### Sound.restart()

Restart the sound from the very beginning.

### Sound.getDuration()

Returns the sound duration (in milliseconds)

### Sound.setTime(time)

- __time__ `<number>` - time (in milliseconds)

Sets playing current time.

### Sound.getTime()

Returns current playing time (in milliseconds)

### Sound.setVolume(volume)

- __volume__ `<number>` - volume percentage (0-100)

Sets the sound volume.

### Sound.getVolume()

Returns the volume percentage.

### Sound.bind(object)

- __object__ `<object>` (`<RectJS.Polygon> | <RectJS.Sprite> | <RectJS.Text>`) - game object

Binds the sound to an object.

### Sound.unbind(object)

- __object__ `<object>` (`<RectJS.Polygon> | <RectJS.Sprite> | <RectJS.Text>`) - game object

Unbinds the sound from an object

## Shaders

### new RectJS.Shader(type, src, id)

- __type__ `<string>` - shader type
	`"VERTEX"` - vertex shader
	`"FRAGMENT"` - fragment shader
- __src__ `<string>` - path to the .glsl file
- __id__ `<string>` - identifier

Don't use identifier `"DEFAULT"` if you aren't aware of what you are doing.

Loading and compilation of the custom shader script.

### new RectJS.Program(options)

- __options__ `<object>` - settings
	- __vertex__ `<object> | <string>` (`<RectJS.Shader> | <RectJS.Shader.id>`) - vertex shader, if you wanna add default shader to this program set this to `"DEFAULT"`
	- __fragment__ `<object> | <string>` (`<RectJS.Shader> | <RectJS.Shader.id>`) - fragment shader, if you wanna add default shader to this program set this to `"DEFAULT"`
	- __id__ `<string>` - program identifier. Set it to `"DEFAULT"` if you wanna make this program default for all game objects.

Creates a custom shader program.

Shaders in RE-5 works on GLSL

## Vertex shader parameters

### attribute vec2 vertex
Take vertex coordinates
### attribute vec2 UV
Takes texture coords of a vertex
### attribute mat3 matrix
Takes a transformation matrix
### attribute vec4 color
Takes a color filter (if __RectJS.Object.colorMode__ = `"SINGLE" | "VERTEX"`)
### uniform bool colorMode
If __RectJS.Object.colorMode__ = `"UNIFORM"` - takes `true`, otherwise - `false`
### uniform vec4 uColor
Takes a color filter (if __RectJS.Object.colorMode__ = `"UNIFORM"`)
### varying vec4 vColor
Passes the necessary color filter to the fragment shader
### varying vec2 vUV
Passes the texture coords to the fragment shader

## Fragment shader parameters

### uniform sampler2D tex
Takes a texture
### varying vec4 vColor
Takes a color filter
### varying vec2 vUV
Takes texture coords

## Mouse and keyboard

### new RectJS.Click(callback[, active[, scene[, target]]])
Left click event
### new RectJS.RightClick(callback[, active[, scene[, target]]])
Right click event
### new RectJS.MouseDown(callback[, active[, scene[, target]]])
Event of pressing down the left mouse button
### new RectJS.MouseUp(callback[, active[, scene[, target]]])
Left mouse button release event
### new RectJS.MouseRightDown(callback[, active[, scene[, target]]])
Event of pressing down the right mouse button
### new RectJS.MouseRightUp(callback[, active[, scene[, target]]])
Right mouse button release event
### new RectJS.MouseWheelDown(callback[, active[, scene[, target]]])
Event of pressing down the middle mouse button (wheel)
### new RectJS.MouseWheelUp(callback[, active[, scene[, target]]])
Middle mouse button (wheel) release event
### new RectJS.MouseMove(callback[, active[, scene[, target]]])
Event of mouse movement
### new RectJS.Wheel(callback[, active[, scene[, target]]])
Mouse wheel scrolling event
### new RectJS.WheelUp(callback[, active[, scene[, target]]])
Mouse wheel scrolling up event
### new RectJS.WheelDown(callback[, active[, scene[, target]]])
Mouse wheel scrolling down event

- __callback__ `<function>` - callback, takes the default __event__ event object as a parameter
- __active__ `<boolean>` __*Defaut:*__ `true` - event listener status
- __scene__ `<object>` (`<RectJS.Scene>`) __*Defaut:*__ `null` - the scene of the listener. If = `null` - listener works on every scene.
- __target__ `<DOM>` __*Defaut:*__ `RectJS.eventDetector` - DOM-element which handles the listener

### new RectJS.MousePress(callback[, active[, scene]])
Left mouse button holding event.

- __callback__ `<function>` - callback, takes the default __event__ event object as a parameter
- __active__ `<boolean>` __*Defaut:*__ `true` - event listener status
- __scene__ `<object>` (`<RectJS.Scene>`) __*Defaut:*__ `null` - the scene of the listener. If = `null` - listener works on every scene.

### new RectJS.TouchStart(callback[, id[, active[, scene[, target]]]])
Touch start event
### new RectJS.TouchEnd(callback[, id[, active[, scene[, target]]]])
Touch end event
### new RectJS.TouchMove(callback[, id[, active[, scene[, target]]]])
Touch move event

- __callback__ `<function>` - callback, takes the default __event__ event object as a parameter
- __id__ `<number>` __*Defaut:*__ `null` - touch index. If = `null` - listener responds on all the touches
- __active__ `<boolean>` __*Defaut:*__ `true` - event listener status
- __scene__ `<object>` (`<RectJS.Scene>`) __*Defaut:*__ `null` - the scene of the listener. If = `null` - listener works on every scene.
- __target__ `<DOM>` __*Defaut:*__ `RectJS.eventDetector` - DOM-element which handles the listener

### new RectJS.KeyDown(callback[, key[, active[, scene[, target]]]])
Key down event
### new RectJS.KeyUp(callback[, key[, active[, scene[, target]]]])
Key up event

- __callback__ `<function>` - callback, takes the default __event__ event object as a parameter
- __key__ `<number>` __*Defaut:*__ `null` - `event.keyCode` of the key. If = `null` - listener responds on all the keys
- __active__ `<boolean>` __*Defaut:*__ `true` - event listener status
- __scene__ `<object>` (`<RectJS.Scene>`) __*Defaut:*__ `null` - the scene of the listener. If = `null` - listener works on every scene.
- __target__ `<DOM>` __*Defaut:*__ `RectJS.eventDetector` - DOM-element which handles the listener

### new RectJS.KeyPress(callback[, key[, active[, scene]]])
Key press event

- __callback__ `<function>` - callback, takes the default __event__ event object as a parameter
- __key__ `<number>` __*Defaut:*__ `null` - `event.keyCode` of the key. If = `null` - listener responds on all the keys
- __active__ `<boolean>` __*Defaut:*__ `true` - event listener status
- __scene__ `<object>` (`<RectJS.Scene>`) __*Defaut:*__ `null` - the scene of the listener. If = `null` - listener works on every scene.

__WARNING!__ All the constructors above return a `RectJS.Event` object.

Properties of `RectJS.Event`:
- __fnc__ `<function>` - listener __callback__
- __active__ `<boolean>` - listener status
- __scene__ `<object>` (`<RectJS.Scene>`) - the scene of the listener. If = `null` - listener works on every scene.
- __event__ `<eventListener>` - javascript event listener

### Event.start()

Starts the listener.

### Event.stop()

Stops the listener.

### RectJS.KeyPressed(key)

- __key__ `<number>` __*Defaut:*__ `null` - `event.keyCode` of the key. If = `null` - method responds of all the keys

Returns `true` if the given key is pressed.

### new RectJS.Mouse()

Returns the mouse object.

Properties of `RectJS.Mouse`:
- __x__ `<number>` - x position on the screen
- __y__ `<number>` - y position on the screen

### Mouse.get(layer[, scale[, parallax]])

- __layer__ `<obejct>` (`<RectJS.Layer>`) - layer to get the parallax and scaling values
- __scale__ `<object>` (`<RectJS.Vector2>`) __*Defaut:*__ `layer.scale` - scaling
- __parallax__ `<object>` (`<RectJS.Vector2>`) __*Defaut:*__ `layer.parallax` - percentage of parallax (0-100)

Returns the mouse position on a scene as a `RectJS.Vector2` (according to camera offset, layer parallax and scaling values).

### new RectJS.Touch();
Returns the reference to an array with all the touches.

Properties of a touch `(RectJS.Touch)[index]`:
- __x__ `<number>` - x position on the screen
- __y__ `<number>` - y position on the screen

### Touch[index].get(layer)

- __layer__ `<obejct>` (`<RectJS.Layer>`) - слой

Returns the touch point on a scene as a `RectJS.Vector2` (according to camera offset, layer parallax and scaling values).

__WARNING!__ Event system in RE-5 isn't finished yet, some of the methods about could work not correctly.

## Families and assets

### new RectJS.Family()

Creation of an objects family.

### Family.get(id)

- __id__ `<string>` - object id

Returns an object from the family.

### Family.getByIndex(index)

- __index__ `<number>` - object index in the family (in order of addition)

Returns an object from the family by its index.

### Family.isset(o)

- __o__ `<object>` (`<RectJS.Polygon> | <RectJS.Sprite> | <RectJS.Text>`) - game object

Checks if the object belongs to family.

### Family.for(callback)

- __callback__ `<function>` - callback, takes an object as a parameter

Runs the callback for every single object in the family

### Family.forNearTo(pos, callback[, dist])

- __pos__ `<object>` (`<RectJS.Vector2>`) - point
- __callback__ `<function>` - callback, takes an object as a parameter
- __dist__ `<number>` __*Default:*__ `100` - radius of a area around the point

Runs the callback for every object within a certain radius around the given point.

### Family.count()

Returns amount of objects in the family

### Family.add(object)

- __object__ `<object>` (`<RectJS.Polygon> | <RectJS.Sprite> | <RectJS.Text>`) - game object

Adds an object to the family

### Family.remove(object)

- __object__ `<object>` (`<RectJS.Polygon> | <RectJS.Sprite> | <RectJS.Text>`) - game object

Removes an object from the family

### new RectJS.Asset(options)

- __options__ `<obejct>` - settings
	- __type__ `<string>` - object type
		- `"Polygon"` - polygon
		- `"Sprite"` - tinged rectangle or sprite
		- `"Text"` - text object
	- __the rest of parameters are the same as in object constructor with the given type__

Returns the object constructor with the given settings:

### new Asset(options)

- __options__ `<object>` - set of options as it is in default object constructor

__WARNING!__ Properties given to the constructor overwrite asset's ones
__WARNING!__ When specifying colors or vectors in the asset there are only references in the object instance, so changing some properties of the vector or colors of one single object you can cause the same changes in all of the instances of this asset. To avoid this problem you can overwrite vectors or color when you change them.

Asset using example

```javascript
// creation of an asset
const BOX = new rjs.Asset({
	type: "Sprite",
	size: vec2(256, 256),
	color: rgb(100, 50, 255),
	private: {
		init: function () {
			// object's gonna rotate on 0 to 90 degrees after it's initialized
			this.angle = Math.random()*90;
		},
		name: "John"
	}
});

// create an object
const box1 = new BOX({
	pos: vec2(0, 0),
	layer: new_main
});

// create the second one
const box2 = new BOX({
	pos: vec2(500, 0),
	layer: new_main,
	private: {
		// specify another name
		name: "Jack"
	}
});

// change a property "x" of vector-typed parameter "size" of the second object
box2.size.x = 128;

log(box1.name);
// will get "John" (as it was in asset)

log(box2.name);
// will get "Jack" (as it was in instance)

log(box1.size.x);
// instead of default 256, we'll get 128,
// because we've changed a property of a vector attached to both "box1" and "box2"

log(box2.size.x);
// will get 128

```

## Collision detection

### RectJS.Collision(a, b)

- __a__ `<object>` (`<RectJS.Polygon> | <RectJS.Sprite> | <RectJS.Text>`) - game object
- __b__ `<object>` (`<RectJS.Polygon> | <RectJS.Sprite> | <RectJS.Text>`) - game object

Returns `false` if objects aren't collided, otherwise it returns an object with overlapping parameters

### RectJS.getBoundingBox(object[, calc_angle])

- __object__ `<object>` (`<RectJS.Polygon> | <RectJS.Sprite> | <RectJS.Text>`) - game object
- __calc_angle__ `<boolean>` __*Default:*__ `true` - considering an angle of the object

Returns a simplified bounding box as an plain javascript object either considering an angle nor not.

### RectJS.AABB(a, b)

- __a__ `<object>` (`RectJS.getBoundingBox`) - first bounding box
- __b__ `<object>` (`RectJS.getBoundingBox`) - second bounding box

Returns `true` if bounding boxes are collided

### RectJS.MouseOver(object)

- __object__ `<object>` (`<RectJS.Polygon> | <RectJS.Sprite> | <RectJS.Text>`) - game object

Returns `true` if mouse cursor is over the given object

# Engine properties

### RectJS.sourceHOST
`<string>` __*Default:*__ `""` - relative path to __*index.html*__, __*main.js*__, to engine and project folders

### RectJS.engineSource
`<string>` __*Default:*__ `"Engine/"` - path from __RectJS.sourceHOST__ directory to the engine folder

### RectJS.pluginSource
`<string>` __*Default:*__ `"Plugins/"` - path from __RectJS.sourceHOST__ directory to the plugins folder

### RectJS.scenePath
`<string>` __*Default:*__ `"Scenes/"` - path from __RectJS.sourceHOST__ directory tp the scenes folder

### RectJS.scriptPath
`<string>` __*Default:*__ `"Scripts/"` - path from __RectJS.sourceHOST__ directory to the scrips folder

### RectJS.imagePath
`<string>` __*Default:*__ `"Sources/images/"` - path from __RectJS.sourceHOST__ directory to the images folder

### RectJS.jsonPath
`<string>` __*Default:*__ `"Sources/json/"` - path from __RectJS.sourceHOST__ directory to the JSON folder

### RectJS.fontPath
`<string>` __*Default:*__ `"Sources/fonts/"` - path from __RectJS.sourceHOST__ directory to the fonts folder

### RectJS.audioPath
`<string>` __*Default:*__ `"Sources/audio/"` - path from __RectJS.sourceHOST__ directory tp the audio folder

### RectJS.container
`<DOM>` - div wich contain all the rendering canvases and event handlers

### RectJS.WebGL_Canvas
`<DOM>` - canvas for the WebGL graphics for sprites and polygons rendering

### RectJS.ctx2D_Canvas
`<DOM>` - canvas for rendering text using CanvasRenderingContext2D

### RectJS.eventDetector
`<DOM>` - div which is located on top of canvases and handles all the mouse and touch events

### RectJS.gl
`<object>` - WebGL2RenderingContext

### RectJS.ctx
`<object>` - CanvasRenderingContext2D

### RectJS.client.w
`<number>` __*Default:*__ `1920` - width of the viewport in units, which you can use to set the positions and sizes of game objects

### RectJS.client.h
`<number>` __*Default:*__ `1080` - height of the viewport in units, which you can use to set the positions and sizes of game objects

### RectJS.resolution.w
`<number>` __*Default:*__ `1536` - horizontal distance from the middle of canvas to its edge in real pixels

### RectJS.resolution.h
`<number>` __*Default:*__ `864` - vertical distance from the middle of canvas to its edge in real pixels

### RectJS.canvas_width
`<number>` - current width of the canvases

### RectJS.canvas_height
`<number>` - current height of the canvases

### RectJS.con_width
`<number>` - current width of the container

### RectJS.con_height
`<number>` - current height of the container

### RectJS.CLEAR_COLOR
`<object>` (`<rgba>`) - background color of the canvas

### RectJS.BG_COLOR
`<object>` (`<rgba>`) - background color of the page

### RectJS.scenes
`<object>` - object contains all the scenes

### RectJS.currentScene
`<object>` (`<RectJS.Scene>`) - reference to the current scene

### RectJS.layers
`<object>` - object, contains all the layers of every scene

### RectJS.sources
`<object>` - object, contains all external sources (except of fonts)

### RectJS.images
`<object>` - object, contains all primary images

### RectJS.textures
`<object>` - object, contains all the primary, secondary textures (created by cropping or looping the primery ones) and animations as well

### RectJS.LOADER_MODE
`<boolean>` __*Default:*__ `false` - loading screen mode

### RectJS.sourceLoaded
`<boolean>` - absence of sources still unloaded

### RectJS.timeStep
 `<number>` (`<integer>`) __*Default:*__ `1` - integer which represents amount of ticks per each requestAnimationFrame()
 
### RectJS.animations
`<object>` - object, contains all the animations

### RectJS.cameras
`<object>` - object, contains all the cameras

### RectJS.currentCamera
`<object>` (`<RectJS.camera>`) - reference to the current camera

### RectJS.waits
`<array>` - an array contains all the waits

### RectJS.gameLoops
`<array>` - an array contains all the game loops

### RectJS.CUT_FPS
`<boolean>` __*Default:*__ `false` - FPS limitation mode (not recomended)

### RectJS.MAX_FPS
`<number>` (`<integer>`) __*Default:*__ `60` - mazimum FPS (in FPS limitation mode)

### RectJS.SFRM
**S**ingle **F**rame **R**eqest **M**ode
`<boolean>` __*Default:*__ `true` - Single frame rendering request mode. If turn it off the rendering will run separately from main requestAnimationFrame. In rare cases it could increase the performance, but usually it decreases it and can couse some bugs.

### RectJS.events
`<array>` - an array contains all the event listeners

### RectJS.MousePressed
`<boolean>` - represents the status of left mouse button

### RectJS.RightMousePressed
`<boolean>` - represents the status of right mouse button

### RectJS.families
`<array>` - an array contains all the families

### RectJS.sounds
`<array>` - an array contains all the sounds

### RectJS.FPS
`<number>` - current FPS

### RectJS.render
`<function>` - rendering function of graphic engine

### RectJS.renderCore
`<object>` - class contains all the core methods of graphic engine

For compatibility with old plugins there's an old reference: __RectJS.renderTools__

### RectJS.renderer
`<object>` - interface of graphics engine

### RectJS.renderer.DRAWING_MODE
`<string>` __*Default:*__ `"mipmap"` - texture interpolation mode

- `mipmap` - mipmapping, generates loads automatically (lower performance)
- `linear` - bilinear interpolation (recomended for higher performance)
- `pixel` - without any interpolation (for pixelart projects)

### RectJS.renderer.DCPF
**D**raw **C**all **P**er **F**rame
`<number>` - amount of draw call per frame (text rendering doesn't count)

### RectJS.renderer.DEBUG_MODE
`<boolean>` __*Default:*__ `false` - rendering debug mode. Allows you to see how the rendering works step by step in purpose of making optimization

### RectJS.renderer.DEBUG_CONSOLE_MODE
`<boolean>` __*Default:*__ `"false` - this mode allows you to switch the frames with devTools

# Plugins

## What plugin consist of?

To work correctly the plugin should be in __*Plugins/*__*plugin_name*__*.rjs*__ folder. Plugin consist at least of 2 files:

- __*package.json*__ - JSON with plugin settings and some important information about it.
```JSON
{
	"name": "plugin_name",
	"version": "1.0.0",
	"main": "plugin.js",
	"settings": {
		
	}
}
```
- __*plugin.js*__ - its code.
```javascript
(plugin) => {

	
	const exports = plugin.exports = {}; // plugin interface
	const rjs = plugin.engine; // reference to the engine (`RectJS`)
	const pack = plugin.pack; // object converted from package.json
	const sets = plugin.pack.settings; // settings from the package.json
	const params = plugin.params; // plugin initialization parameters
	const global = plugin.global; // properties of this object become global methods after its initialization
	const code = plugin.code; // function from file plugin.js (this code)
	
	// here's gotta be some plugin code

}
```

## Including

### new RectJS.Plugin(name[, ...params])

- __name__ `<string>` - a plugins name set in __*package.json*__
- __...params__ - plugin initialization parameters. Described in its documentation.

Including a plugin. Returns an interface of the plugin `plugin.exports`.

__WARNING!__ All the plugins should be included in the __callback__ function of engine initializer if there's no different instructions in plugin's docs.

You can make plugin yourself or download already existing one on [our website](http://bss.epizy.com/page/?f=re5plugins&lang=en).

*© GameDev United*
