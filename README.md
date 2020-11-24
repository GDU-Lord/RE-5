# Введение

__Rect Engine 5__ (RE-5) - это объектно-ориентированый движок-фреймворк для разработки 2D игр на JavaScript. Графика в RE-5 работает основе WebGL2(ссылка) (браузерная адаптация OpenGL3.0(ссылка)). Движок подходит как для создания небольших игр так и для сложных многопользовательских проектов. В движке присутствует гибкая система плагинов, что может существенно расширить функционал движка. Больше проектов на RE-5 вы можете найти здесь: (ссылка).

# Создание проекта

- Установите любой локальный сервер или же воспользуйтесь небольшим сервером на Node.js (ссылка).
- Скачайте и установите движок на свой ПК (ссылка).
- Создайте папку для проекта и откройте её в командной строке.
- Введите команду:
```
rjs
```
- Дождитесь окончания загрузки
- Когда вы откроете проект в браузере должен появиться пурпурный вращающийся прямоугольник на сером фоне.

# Структура проекта

- __Engine__ (файлы движка)
	- __Shaders__ (шейдеры)
		- __fragment-shader.glsl__ (фрагментный шейдер)
		- __vertex-shader.glsl__ (вершинный шейдер)
	- __collision.js__ (обработка столкновений)
	- __engine.js__ (логика движка, интерфейс)
	- __renderer.js__ (отрисовка графики)
- __Plugins__ (плагины)
- __Scene__ (сцены)
	- __new__ (файлы сцены)
		- __end.js__ (срабатывает при каждом переходе с этой сцены на другую)
		- __init.js__ (срабатывает единажды при инициализации сцены)
		- __start.js__ (срабатывает при каждом старте сцены)
- __Scripts__ (скрипты)
	- __assets.js__ (скрыпт для создания и настройки ассетов)
	- __config.js__ (скрипт для настроек движка и проекта)
	- __families.js__ (скрипт для создания семей объектов)
	- __sources.js__ (скрипт для загрузки ресурсов)
- __Sources__ (ресурсы)
	- __audio__ (аудиофайлы)
	- __images__ (текстуры)
	- __json__ (JSON файлы)
- __index.html__ (запускает main.js)
- __main.js__ (инициализация движка, запуск всех скриптов)

# Архитектура

