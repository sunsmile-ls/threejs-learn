precision lowp float;

varying vec2 vUv;

void main(){
    // 1. 通过顶点对应的uv的 x, y 决定颜色
    // gl_FragColor = vec4(vUv, 0.0, 1.0);
    
    // 2. 默认颜色为 1, 默认为蓝色
    // gl_FragColor = vec4(vUv, 1, 1);

    // 3. 利用uv实现渐变效果,从左到右
    // float strength = vUv.x;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 4. 利用uv实现渐变效果,从下到上
    // float strength = vUv.y;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 5. 利用uv实现渐变效果,从上到下
    // float strength = 1.0 - vUv.y;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 6. 利用uv实现短范围内渐变，从零开始最小的距离完成渐变
    // float strength = vUv.y * 10.0;
    // gl_FragColor = vec4(strength, strength, strength, 1.0);

    // 7. 利用通过取模达到反复渐变效果
    // 解释：float v1 = vUv.y * 10.0 值为 1 - 10， strength = v1 % 1
    // float strength = mod(vUv.y * 10.0 , 1.0);
    // gl_FragColor =vec4(strength,strength,strength,1);

    // 8. 利用 step 实现反复渐变
    // float strength =  mod(vUv.y * 10.0, 1.0);
    // strength = step(0.5, strength); // step(edge, x) 的含义：如果 x < edge，返回 0.0，否则返回 1.0
    // gl_FragColor =vec4(strength, strength, strength, 1);

    // 9. 利用 step 实现反复渐变
    // float strength =  mod(vUv.x * 10.0 , 1.0);
    // strength = step(0.8, strength); // step(edge, x) 的含义：如果 x < edge，返回 0.0，否则返回 1.0
    // gl_FragColor =vec4(strength, strength, strength, 1);

    // 10. 条纹相加
    float strength = step(0.8, mod(vUv.x * 10.0 , 1.0));
    strength += step(0.8, mod(vUv.y * 10.0 , 1.0));
    gl_FragColor =vec4(strength, strength, strength, 1);

}