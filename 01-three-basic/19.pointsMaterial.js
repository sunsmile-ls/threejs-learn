import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import fragmentShader from './assets/shader/pointsMaterial/fragmentShader.glsl?raw'
import vertexShader from './assets/shader/pointsMaterial/vertexShader.glsl?raw'
// 目标：
//  1. 运用数学知识设计特定形状的星系

const gui = new dat.GUI()
// 一. 创建场景
const scene = new THREE.Scene()

// 二. 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30)
camera.position.set(0, 0, 5)
scene.add(camera)

// 三. 添加物体
// ------ line 使用 ShaderMaterial 创建点 ---------
// const geometry = new THREE.BufferGeometry()
// const positions = new Float32Array([0.0, 0.0, 0.0])
// geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
// const material = new THREE.ShaderMaterial({
// 	vertexShader,
// 	fragmentShader,
// 	transparent: true,
// 	sizeAttenuation: true,
// })

// const points = new THREE.Points(geometry, material)
// scene.add(points)
// ------ end line -------

const params = {
	count: 1000,
	size: 0.1,
	radius: 5,
	branches: 4,
	spin: 0.5,
	color: '#ff6030',
	outColor: '#1b3984',
}
let galaxyColor = new THREE.Color(params.color)
let outGalaxyColor = new THREE.Color(params.outColor)
// 载入纹理
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./textures/pointsMaterial/9.png')
const texture1 = textureLoader.load('./textures/pointsMaterial/10.png')
const texture2 = textureLoader.load('./textures/pointsMaterial/11.png')

let geometry = null
let material = null
let points = null
const generateGalaxy = () => {
	// 如果已经存在这些顶点，那么先释放内存，在删除顶点数据
	if (points !== null) {
		geometry.dispose()
		material.dispose()
		scene.remove(points)
	}
	geometry = new THREE.BufferGeometry()
	// 点位置集合
	const positions = new Float32Array(params.count * 3)
	// 定点颜色
	const colors = new Float32Array(params.count * 3)

	const scales = new Float32Array(params.count)
	//图案属性
	const imgIndex = new Float32Array(params.count)

	//   循环生成点
	for (let i = 0; i < params.count; i++) {
		const current = i * 3

		// 计算分支的角度 = (计算当前的点在第几个分支)*(2*Math.PI/多少个分支)
		const branchAngel = (i % params.branches) * ((2 * Math.PI) / params.branches)

		const radius = Math.random() * params.radius
		// 距离圆心越远，旋转的度数就越大
		// const spinAngle = radius * params.spin;

		// 随机设置x/y/z偏移值
		const randomX = Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3
		const randomY = Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3
		const randomZ = Math.pow(Math.random() * 2 - 1, 3) * 0.5 * (params.radius - radius) * 0.3

		// 设置当前点x值坐标
		positions[current] = Math.cos(branchAngel) * radius + randomX
		// 设置当前点y值坐标
		positions[current + 1] = randomY
		// 设置当前点z值坐标
		positions[current + 2] = Math.sin(branchAngel) * radius + randomZ

		const mixColor = galaxyColor.clone()
		mixColor.lerp(outGalaxyColor, radius / params.radius)

		//   设置颜色
		colors[current] = mixColor.r
		colors[current + 1] = mixColor.g
		colors[current + 2] = mixColor.b

		// 顶点的大小
		scales[current] = Math.random()

		// 根据索引值设置不同的图案；
		imgIndex[current] = i % 3
	}
	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
	geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
	geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
	geometry.setAttribute('imgIndex', new THREE.BufferAttribute(imgIndex, 1))

	// 创建材质
	material = new THREE.ShaderMaterial({
		vertexShader,
		fragmentShader,
		sizeAttenuation: true,
		vertexColors: true, // 传递 color 为 片元着色器
		depthWrite: false,
		blending: THREE.AdditiveBlending,
		uniforms: {
			uTexture: {
				value: texture,
			},
			uTexture1: {
				value: texture1,
			},
			uTexture2: {
				value: texture2,
			},
			uTime: {
				value: 0,
			},
		},
	})

	// 材质和形状，创建物体
	points = new THREE.Points(geometry, material)
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

const clock = new THREE.Clock()
function render() {
	controls.update()
	const elapsedTime = clock.getElapsedTime()
	material.uniforms.uTime.value = elapsedTime
	renderer.render(scene, camera)
	requestAnimationFrame(render)
}
// 调用渲染函数
render()

