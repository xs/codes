uniform float u_time;
varying vec4 vPosition;

void main() {
  gl_FragColor = vec4(vec3(vPosition.x), 1.0);
}