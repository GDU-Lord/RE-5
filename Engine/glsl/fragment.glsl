precision mediump float;

uniform sampler2D tex;

varying vec4 vColor;
varying vec2 vUV;

void main (void) {

    gl_FragColor = texture2D(tex, vUV)*vColor;

    gl_FragColor.rgb *= gl_FragColor.a;

}