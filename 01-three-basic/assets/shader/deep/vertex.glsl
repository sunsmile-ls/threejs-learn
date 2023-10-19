varying vec2 vUv;
precision lowp float;
void main(){
    vUv=uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}