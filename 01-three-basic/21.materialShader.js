import * as THREE from 'three'
import gsap from 'gsap'
import * as dat from 'dat.gui'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

// 目标：
//  1. 修改 three.js 中的材质着色器

// 一. 创建场景
const scene = new THREE.Scene()

// 二. 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 10);
scene.add(camera)

// 添加光照
const directionLight = new THREE.DirectionalLight('#ffffff',1)
directionLight.castShadow = true;
directionLight.position.set(0,0,200)
scene.add(directionLight)

// 三. 加载纹理 
const textureLoader = new THREE.TextureLoader();
// 添加环境纹理
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
  "./textures/environmentMaps/0/px.jpg",
  "./textures/environmentMaps/0/nx.jpg",
  "./textures/environmentMaps/0/py.jpg",
  "./textures/environmentMaps/0/ny.jpg",
  "./textures/environmentMaps/0/pz.jpg",
  "./textures/environmentMaps/0/nz.jpg",
]);
scene.environment = envMapTexture
scene.background = envMapTexture

// 添加加载模型纹理
const modelTexture = textureLoader.load('./textures/materialShader/LeePerrySmith.glb')
// 添加法向纹理
const normalTexture = textureLoader.load('./textures/materialShader/normal.jpg')
// 四. 添加物体
const material = new THREE.MeshStandardMaterial({
  map: modelTexture,
  normalMap: normalTexture,
})
// 加载模型 
const gltfLoader = new GLTFLoader()
gltfLoader.load('./textures/materialShader/LeePerrySmith.glb', gltf => {
  const mesh = gltf.scene.children[0]
  mesh.material = material
  mesh.castShadow = true
  scene.add(mesh)
})


const basicUnifrom = {
  uTime: {
    value: 0
  }
}
material.onBeforeCompile = (shader, render) => {
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
    `
  )
}

const plane = new THREE.Mesh(new THREE.PlaneGeometry(20,20), material)
plane.position.set(0,0,-6);
plane.receiveShadow = true;
scene.add(plane)
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 五. 渲染
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true;
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
