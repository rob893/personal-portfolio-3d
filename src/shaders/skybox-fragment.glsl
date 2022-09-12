uniform samplerCube background;

varying vec3 vWorldPosition;

void main() {
  vec3 viewDirection = normalize(vWorldPosition - cameraPosition);
  vec3 stars = textureCube(background, viewDirection).xyz;

  gl_FragColor = vec4(stars, 1.0);
}