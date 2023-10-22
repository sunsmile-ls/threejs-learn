precision lowp float;

uniform float uTime;
uniform float uScale;
varying vec2 vUv;

// 随机函数
float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

// 旋转函数
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

#define PI 3.1415926535897932384626433832795

// 噪声函数
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}


//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

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
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 8. 利用 step 实现反复渐变
    // float strength =  mod(vUv.y * 10.0, 1.0);
    // strength = step(0.5, strength); // step(edge, x) 的含义：如果 x < edge，返回 0.0，否则返回 1.0
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 9. 利用 step 实现反复渐变
    // float strength =  mod(vUv.x * 10.0 , 1.0);
    // strength = step(0.8, strength); // step(edge, x) 的含义：如果 x < edge，返回 0.0，否则返回 1.0
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 10. 条纹相加
    // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
    // strength += step(0.8, mod(vUv.y * 10.0, 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 11. 条纹相乘
    // float strength = step(0.8, mod(vUv.x * 10.0 , 1.0));
    // strength *= step(0.8, mod(vUv.y * 10.0 , 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 12. 条纹相减
    // float strength = step(0.8, mod(vUv.x * 10.0 , 1.0));
    // strength -= step(0.8, mod(vUv.y * 10.0 , 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 13. 方块图形
    // float strength = step(0.2, mod(vUv.x * 10.0 , 1.0));
    // strength *= step(0.2, mod(vUv.y * 10.0 , 1.0));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 14. 利用绝对值
    // float strength = abs(vUv.x - 0.5);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 15. 取最小值
    // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 16. 取最大值
    // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 17. 四周白色，中间黑色正方形
    // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)))   ;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 18. 利用取整，实现条纹渐变
    // float strength = floor(vUv.x*10.0)/10.0;
    // gl_FragColor =vec4(strength,strength,strength,1);

    // float strength = floor(vUv.y*10.0)/10.0;
    // gl_FragColor =vec4(strength,strength,strength,1);

    // 19. 条纹相乘，实现渐变格子(向下取整)
    // float strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;
    // gl_FragColor =vec4(strength, strength, strength, 1);

    // 20. 条纹相乘，实现渐变格子(向上取整)
    // float strength = ceil(vUv.x * 10.0) / 10.0 * ceil(vUv.y * 10.0) / 10.0;
    // gl_FragColor =vec4(strength, strength, strength, 1);

    // 21. T 形图（重点）
    // float barX = step(0.4, mod((vUv.x+uTime*0.1) * 10.0 , 1.0))*step(0.8, mod(vUv.y * 10.0 , 1.0)) ;
    // float barX = step(0.4, mod(vUv.x * 10.0 - 0.2 , 1.0)) * step(0.8, mod(vUv.y * 10.0 , 1.0));
    // float barY = step(0.4, mod(vUv.y * 10.0 , 1.0)) * step(0.8, mod(vUv.x * 10.0 , 1.0));
    // float strength = barX+barY;

    // gl_FragColor =vec4(strength,strength,strength,1);
    // gl_FragColor = vec4(vUv,1,strength);

    // 22. 随机效果
    // float strength = random(vUv);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 23. 格子 + 随机数
    // float strength = ceil(vUv.x * 10.0) / 10.0 * ceil(vUv.y * 10.0) / 10.0;
    // strength = random(vec2(strength, strength));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 24. 根据 length 函数 实现渐变(半径进行渐变)
    // float strength = length(vUv);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 25. 根据distance技术2个向量的距离
    // float strength = distance(vUv, vec2(0.5, 0.5));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 26. 根据相除，发光的点
    // float strength = 0.15 / distance(vUv, vec2(0.5, 0.5)) - 1.0;
    // gl_FragColor = vec4(strength, strength, strength, strength);

    // 27. 设置vUv水平或者竖直变量（水平拉伸）
    // .y - 0.5 表示垂直向上移动; 0.5 * 5 表示范围变为 0 ～ 5
    // float strength = 0.15 / distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    // gl_FragColor = vec4(strength, strength, strength, strength);

    // 28. 十字交叉的星星 
    // x 和 y 位置调换，相加表示亮度相加，亮点更亮
    // float  strength = 0.15 / distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    // strength += 0.15 / distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5, 0.5)) - 1.0;
    // gl_FragColor = vec4(strength, strength, strength, strength);

    // 29. 旋转飞镖，旋转uv
    // vec2 rotateUv = rotate(vUv, 3.14 * 0.25, vec2(0.5));
    // vec2 rotateUv = rotate(vUv, - uTime * 5.0, vec2(0.5));
    // float  strength = 0.15 / distance(vec2(rotateUv.x, (rotateUv.y - 0.5) * 5.0 + 0.5),vec2(0.5, 0.5)) - 1.0;
    // strength += 0.15 / distance(vec2(rotateUv.y, (rotateUv.x  -0.5) * 5.0 + 0.5),vec2(0.5, 0.5)) - 1.0;
    // gl_FragColor = vec4(strength, strength, strength, strength);

    // 30. 绘制圆 
    // + 0.25 表示半径变小 或者 0.5 变为 0.25
    // float strength = step(0.5, distance(vUv, vec2(0.5)) + 0.25);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 31. 绘制圆环
    // float strength = 1.0 - step(0.5, distance(vUv, vec2(0.5)) + 0.25); // 外面为黑色 + 内圆为白色
    // strength *= step(0.5, distance(vUv, vec2(0.5)) + 0.35); // 外面为白色 + 内圆为黑色
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 32. 渐变环
    // float strength = abs(distance(vUv, vec2(0.5)) - 0.25);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 33. 圆环
    // float strength = 1.0 - step(0.1, abs(distance(vUv, vec2(0.5)) - 0.25));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 34. 波浪环
    // vec2 waveUv = vec2(
    //     vUv.x,
    //     vUv.y + sin(vUv.x * 30.0) * 0.1 // 对 y 进行偏移
    // );
    // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25))   ;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 35. 冰淇淋丢地上的感觉
    // vec2 waveUv = vec2(
    //     vUv.x + sin(vUv.y * 30.0) * 0.1, // 对 x 进行偏移
    //     vUv.y + sin(vUv.x * 30.0) * 0.1 // 对 y 进行偏移
    // );
    // float strength = 1.0 - step(0.01, abs(distance(waveUv, vec2(0.5)) - 0.25))   ;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 36. 据角度显示视图
    // float angle = atan(vUv.x, vUv.y);
    // float strength = angle;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 37. 根据角度实现螺旋渐变
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = (angle + 3.14) / 6.28;
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 38. 实现雷达扫射
    // float alpha = 1.0 - step(0.5, distance(vUv, vec2(0.5)));
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
    // float strength = (angle + 3.14) / 6.28;
    // gl_FragColor = vec4(strength, strength, strength, alpha);

    // 39. 通过时间实现动态扫射
    // vec2 rotateUv = rotate(vUv, - uTime * 5.0, vec2(0.5));
    // float alpha = 1.0 - step(0.5, distance(vUv, vec2(0.5)));
    // float angle = atan(rotateUv.x - 0.5, rotateUv.y - 0.5);
    // float strength = (angle + 3.14) / 6.28;
    // gl_FragColor = vec4(strength, strength, strength, alpha);

    // 40. 万花筒
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / PI;
    // float strength = mod(angle * 10.0, 1.0);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 41. 光芒四射
    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (2.0 * PI);
    // float strength = sin(angle * 100.0);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 42. 使用噪声实现烟雾、波纹效果
    // float strength = noise(vUv);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 马赛克
    // float strength = noise(vUv * 10.0);
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 类似于黑白电视无台效果
    // float strength = step(0.5, noise(vUv * 100.0));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 通过时间设置波形
    // float strength = step(uScale, cnoise(vUv * 10.0+uTime));
    // gl_FragColor = vec4(strength,strength,strength,1);

    // 显微镜的效果
    // float strength = abs(cnoise(vUv * 10.0));
    // gl_FragColor = vec4(strength, strength, strength, 1);


    // 发光路径
    // float strength =1.0 - abs(cnoise(vUv * 10.0));
    // gl_FragColor = vec4(strength, strength, strength, 1);

    // 波纹效果
    // float strength = sin(cnoise(vUv * 10.0) * 5.0 + uTime);
    // gl_FragColor =vec4(strength, strength, strength, 1);

    //43. 使用混合函数混颜色
    vec3 purpleColor = vec3(1.0, 0.0, 1.0);
    vec3 greenColor = vec3(1.0, 1.0, 1.0);
    vec3 uvColor = vec3(vUv,1.0);
    float strength = step(0.9,sin(cnoise(vUv * 10.0)*20.0))  ;


    vec3 mixColor =  mix(greenColor,uvColor,strength);
    // gl_FragColor =vec4(mixColor,1.0);
    gl_FragColor =vec4(mixColor,1.0);
}