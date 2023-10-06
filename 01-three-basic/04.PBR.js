import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 目标：
//  1. 标准网格材质(MeshStandardMaterial) 需要添加光源
//  2. 利用置换贴图使门更加有层次感，更像3D
//  3. 粗糙度贴图，使表面更加的光滑
//  4. 金属的地方更像金属，是文件更像金属
//  5. 法线贴图，光的折射
//  6. 纹理进度管理

// 一. 创建场景
const scene = new THREE.Scene()

// 二. 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 10)
scene.add(camera)

// 6. 纹理进度管理
const manager = new THREE.LoadingManager()
manager.onLoad = function () {
	console.log('图片加载完成')
}
manager.onProgress = function (url, num, total) {
	console.log('图片加载中')
	console.log('图片加载完成：', url)
	console.log('图片加载进度', num)
	console.log('图片总数：', total)
	console.log('加载进度百分比：', ((num / total) * 100).toFixed(2))
}
manager.onError = function (e) {
	console.log('图片加载错误' + url)
}

// 三. 添加物体(geometry)
const textureLoader = new THREE.TextureLoader(manager)
const doorColorTexture = textureLoader.load('/textures/door/door.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAoTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
// 2.1 导入置换贴图
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
// 3.1 导入粗糙度贴图
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
// 4.1 导入金属贴图
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
// 5.1 导入法线贴图
const normalTexture = textureLoader.load('/textures/door/normal.jpg')

// 创建几何体
// 2.2 设置分段数， 节点越多越细腻
const geometry = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100)
// 1.1 创建 MeshStandardMaterial 材质
const material = new THREE.MeshStandardMaterial({
	color: 0xffff00,
	map: doorColorTexture,
	alphaMap: doorAlphaTexture, // 一张灰度纹理，用于控制整个表面的不透明度， 在设置了 transparent 后生效
	transparent: true, // 表示材质是否透明
	side: THREE.DoubleSide, // 默认只渲染前面，渲染两面需要单独设置
	aoMap: doorAoTexture, // 设置ao贴图属性
	displacementMap: doorHeightTexture, // 2.3 位移贴图会影响网格顶点的位置
	displacementScale: 0.1, // 2.4 位移贴图影响程度
	roughness: 1, // 3.3 粗糙度设置
	roughnessMap: roughnessTexture, // 3.2 粗糙度贴图
	metalness: 1, // 4.3 金属度
	metalnessMap: metalnessTexture, // 4.2 金属贴图
	normalMap: normalTexture, // 4.2 法线贴图
})
// 1.2 添加环境光
const light = new THREE.AmbientLight(0xffffff, 0.5) // 添加白光和强度
scene.add(light)
// 1.3 添加平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(10, 10, 10)
scene.add(directionalLight)

// 根据支架和材质创建几何体
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// 需要创建第二组uv
geometry.setAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2))

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

