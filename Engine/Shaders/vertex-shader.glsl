attribute vec2 a_position;
attribute vec2 a_texcoord;

bool matrix_mode = true;

uniform mat3 u_matrix;

uniform vec2 u_proj_layer;
uniform vec2 u_pos;
uniform vec2 u_angle;
uniform vec2 u_scale;
uniform vec2 u_origin;

varying vec2 v_texcoord;

void main () {
	
	if(matrix_mode)
		gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
	else {
		vec2 pos = a_position + u_origin;
	  	vec2 pos1 = pos * u_scale;
	 	vec2 pos2 = vec2(pos1.x * u_angle.y + pos1.y * u_angle.x, pos1.y * u_angle.y - pos1.x * u_angle.x);
	  	vec2 pos3 = pos2 + u_pos;
	  	vec2 position = pos3 * u_proj_layer * 2.0;

	  	gl_Position = vec4(position * vec2(1, -1), 0, 1);
	}
	
	v_texcoord = a_texcoord;
	
}