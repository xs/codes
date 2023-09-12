varying vec4 vPosition;

void main() {
  if (vPosition.z < 0.) {
      csm_DiffuseColor = vec4(1.);
      return;
  }

  csm_DiffuseColor = vec4(.05, .13, .55, 1.0);
}