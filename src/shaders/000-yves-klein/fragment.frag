uniform float u_time;
varying vec4 vPosition;

void main() {
  // comment
  gl_FragColor = vec4(fract(u_time / 2.), .13, .55, 1.0);
}