export const skyFragmentShader = `
uniform samplerCube background;

varying vec3 vWorldPosition;

void main() {
  vec3 viewDirection = normalize(vWorldPosition - cameraPosition);
  vec3 stars = textureCube(background, viewDirection).xyz;

  gl_FragColor = vec4(stars, 1.0);
}`;

export const skyVertexShader = `
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vWorldPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;
