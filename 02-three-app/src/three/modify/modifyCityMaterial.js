import * as THREE from 'three'
import gsap from 'gsap'

export default function modifyCityMaterial(mesh) {
  mesh.material.onBeforeCompile = (shader) => {
    console.log(shader.vertexShader)
    console.log(shader.fragmentShader)
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      `
        #include <dithering_fragment>
        //#end#
    `
    );
    addGradColor(shader, mesh)
    addSpread(shader)
  }
}

function addGradColor(shader, mesh) {
  // 计算物体边界值
  mesh.geometry.computeBoundingBox()
  // 获取边界值
  const { min, max } = mesh.geometry.boundingBox
  const uHeight = max.y - min.y
  shader.uniforms.uTopColor = {
    value: new THREE.Color("#aaaeff"),
  }
  shader.uniforms.uHeight = {
    value: uHeight,
  }
  // 添加变量
  shader.vertexShader = shader.vertexShader.replace('#include <common>',
  `
  #include <common>
  varying vec3 vPosition;
  `)

  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
  `
  #include <begin_vertex>
  vPosition = position;
  `)

  // 修改片源着色器
  shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `
  #include <common>
  varying vec3 vPosition;
  uniform vec3 uTopColor;
  uniform float uHeight;
  `)
  shader.fragmentShader = shader.fragmentShader.replace('//#end#', `
  // 保存gl_FragColor
  vec4 distGradColor = gl_FragColor;
  // 设置混合的百分比
  float gradMix = (vPosition.y+uHeight/2.0)/uHeight;
  // 计算出混合颜色
  vec3 gradMixColor = mix(distGradColor.xyz,uTopColor,gradMix);
  gl_FragColor = vec4(gradMixColor,1);
  //#end#
  `)
}

// 添加建筑材质光波扩散特效
export function addSpread(shader, center = new THREE.Vector2(0, 0)) {
  // 添加中心点
  shader.uniforms.uSpreadCenter = {
    value: center
  }
  // 添加扩散时间
  shader.uniforms.uSpreadTime = {
    value: -2000,
  }
  // 添加光带宽度
  shader.uniforms.uSpreadWidth = {
    value: 40,
  }
  shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `
    #include <common>
    uniform vec2 uSpreadCenter;
    uniform float uSpreadTime;
    uniform float uSpreadWidth;
  `)
  shader.fragmentShader = shader.fragmentShader.replace('//#end#', `
  // 计算半径
  float spreadRadius = distance(vPosition.xz, uSpreadCenter);
  //  扩散范围的函数
  float spreadIndex = -(spreadRadius-uSpreadTime)*(spreadRadius-uSpreadTime)+uSpreadWidth;
  if(spreadIndex > 0.0) {
    gl_FragColor = mix(gl_FragColor,vec4(1,1,1,1),spreadIndex/uSpreadWidth);
  }
  //#end#
  `)
  gsap.to(shader.uniforms.uSpreadTime, {
    value: 800,
    duration: 3,
    ease: 'none',
    repeat: -1
  })
}