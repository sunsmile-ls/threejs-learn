import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import gsap from 'gsap'
import * as dat from 'dat.gui'

// 目标：孔明灯
// 1. 加载环境纹理
// 2. 孔明灯纹理

// 顶点着色器
import flylightVertexShader from './assets/shader/flylight/vertex.glsl?raw'
// 片元着色器
import flylightFragmentShader from './assets/shader/flylight/fragment.glsl?raw'

//创建gui对象
const gui = new dat.GUI()

// 初始化场景
const scene = new THREE.Scene()

// 创建透视相机
const camera = new THREE.PerspectiveCamera(90, window.innerHeight / window.innerHeight, 0.1, 1000)
// 设置相机位置
// object3d具有position，属性是1个3维的向量
camera.position.set(0, 0, 2)
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix()
scene.add(camera)

// 着色器抽取成文件
const shaderMaterial = new THREE.ShaderMaterial({
	vertexShader: flylightVertexShader,
	fragmentShader: flylightFragmentShader,
	side: THREE.DoubleSide,
	uniforms: {},
})

// 创建纹理加载器对象
// 1. 加载环境纹理
const rgbLoader = new RGBELoader()
rgbLoader.loadAsync('./textures/flylight/2k.hdr').then(texture => {
	// 圆柱反射映射,设置之后才可以旋转坐标轴跟随运动
	texture.mapping = THREE.EquirectangularReflectionMapping
	scene.background = texture
	scene.environment = texture
})

// 2. 孔明灯纹理
const gltfLoader = new GLTFLoader()
gltfLoader.load('./textures/flylight/model/flyLight.glb', gltf => {
	let lightBox = null
	scene.add(gltf.scene)
	console.log(gltf)
	lightBox = gltf.scene.children[0]
	lightBox.material = shaderMaterial
	for (let i = 0; i < 150; i++) {
		let flyLight = gltf.scene.clone(true)
		let x = (Math.random() - 0.5) * 300
		let z = (Math.random() - 0.5) * 300
		let y = Math.random() * 60 + 25
		flyLight.position.set(x, y, z)
		gsap.to(flyLight.rotation, {
			y: 2 * Math.PI,
			duration: 10 + Math.random() * 30,
			repeat: -1,
		})
		gsap.to(flyLight.position, {
			x: '+=' + Math.random() * 5,
			y: '+=' + Math.random() * 20,
			yoyo: true,
			duration: 5 + Math.random() * 10,
			repeat: -1,
		})
		scene.add(flyLight)
	}
})
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.outputEncoding = THREE.SRGBColorSpace // 控制输出渲染编码
renderer.toneMapping = THREE.ACESFilmicToneMapping // 设置色调，让亮暗更加的分明
renderer.oneMappingExposure = 0.1 // 色调曝光程度
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
controls.autoRotate = true

const clock = new THREE.Clock()
function animate(t) {
	const elapsedTime = clock.getElapsedTime()
	//   console.log(elapsedTime);
	requestAnimationFrame(animate)
	// 使用渲染器渲染相机看这个场景的内容渲染出来
	renderer.render(scene, camera)
}

animate()

