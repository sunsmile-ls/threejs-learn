import * as THREE from 'three'
import gsap from 'gsap'
import * as dat from 'dat.gui'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 目标：
//  1. 修改 three.js 中的材质着色器

// 一. 创建场景
const scene = new THREE.Scene()

// 二. 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 10)
scene.add(camera)

// 三. 添加物体(geometry)
const basicMaterial = new THREE.MeshBasicMaterial({
  color: '#ff0000',
  side: THREE.DoubleSide
})

// ------ line ------
const basicUnifrom = {
  uTime: {
    value: 0
  }
}
basicMaterial.onBeforeCompile = (shader, render) => {
  console.log(shader.vertexShader)
  console.log(shader.fragmentShader)
  // 使用 replace 替换 需要添加
  shader.uniforms.uTime = basicUnifrom.uTime
  shader.vertexShader = shader.vertexShader.replace('#include <common>', `
    #include <common>
    uniform float uTime;
  `)
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
    #include <begin_vertex>
    transformed.x += sin(uTime)* 2.0;
    transformed.z += cos(uTime)* 2.0;
    `
  )
}
// ------ end line ------ 

const floor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 64, 64), basicMaterial)
scene.add(floor)
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 四. 渲染
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
const clock = new THREE.Clock();
function render(time) {
	controls.update()
  const elapsedTime = clock.getElapsedTime()
  basicUnifrom.uTime.value = elapsedTime
	renderer.render(scene, camera)
	requestAnimationFrame(render)
}
// 调用渲染函数
render()

