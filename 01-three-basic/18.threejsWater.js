import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Water } from 'three/examples/jsm/objects/Water2'

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import gsap from 'gsap'
import * as dat from 'dat.gui'

// 目标：three.js 水波纹

//创建gui对象
const gui = new dat.GUI()

// 初始化场景
const scene = new THREE.Scene()

// 创建透视相机
const camera = new THREE.PerspectiveCamera(90, window.innerHeight / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(5, 5, 5)
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix()
scene.add(camera)

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./textures/threejsWater/050.hdr', texture => {
	texture.mapping = THREE.EquirectangularReflectionMapping
	scene.background = texture
	scene.environment = texture
})
// 加载浴缸
const gltfLoader = new GLTFLoader()
gltfLoader.load('./textures/threejsWater/model/yugang.glb', gltf => {
	console.log(gltf)
	const yugang = gltf.scene.children[0]
	yugang.material.side = THREE.DoubleSide
	const waterGeometry = gltf.scene.children[1].geometry
	const water = new Water(waterGeometry, {
		color: '#ffffff',
		scale: 1,
		flowDirection: new THREE.Vector2(1, 1),
		textureHeight: 1024,
		textureWidth: 1024,
	})
	scene.add(water)
	scene.add(gltf.scene)
})
// 创建水平面平面
const water = new Water(new THREE.PlaneGeometry(1, 1, 64, 64), {
	flowDirection: new THREE.Vector2(1, 1),
	textureHeight: 1024,
	textureWidth: 1024,
})
water.rotation.x = -Math.PI / 2
console.log(water)
scene.add(water)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true })

// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)

// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener('resize', () => {
	//   console.log("resize");
	// 更新摄像头
	camera.aspect = window.innerWidth / window.innerHeight
	//   更新摄像机的投影矩阵
	camera.updateProjectionMatrix()

	//   更新渲染器
	renderer.setSize(window.innerWidth, window.innerHeight)
	//   设置渲染器的像素比例
	renderer.setPixelRatio(window.devicePixelRatio)
})

// 将渲染器添加到body
document.body.appendChild(renderer.domElement)

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼
controls.enableDamping = true
// 设置自动旋转
// controls.autoRotate = true;

const clock = new THREE.Clock()
function animate(t) {
	const elapsedTime = clock.getElapsedTime()
	//   console.log(elapsedTime);
	requestAnimationFrame(animate)
	// 使用渲染器渲染相机看这个场景的内容渲染出来
	renderer.render(scene, camera)
}

animate()

