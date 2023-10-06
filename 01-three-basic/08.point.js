import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
// 目标：
//  1. 运用数学知识设计特定形状的星系

const gui = new dat.GUI()
// 一. 创建场景
const scene = new THREE.Scene()

// 二. 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30)
camera.position.set(0, 0, 10)
scene.add(camera)
// 三. 添加物体
const params = {
	count: 10000,
	size: 0.1,
	radius: 5,
	branch: 6,
	color: '#ff6030',
	rotateScale: 0.3,
	endColor: '#1b3984',
}
const centerColor = new THREE.Color(params.color)
const endColor = new THREE.Color(params.endColor)
// 载入纹理
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./textures/particles/1.png')
let geometry = null
let material = null
const generateGalaxy = () => {
	geometry = new THREE.BufferGeometry()
	// 点位置集合
	const positions = new Float32Array(params.count * 3)
	// 定点颜色
	const colors = new Float32Array(params.count * 3)
	// 循环生成点
	for (let i = 0; i < params.count; i++) {
		// 计算当前节点属于哪一角度
		const branchAngel = (i % params.branch) * ((Math.PI * 2) / params.branch)
		// 点往中间集中
		const distance = Math.random() * params.radius
		// 中间高两边低 (params.radius - distance)) / 5
		const randomX = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5
		const randomY = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5
		const randomZ = (Math.pow(Math.random() * 2 - 1, 3) * (params.radius - distance)) / 5
		const current = i * 3
		// branchAngel + distance * params.rotateScale 角度变大，对应的值改变就形成了弧度
		positions[current] = Math.cos(branchAngel + distance * params.rotateScale) * distance + randomX
		positions[current + 1] = 0 + randomY
		positions[current + 2] =
			Math.sin(branchAngel + distance * params.rotateScale) * distance + randomZ

		// 混合颜色，形成渐变色
		const mixColor = centerColor.clone()
		mixColor.lerp(endColor, distance / params.radius)

		colors[current] = mixColor.r
		colors[current + 1] = mixColor.g
		colors[current + 2] = mixColor.b
	}
	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
	geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
	// 创建材质
	material = new THREE.PointsMaterial({
		color: new THREE.Color(params.color),
		size: params.size,
		sizeAttenuation: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		map: texture,
		alphaMap: texture,
	})

	// 材质和形状，创建物体
	const points = new THREE.Points(geometry, material)
	scene.add(points)
}
generateGalaxy()

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 四. 渲染
const renderer = new THREE.WebGLRenderer()

renderer.shadowMap.enabled = true

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

function render() {
	controls.update()
	renderer.render(scene, camera)
	requestAnimationFrame(render)
}
// 调用渲染函数
render()

