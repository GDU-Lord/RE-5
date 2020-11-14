attribute vec2 a_position;
attribute vec2 a_texcoord;
attribute vec4 a_color;

uniform mat3 u_matrix;

varying vec2 v_texcoord;
varying vec4 v_color;

void main () {
	
	gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
	
	v_texcoord = a_texcoord;
	v_color = a_color;
	
}