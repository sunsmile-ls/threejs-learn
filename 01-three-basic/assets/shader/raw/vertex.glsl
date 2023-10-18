precision lowp float;
attribute vec3 position;
attribute vec2 uv;

// 所有节点共同使用的属性，使用 uniform
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

// 获取时间
uniform float uTime;


varying vec2 vUv;

// highp  -2^16 - 2^16
// mediump -2^10 - 2^10
// lowp -2^8 - 2^8

varying float vElevation;


void main(){
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );
    // modelPosition.x += 1.0;
    // modelPosition.z += 1.0;

    // modelPosition.z += modelPosition.x;
    // 控制顶点位置，打造波浪图形
    modelPosition.z = sin((modelPosition.x+uTime) * 10.0)*0.05;
    modelPosition.z += sin((modelPosition.y+uTime)  * 10.0)*0.05;
    // 传递 z 轴的高度，计算颜色
    vElevation = modelPosition.z;

    gl_Position = projectionMatrix * viewMatrix * modelPosition ;
}