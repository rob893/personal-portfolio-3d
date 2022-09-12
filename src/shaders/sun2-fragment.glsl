uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
uniform samplerCube uPerlin;
uniform vec3 sphereColor;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 eyeVector;
varying vec3 vNormal;
varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

float PI = 3.141592653;

vec3 brightnessToColor(float b) {
  b *= 0.25;

  return (vec3(b, b * b, b * b * b * b) / 0.25) * 0.8;
}

float fresnel(vec3 eyeVector, vec3 worldNormal) {
  return pow(1.0 + dot(eyeVector, worldNormal), 3.0);
}

float supersun() {
  float sun = 0.;

  sun += textureCube(uPerlin, vLayer0).r;
  sun += textureCube(uPerlin, vLayer1).r;
  sun += textureCube(uPerlin, vLayer2).r;
  sun *= 0.33;

  return sun;
}


void main() {
  float brightness = supersun();
  brightness = brightness * 4. + 1.;

  float fres = fresnel(eyeVector, vNormal);

  brightness += pow(fres, 0.8);

  vec3 color = brightnessToColor(brightness);
  gl_FragColor = vec4(color, 1.);
  //gl_FragColor = vec4(fres, 0.0, 0.0, 1.);
}