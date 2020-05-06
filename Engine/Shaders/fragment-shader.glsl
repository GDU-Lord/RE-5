precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_opacity;
uniform vec4 u_filter;

varying vec2 v_texcoord;

void main () {

	gl_FragColor = texture2D(u_texture, v_texcoord) * u_filter;
	gl_FragColor.a *= u_opacity[0];
	gl_FragColor.rgb *= gl_FragColor.a;
	
}