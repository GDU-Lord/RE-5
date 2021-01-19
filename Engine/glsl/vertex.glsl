attribute vec2 vertex;
attribute vec2 UV;
attribute mat3 matrix;
attribute vec4 color;

uniform bool colorMode;
uniform vec4 uColor;

varying vec4 vColor;
varying vec2 vUV;

void main (void) {

    gl_Position = vec4((matrix*vec3(vertex, 1.0)).xy * vec2(1.0, -1.0), 0.0, 1.0);
    gl_PointSize = 10.0;

    if(colorMode)
        vColor = uColor;
    else
        vColor = color;

    vUV = UV;

}
