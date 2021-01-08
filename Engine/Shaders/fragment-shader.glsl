precision mediump float;

uniform sampler2D u_texture;

varying vec3 v_opacity;
varying vec2 v_texcoord;
varying vec4 v_filter;

void main () {
	
	//gl_FragColor = vec4(1, 1, 1, 0.1);

	gl_FragColor = texture2D(u_texture, v_texcoord) * v_filter;
	gl_FragColor.a *= v_opacity[0];
	if(v_opacity[1] > 0.0)
		gl_FragColor.a *= 1.0-(v_texcoord.x)*v_opacity[1];
	else if(v_opacity[1] != 0.0)
		gl_FragColor.a *= 1.0-(1.0-v_texcoord.x)*-v_opacity[1];
	if(v_opacity[2] > 0.0)
		gl_FragColor.a *= 1.0-(v_texcoord.y)*v_opacity[2];
	else if(v_opacity[2] != 0.0)
		gl_FragColor.a *= 1.0-(1.0-v_texcoord.y)*-v_opacity[2];
	gl_FragColor.rgb *= gl_FragColor.a;

	
	
}