import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

// 目标：
//  1. 环境贴图
//  2. 给环境添加背景和贴图
//  3. hdr（高动态范围的显示技术。可以呈现不同的曝光度）单个文件图片的加载

// 一. 创建场景
const scene = new THREE.Scene()

// 二. 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 10)
scene.add(camera)

// 1.1 加载CubeTexture的一个类
const cubeTextureLoader = new THREE.CubeTextureLoader()
const envMapTexture = cubeTextureLoader.load([
	'/textures/env/posx.jpg',
	'/textures/env/negx.jpg',
	'/textures/env/posy.jpg',
	'/textures/env/negy.jpg',
	'/textures/env/posz.jpg',
	'/textures/env/negz.jpg',
])
// 三. 添加物体
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const material = new THREE.MeshStandardMaterial({
	roughness: 0.1, // 粗糙度设置
	metalness: 0.7, // 金属度
	// envMap: envMapTexture, // 1.2 设置环境贴图
})
const sphere = new THREE.Mesh(sphereGeometry, material)
scene.add(sphere)

// 2.1 给场景添加背景
scene.background = envMapTexture
// 2.2 给场景所有的物体添加默认的贴图
scene.environment = envMapTexture

// 3.1 加载loader
const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync('/textures/env/1k.hdr').then(texture => {
	// 单张图的话，需要告诉贴图为 EquirectangularReflectionMapping 映射贴图
	texture.mapping = THREE.EquirectangularReflectionMapping
	scene.background = texture
	scene.environment = texture
})

// 添加光照
const light = new THREE.AmbientLight(0xffffff, 0.5) // 添加白光和强度
scene.add(light)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(10, 10, 10)
scene.add(directionalLight)

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 四. 渲染
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

function render(time) {
	controls.update()

	renderer.render(scene, camera)
	requestAnimationFrame(render)
}
// 调用渲染函数
render()

