import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
// 目标：
//  1. 初识点材质
//  2. 材质的点属性 // 为什么有阴影?
//  3. 星光点点
//  4. 漫天雪花

const gui = new dat.GUI()
// 一. 创建场景
const scene = new THREE.Scene()

// 二. 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 40)
camera.position.set(0, 0, 40)
scene.add(camera)
// 三. 添加物体
const sphereGeometry = new THREE.SphereGeometry(3, 20, 20)

function createPoints(url, size = 0.2) {
	// 1.1 设置点材质的大小
	const pointsMaterial = new THREE.PointsMaterial()

	//  ------ line -----
	// 3. 星光点点
	const particlesGeometry = new THREE.BufferGeometry()
	const count = 5000
	// 设置缓存数组
	const pointions = new Float32Array(count * 3)
	// 设置color 属性
	const colors = new Float32Array(count * 3)
	for (let i = 0; i < count * 3; i++) {
		pointions[i] = (Math.random() - 0.5) * 100
		colors[i] = Math.random()
	}
	particlesGeometry.setAttribute('position', new THREE.BufferAttribute(pointions, 3))
	particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
	pointsMaterial.vertexColors = true // 设置单独颜色
	//  ------ end line -----

	//  ------ line -----
	// 2 属性
	pointsMaterial.size = size // 材质大小
	pointsMaterial.color.set(0xfff000) // 设置材质颜色
	pointsMaterial.sizeAttenuation = true // 相机深度而衰减

	// 载入纹理
	const textureLoader = new THREE.TextureLoader()
	const texture = textureLoader.load(`./textures/particles/${url}.png`)
	// 设置点材质的纹理
	pointsMaterial.map = texture
	pointsMaterial.alphaMap = texture // 设置透明度
	pointsMaterial.transparent = true // 定义此材质是否透明
	pointsMaterial.blending = THREE.AdditiveBlending // 点重叠后变的更亮
	pointsMaterial.depthWrite = false // 禁用重叠的影响
	//  ------ end line -----

	// 1.2 创建物体
	// const points = new THREE.Points(sphereGeometry, pointsMaterial)
	// 3.2 需要修改 sphereGeometry - particlesGeometry
	const points = new THREE.Points(particlesGeometry, pointsMaterial)
	scene.add(points)
	return points
}
const points = createPoints('1', 1.5)
const points2 = createPoints('xh', 1)
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)

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
	const time = clock.getElapsedTime()
	// 4. 漫天雪花，需要转动起来
	points.rotation.x = time * 0.3
	points2.rotation.x = time * 0.4
	renderer.render(scene, camera)
	requestAnimationFrame(render)
}
// 调用渲染函数
render()

