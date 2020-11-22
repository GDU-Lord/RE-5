precision mediump float;

uniform sampler2D u_texture;
uniform vec3 u_opacity;
uniform vec4 u_filter;

varying vec2 v_texcoord;

void main () {

	gl_FragColor = texture2D(u_texture, v_texcoord) * u_filter;
	gl_FragColor.a *= u_opacity[0];
	if(u_opacity[1] > 0.0)
		gl_FragColor.a *= 1.0-(v_texcoord.x)*u_opacity[1];
	else
		gl_FragColor.a *= 1.0-(1.0-v_texcoord.x)*-u_opacity[1];
	if(u_opacity[2] > 0.0)
		gl_FragColor.a *= 1.0-(v_texcoord.y)*u_opacity[2];
	else
		gl_FragColor.a *= 1.0-(1.0-v_texcoord.y)*-u_opacity[2];
	gl_FragColor.rgb *= gl_FragColor.a;
	
}