import * as THREE from 'three'
import gsap from 'gsap'
import * as dat from 'dat.gui'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 目标：
//  1. 几何体介绍
//     物体包含两部分（相当于灯笼，一部分是支架，一部分为装饰的布）
//     (1) 物体的形状
//     (2) 物体的材质
//     相关的属性都包含在 geometry.attributes 属性中，
//     包含 uv(材质相关)、position（位置相关）、normal（向量相关）
//  2. 利用 BufferGeometry 设置定点，创建矩形
//  3. 生成炫酷三角形

// 一. 创建场景
const scene = new THREE.Scene()

// 二. 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 10)
scene.add(camera)

// 三. 添加物体(geometry)

//  ------ line -----
// // 2. 利用 BufferGeometry 设置定点，创建矩形
// // 2.1 创建 geometry 对象
// const geometry = new THREE.BufferGeometry()
// // 2.2 设置定点（三个元素为一个定点，一个三角形有三个定点）
// const vertices = new Float32Array([
// 	-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
// ])
// // 2.3 利用缓存区属性对象设置属性
// geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
// // 2.4 创建材质
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
// // 2.5 根据支架和材质创建几何体
// const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)
//  ------ end line -----

//  ------ line -----
for (let i = 0; i < 50; i++) {
	//每个三角形需要三个定点，每3个定点，需要三个值
	const geometry = new THREE.BufferGeometry()
	const vertices = new Float32Array(9)
	for (let j = 0; j < 9; j++) {
		vertices[j] = Math.random() * 10 - 5
	}
	geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
	const color = new THREE.Color(Math.random(), Math.random(), Math.random())
	const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 })
	const cube = new THREE.Mesh(geometry, material)
	scene.add(cube)
}
//  ------ end line -----
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