![alt text](https://github.com/BSS-Lord/RE-5/blob/master/re5architecture.png "Архитектура")

# Инициализация и игровой цикл

![alt text](https://github.com/BSS-Lord/RE-5/blob/master/re5logic.png "Инициализация и игровой цикл")

# Как устроен проект

В файле __*main.js*__ инициализируется движок, загружаются все скрипты из папки __*Scripts*__, создаются сцены, к сценам подключаются скрипты из папки __*Scenes/название сцены*__, осуществляется переход на нужную сцену.

В скрипте __*config.js*__ устанавливаются настройки движка и проекта в целом.

В скрипте __*families.js*__ создаются семьи объектов.

В скрипте __*sources.js*__ загружаются все нужные ресурсы (текстуры, звуки, шрифты...)

В скрипте __*assets.js*__ создаются/загружаются ассеты объектов.

Вы можете создавать свои скрипты в папке __*Scripts*__ или папках сцен и подключать их самостоятельно откуда вам угодно.

В папке каждой сцены лежит 3 файла:
- __*init.js*__ - скрипт выполняется единажды при инициализации сцены, здесь создается камера для сцены, слои и большинство объектов, создаётся игровой цикл сцены, нужные слушатели событий.
- __*start.js*__ - скрит выполняется при каждом запуске сцены, здесь игра переключается на нужную камеру, изменяются нужные параметры движка, происходит запуск уровня, расстановка врагов и т.д.
- __*end.js*__ - скрит выполняется при каждом переходе с этой сцены на другую, выключаются разные специальные параметры движка (как особый тип рендеринга или режим оптимизации), которые больше не нужны на других уровнях, может сохраняться игровой прогресс

# Основные методы

### new RectJS(callback)

- __callback__ `<function>` - принимает объект экземпляра движка перед его инициализацие

Инициализация движка

### require(src[, type])

- __src__ `<string>` - относительный путь к файлу
- __type__ `<string>` __*Default:*__ `"JS"` - тип файла
	- __"JS"__ - JavaScript. Метод возвращает функцию из скрипта.
	- __"JSON"__ - JSON файл. Метод возвращает JavaScript-объект из JSON файла.
	- __"TEXT"__ - Текстовый файл. Метод возвращает текст файла в виде строки.

__ВНИМАНИЕ!__ Каждый скрипт являет собою либо стрелочную функцию:
```javascript
(params) => {
	// код скрипта
}
```
либо функцию взятую в скобки:
```javascript
(function (params) {
	// код скрипта
})
```

__ВНИМАНИЕ!__ Чтобы переменная была доступна во всех скриптах она должна быть глобальной. Есть 3 способа сделать переменную глобальной:
- создать переменную без использования ключевого слова в любом скрипте (рекомендовано)
`variable = 1;`
- задать переменную как свойство объекта __window__
`window.variable = 1`
- создать переменную за пределами слушателя события "onload" в файле __*main.js*__
```javascript
var variable = 1;

window.addEventListener('load', e => {
...
```

### new RectJS.Scene(options)

- __options__ `<object>`
	- __id__ `<string>` __*Default:*__ `"scene_{номер сцены}"` - идентификатор сцены
	- __init__ `<function>` __*Default:*__ `() => {}` - скрипт, что выполнится при инициализации сцены, принимает объект сцены
	- __start__ `<function>` __*Default:*__ `() => {}` - скрипт, что выполнится при переходе на сцену, принимает объект сцены и объект с параметрами зауска сцены.
	- __end__ `<function>` __*Default:*__ `() => {}` - скрипт, что выполнится при переходе с этой сцены на другую, принимает объект сцены и объект с параметрами зауска окончания сцены.
	- __initOnload__ `<boolean>` __*Default:*__ `true`
		- __true__ - скрипт инициализации сцены запускается сразу после её создания
		- __false__ - скрипт инициализации сцены запускается перед сразу перед её первым запуском
		
Создание сцены. Возвращает объект сцены.

Пример скрипта инициализации сцены:
```javascript
(scene) => {
	
	// создание камеры
	
	// создание слоёв
	
	// создание объектов и циклов, игровая логика
	
}
```
Пример скрипта запуска и окончания сцены:
```javascript
(scene, params) => {
	
	// код
	
}
```

### Scene.set([startParams[ ,endParams]])

- __startParams__ `<object>` - параметры, что передаются в скрипт запуска сцены
- __endParams__ `<object>` - параметры, что передаются в скрипт окончания сцены

Переход на сцену

### Scene.update()

Обновление объектов на сцене. Выполняется автоматически при переходе на сцену.

### new RectJS.Vector2([x, y])

- __x__ `<number>` | `<string>` __*Default:*__ `0` - горизонтальная координата вектора
- __y__ `<number>` | `<string>` __*Default:*__ `0` - вертикальная координата вектора

Создание двухмерного вектора. Возвращает вектор в виде объекта.

### Vector2.toString()

Перевод вектора в формат строки. Возвращает вектор в виде строки. `"v{координата X};{координата Y}"`
```javascript
new rjs.Vector2(1, 3).toString() = "v1;3";
```

### Vector2.fromString(v)

- __v__ `<string>` - вектор в виде строки

Перевод вектора из строки в объект. Возвращает вектор в виде объекта.
```javascript
Vector2.fromString("v1;3") = new rjs.Vector2(1; 3);
```

### vec2([x, y])

Создание двухмерного вектора. Возвращает __new RectJS.Vector2(x, y)__.

### rgb(r, g, b)

- __r__ `<number>` - красный канал (0-255)
- __g__ `<number>` - зелёный канал (0-255)
- __b__ `<number>` - синий канал (0-255)

Создание цвета. Возвращает объект цвета.

### rgba(r, g, b[, a])

- __r__ `<number>` - красный канал (0-255)
- __g__ `<number>` - зелёный канал (0-255)
- __b__ `<number>` - синий канал (0-255)
- __a__ `<number>` __*Default:*__ `255` - альфа канал (0-255)

Создание цвета. Возвращает объект цвета.

### colorRGB.toString()
### colorRGBA.toString()

Возвращает цвет в виде строки.

```javascript
var color = rgb(255, 255, 255);
console.log(color.toString());
// получим в консоли "rgb(255, 255, 255)"
```

```javascript
var color = rgba(255, 255, 255, 255);
console.log(color.toString());
// получим в консоли "rgba(255, 255, 255, 255)"
```

### colorRGBA.toStringCSS()

Возвращает цвет в виде строки в формате CSS, где альфа канал в пределах от 0 до 1.

```javascript
var color = rgba(255, 255, 255, 255);
console.log(color.toStringCSS());
// получим в консоли "rgba(255, 255, 255, 1)"
```

### new RectJS.Camera(options)

- __options__ `<object>` - обязательный параметр!!!
	- __pos__ `<object>` (`<RectJS.Vector2` | `<RectJS.vec2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - позиция камеры на сцене
	- __id__ `<string>` __*Default:*__ `"camera_{номер камеры}"` - идентификатор камеры

Создание камеры. Возвращает объект камеры.

### Camera.set()

Переключение на кмеру.

### new RectJS.Layer(scene[, parallax[, scale[, id[, options]]]])

- __scene__ `<object>` (`<RectJS.Scene>`) - сцена слоя
- __paralalx__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(100, 100)` - проценты параллакса слоя по осям виде вектора
- __scale__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(1, 1)` - скейлинг слоя по осям виде вектора
- __id__ `<string>` __*Default:*__ `"layer_{номер слоя}"` - идентификатор слоя
- __options__ `<object>` __*Default:*__ `new Object()`
	- __visible__ `<boolean>` __*Default:*__ `true` - видимость слоя
	
Создание слоя.
__ВНИМАНИЕ!__ Слои отрисовываются в порядке инициализации.

### new RectJS.Polygon(options)

- __options__ `<object>`
	- __pos__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - позиция объекта на сцене в виде вектора
	- __vertices__ `<array>` [`<RectJS.Vector2>`, ...] __*Default:*__ `new Array()` - массив с вершинами многоугольника в виде векторов
	- __scale__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(1, 1)` - скейлинг объекта
	- __angle__ `<number>` __*Default:*__ `0` - поворот объекта в градусах
	- __origin__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - смещение центра обекта
	- __points__ `<array>` [`<RectJS.Vector2>`, ...] __*Default:*__ `new Array()` - точки привязки
	- __texture__ `<object>` (`RectJS.Texture`) __*Default:*__ `null` - текстура объекта
	- __color__ `<object>` (`<rgb> | <rgba>`) __*Default:*__ `rgb(255, 255, 255)` - цвет объекта
	- __filters__ `<array>` [`<rgb> | <rgba>`, ...] __*Default:*__ `new Array()` - массив с фильтрами цвета объекта в формате `rgb` или `rgba`
	- __opacity__ `<number>` __*Default:*__ `100` - проценты непрозрачности объекта
	- __opacityGradient__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - направление градиента прозрачности
	- __render__ `<boolean>` __*Default:*__ `true` - видимость объекта
	- __enable_chunks__ `<boolean>` __*Default:*__ `true` - привязка объекта к чанку в чанковом режиме
	- __layer__ `<object>` (`<RectJS.Layer>`) - слой объекта
	- __id__ `<string>` __*Default:*__ `"object_{номер объекта}"` - индентификатор объекта
	- __textOverlap__ `<boolean>` __*Default:*__ `false` - перекрыте текстов объектом
	- __families__ `<array>` [`<RectJS.Family>`, ...] __*Default:*__ `new Array()` - семьи к которым принадлежит объект
	- __private__ `<object>` __*Default:*__ `new Object()` - объект с дополнительными параметрами объекта и методами.
		- __init__ `<function>` __*Default:*__ `undefined` - срабатывает после создания объекта

Создание многоугольника. Возвращает игровой объект.

```javascript
var object = new rjs.Polygon({
	...
	private: {
		test: 123,
		init: function () {
			console.log(this.text);
			// в консоли получим "123"
		}
	}
});

console.log(object.test);
// в консоли получим "123"
```

Ко всем параметрам объекта кроме __private__ можно обратиться как к его свойствам. Те же что были в свойстве __private__ становятся свойствами и методаим самого объекта (как показано выше).

### new RectJS.Sprite(options)

- __options__ `<object>`
	- __pos__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - позиция объекта на сцене в виде вектора
	- __size__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - размеры спрайта
	- __scale__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(1, 1)` - скейлинг объекта
	- __angle__ `<number>` __*Default:*__ `0` - поворот объекта в градусах
	- __origin__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - смещение центра обекта
	- __points__ `<array>` [`<RectJS.Vector2>`, ...] __*Default:*__ `new Array()` - точки привязки
	- __texture__ `<object>` (`RectJS.Texture`) __*Default:*__ `null` - текстура объекта
	- __color__ `<object>` (`<rgb> | <rgba>`) __*Default:*__ `rgb(255, 255, 255)` - цвет объекта
	- __filters__ `<array>` [`<rgb> | <rgba>`, ...] __*Default:*__ `new Array()` - массив с фильтрами цвета объекта в формате `rgb`
	- __opacity__ `<number>` __*Default:*__ `100` - проценты непрозрачности объекта
	- __opacityGradient__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - направление градиента прозрачности
	- __render__ `<boolean>` __*Default:*__ `true` - видимость объекта
	- __enable_chunks__ `<boolean>` __*Default:*__ `true` - привязка объекта к чанку в чанковом режиме
	- __layer__ `<object>` (`<RectJS.Layer>`) - слой объекта
	- __id__ `<string>` __*Default:*__ `"object_{номер объекта}"` - индентификатор объекта
	- __textOverlap__ `<boolean>` __*Default:*__ `false` - перекрыте текстов объектом
	- __families__ `<array>` [`<RectJS.Family>`, ...] __*Default:*__ `new Array()` - семьи к которым принадлежит объект
	- __private__ `<object>` __*Default:*__ `new Object()` - объект с дополнительными параметрами объекта и методами.
		- __init__ `<function>` __*Default:*__ `undefined` - срабатывает после создания объекта
		
Создание прямоугольного объекта. Возвращает игровой объект.

### new RectJS.Text(options)

- __options__ `<object>`
	- __pos__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - позиция объекта на сцене в виде вектора
	- __size__ `<number>` - размер текста
	- __font__ `<string>` - шрифт текста
	- __text__ `<string>` - текст
	- __scale__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(1, 1)` - скейлинг объекта
	- __angle__ `<number>` __*Default:*__ `0` - поворот объекта в градусах
	- __origin__ `<string>` __*Default:*__ `"center-middle"` - выравнивание текста
	- __points__ `<array>` [`<RectJS.Vector2>`, ...] __*Default:*__ `new Array()` - точки привязки
	- __color__ `<object>` (`<rgb> | <rgba>`) __*Default:*__ `rgb(255, 255, 255)` - цвет текста
	- __filters__ `<array>` [`<rgb> | <rgba>`, ...] __*Default:*__ `new Array()` - массив с фильтрами цвета текста в формате `rgb` или `rgba`
	- __opacity__ `<number>` __*Default:*__ `100` - проценты непрозрачности объекта
	- __opacityGradient__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - направление градиента прозрачности
	- __render__ `<boolean>` __*Default:*__ `true` - видимость объекта
	- __enable_chunks__ `<boolean>` __*Default:*__ `true` - привязка объекта к чанку в чанковом режиме
	- __layer__ `<object>` (`<RectJS.Layer>`) - слой объекта
	- __id__ `<string>` __*Default:*__ `"object_{номер объекта}"` - индентификатор объекта
	- __families__ `<array>` [`<RectJS.Family>`, ...] __*Default:*__ `new Array()` - семьи к которым принадлежит объект
	- __private__ `<object>` __*Default:*__ `new Object()` - объект с дополнительными параметрами объекта и методами.
		- __init__ `<function>` __*Default:*__ `undefined` - срабатывает после создания объекта
		
Создание текста. Возвращает игровой объект.

### Object.destroy()

Удаление объекта.

### Object.setLayer(layer)

- __layer__ `<object>` (`<RectJS.Layer>`) - новый слой объекта

Перенос объекта на другой слой.

### Object.getPoint(id)

- __id__ `<number>` - индекс точки в массиве `Object.points`

Возвращает координаты привязаной к объекту точки в виде вектора (с учётом его смещения, угла наклона и прочего).

### Object.update()

Обновляет объект. Применяется в случае изменения позиций вершин многоугольника, изменения слоя через свойство __layer__ или изменение текстуры.

### new RectJS.GameLoop(callback[, active[, scene[, absl]]])

- __callback__ `<function>` - функция цикла
- __active__ `<boolean>` __*Default:*__ `true` - состояние цикла
- __scene__ `<object>` (`<RectJS.Scene>`) __*Default:*__ `null` - сцена на которой работает цикл. Если = `null` - цикл работает на всех сценах
- __absl__ `<boolean>` __*Default:*__ `false` - работа цикла в режиме ожидания загрузки ресурсов

Создание игрового цикла. Возвращает объект цикла. `Loop.callback` срабатывает перед отрисовкой каждого кадра (если цикл включён)

### Loop.start()

Запуск цикла

### Loop.stop()

Остановка цикла

### new RectJS.Texture(src[, scale[, custom_size]])

- __src__ `<string>` - относительный путь к файлу изображения
- __scale__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(1, 1)` - скейлинг исходной текстуры, влияет на разрешение текстуры
- __custom_size__ `<object>` (`<RectJS.Vector2>`) __*Default:*__ `new RectJS.Vector2(0, 0)` - размер исходной текстуры в пикселях, влияет на разрешение текстуры. Если равен нулю - размер подстроится под размер загруженого изображения

Загрузка текстуры. Возвращает объект текстуры.

### new Texture.tiled(size)

- __size__ `<object>` (`<RectJS.Vector2>`) - размер одного тайла на сцене

Создание зацикленного изображения из тайлов заданных размеров. Возвращает объект текстуры.

### new Texture.crop(pos, size)

- __pos__ `<object>` (`<RectJS.Vector2>`) - начальная позиция обрезания текстуры (левый верхний угол)
- __size__ `<object>` (`<RectJS.Vector2>`) - размер обрезоной текстуры в пикселях

Обрезка текстуры, например тайла из тайлмапа. Возвращает объект текстуры.

### new RectJS.Animation(options)

- __options__ `<object>`
	- __frames__ `<array>` [`<RectJS.Texture>`, ...] __*Default:*__ `new Array()` - массив с текстурами кадров анимации
	- __speed__ `<number>` __*Default:*__ `60` - количество кадров на 60 кадров отрисовки
	- __id__ `<string>` __*Default*__ `"animation_{номер анимации}"` -идентификатор анимации
	
Создание анимации. Возвращает объект анимации.

За текущий кадр конкретной анимации отвечает её свойство `.currentIndex`, изменяя его вы можете устанавливать кадр анимации.
За скорость отрисовкм отвечает свойство `.speed`, изменяя его вы можете останавливать анимацию, менять скорость, запускать её.

__ВНИМАНИЕ!__ Анимации в RE-5 ещё не доработаны. Все объекты с одной анимацией будут анимироваться синхронно.

### new RectJS.Click(callback[, active[, scene[, target]]])
Событие клика левой кнопой мишы
### new RectJS.RightClick(callback[, active[, scene[, target]]])
Событие клика правой кнопкой мишы
### new RectJS.MouseDown(callback[, active[, scene[, target]]])
Событие зажатия левой кнопки мыши
### new RectJS.MouseUp(callback[, active[, scene[, target]]])
Событие отпускания левой кнопки мыши
### new RectJS.MouseRightDown(callback[, active[, scene[, target]]])
Событие зажатия правой кнопки мыши
### new RectJS.MouseRightUp(callback[, active[, scene[, target]]])
Событие отпускания правой кнопки мыши
### new RectJS.MouseWheelDown(callback[, active[, scene[, target]]])
Событие зажатия колёсика мыши
### new RectJS.MouseWheelUp(callback[, active[, scene[, target]]])
Событие отпускания колёсика мыши
### new RectJS.MouseMove(callback[, active[, scene[, target]]])
Событие движения мыши
### new RectJS.Wheel(callback[, active[, scene[, target]]])
Событие прокручивания колёсика мыши
### new RectJS.WheelUp(callback[, active[, scene[, target]]])
Событие прокручивания колёсика мыши вверх
### new RectJS.WheelDown(callback[, active[, scene[, target]]])
Событие прокручивания колёсика мыши вниз

- __callback__ `<function>` - функция обработчик события, принимает  объект __event__ в качестве аргумента
- __active__ `<boolean>` __*Defaut:*__ `true` - состояние оработчика события
- __scene__ `<object>` (`<RectJS.Scene>`) __*Defaut:*__ `null` - сцена на которой обработчик события работает. Если = `null` - обработчик работает на всех сценах.
- __target__ `<DOM>` __*Defaut:*__ `RectJS.eventDetector` - DOM-элеммент, к которому привязан обработчик события

### new RectJS.MousePress(callback[, active[, scene]])
Событие удерживания левой кнопки мыши в зажатом положении.

- __callback__ `<function>` - функция обработчик события, принимает  объект __event__ в качестве аргумента
- __active__ `<boolean>` __*Defaut:*__ `true` - состояние оработчика события
- __scene__ `<object>` (`<RectJS.Scene>`) __*Defaut:*__ `null` - сцена на которой обработчик события работает. Если = `null` - обработчик работает на всех сценах.

### new RectJS.TouchStart(callback[, id[, active[, scene[, target]]]])
Событие начала нажатия
### new RectJS.TouchEnd(callback[, id[, active[, scene[, target]]]])
Событие окончания нажатия
### new RectJS.TouchMove(callback[, id[, active[, scene[, target]]]])
Событие движения нажатия

- __callback__ `<function>` - функция обработчик события, принимает  объект __event__ в качестве аргумента
- __id__ `<number>` __*Defaut:*__ `null` - индекс нажатия. Если = `null` - обработчик реагирует на все нажатия
- __active__ `<boolean>` __*Defaut:*__ `true` - состояние оработчика события
- __scene__ `<object>` (`<RectJS.Scene>`) __*Defaut:*__ `null` - сцена на которой обработчик события работает
- __target__ `<DOM>` __*Defaut:*__ `RectJS.eventDetector` - DOM-элеммент, к которому привязан обработчик события

### new RectJS.KeyDown(callback[, key[, active[, scene[, target]]]])
Событие зажатия клашвиши на клавиатуры
### new RectJS.KeyUp(callback[, key[, active[, scene[, target]]]])
Событие отпускания клашвиши на клавиатуры

- __callback__ `<function>` - функция обработчик события, принимает  объект __event__ в качестве аргумента
- __key__ `<number>` __*Defaut:*__ `null` - `event.keyCode` клавиши. Если = `null` - обработчик реагирует на все клавиши
- __active__ `<boolean>` __*Defaut:*__ `true` - состояние оработчика события
- __scene__ `<object>` (`<RectJS.Scene>`) __*Defaut:*__ `null` - сцена на которой обработчик события работает
- __target__ `<DOM>` __*Defaut:*__ `RectJS.eventDetector` - DOM-элеммент, к которому привязан обработчик события

### new RectJS.KeyPress(callback[, key[, active[, scene]]])
Событие удерживания клавиши на клавиатуре в зажатом положении

- __callback__ `<function>` - функция обработчик события, принимает  объект __event__ в качестве аргумента
- __key__ `<number>` __*Defaut:*__ `null` - `event.keyCode` клавиши. Если = `null` - обработчик реагирует на все клавиши
- __active__ `<boolean>` __*Defaut:*__ `true` - состояние оработчика события
- __scene__ `<object>` (`<RectJS.Scene>`) __*Defaut:*__ `null` - сцена на которой обработчик события работает. Если = `null` - обработчик работает на всех сценах.

__ВНИМАНИЕ!__ Все вышеуказанные события при создании вовзращают объект типа `RectJS.Event`.

Свойства `RectJS.Event`:
- __fnc__ `<function>` - __callback__ обработчика
- __active__ `<boolean>` - состояние оработчика события
- __scene__ `<object>` (`<RectJS.Scene>`) - сцена на которой обработчик события работает. Если = `null` - обработчик работает на всех сценах
- __event__ `<eventListener>` - слушатель события

### Event.start()

Запуск обработчика.

### Event.stop()

Остановка обработчика.

### RectJS.KeyPressed(key)
Возвращает `true` если заданая клавиша на клавиатуре зажата.

- __key__ `<number>` __*Defaut:*__ `null` - `event.keyCode` клавиши. Если = `null` - метод реагирует на все клавиши

__ВНИМАНИЕ!__ Система событий в RE-5 немного не доработана, некоторые вещи могут работать некорректно.
