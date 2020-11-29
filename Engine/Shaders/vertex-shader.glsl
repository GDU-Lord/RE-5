attribute vec2 a_position;
attribute vec2 a_texcoord;
attribute vec4 a_filter;
attribute vec3 a_opacity;
attribute mat4 a_matrix;

varying vec2 v_texcoord;
varying vec4 v_filter;
varying vec3 v_opacity;

void main () {
	
	gl_Position = a_matrix * vec4(a_position, 0, 1);
	
	v_texcoord = a_texcoord;
	v_filter = a_filter;
	v_opacity = a_opacity;
	
}