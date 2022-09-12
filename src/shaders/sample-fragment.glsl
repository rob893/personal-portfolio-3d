uniform vec3 sphereColor;

varying vec3 v_Normal;

void main() {
    // gl_FragColor = vec4(v_Normal, 1.0);
    gl_FragColor = vec4(sphereColor, 1.0);
}