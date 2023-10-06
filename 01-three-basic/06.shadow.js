import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
// 目标：
//  1. 阴影添加
//  2. 平行光阴影属性
//  3. 聚光灯光源
//  4. 点光源

/**
 * 阴影的条件：
 * 1. 材质要满足对光照有反应
 * 2. 设置渲染器开启影音的计算 renderer.shadowMap.enabled = true
 * 3. 设置光照投射阴影 directionalLight.castShadow = true
 * 4. 设置物体投射阴影 sphere.castShadow = true
 * 5. 设置物体接收阴影 plane.receiveShadow = true
 */
// 一. 创建场景
const scene = new THREE.Scene()

// 二. 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 10)
scene.add(camera)

// 三. 添加物体
// 1.1 创建一个球
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const material = new THREE.MeshStandardMaterial()
const sphere = new THREE.Mesh(sphereGeometry, material)

// 1.5 设置物体投射阴影
sphere.castShadow = true

scene.add(sphere)

// 1.2 创建一个平面
const planeGeometry = new THREE.PlaneGeometry(10, 10)
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2

// 1.6 设置物体接收阴影
plane.receiveShadow = true

scene.add(plane)

// 添加光照
const light = new THREE.AmbientLight(0xffffff, 0.5) // 添加白光和强度
scene.add(light)

const gui = new dat.GUI()
//  ------ line -----
// // 2. 平行光阴影属性
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
// // 1.4 设置光照投射阴影
// directionalLight.castShadow = true
// directionalLight.position.set(5, 5, 5)

// directionalLight.shadow.radius = 20
// // 设置阴影贴图分辨率
// directionalLight.shadow.mapSize.set(2048, 2048)
// // 设置平行光投射相机的属性
// directionalLight.shadow.camera.near = 0.5
// directionalLight.shadow.camera.far = 500
// directionalLight.shadow.camera.top = 5
// directionalLight.shadow.camera.bottom = -5
// directionalLight.shadow.camera.left = -5
// directionalLight.shadow.camera.right = 5

// gui
// 	.add(directionalLight.shadow.camera, 'near')
// 	.min(0)
// 	.max(10)
// 	.step(0.1)
// 	.name('near')
// 	.onChange(value => {
// 		directionalLight.shadow.camera.updateProjectionMatrix()
// 	})
// scene.add(directionalLight)
//  ------ end line -----

//  ------ line -----
// 3. 直线光源
// const spotLight = new THREE.SpotLight(0xffffff, 1.0)
// spotLight.castShadow = true
// spotLight.position.set(5, 5, 5)
// spotLight.intensity = 100

// spotLight.shadow.radius = 20
// // 设置阴影贴图分辨率
// spotLight.shadow.mapSize.set(2048, 2048)
// // 灯光从它的位置（position）指向目标位置
// spotLight.target = sphere
// spotLight.angle = Math.PI / 6
// spotLight.distance = 0
// spotLight.penumbra = 0

// gui.add(sphere.position, 'x').min(-5).max(5).step(0.1)
// gui
// 	.add(spotLight, 'angle')
// 	.min(0)
// 	.max(Math.PI / 2)
// 	.step(0.1)
// gui.add(spotLight, 'distance').min(0).max(10).step(0.1)
// gui.add(spotLight, 'penumbra').min(0).max(10).step(0.1)
// gui.add(spotLight, 'decay').min(0).max(5).step(0.1)
// scene.add(spotLight)
//  ------ end line -----

//  ------ line -----
// 4. 点光源
const pointLight = new THREE.PointLight(0xffffff, 1.0)
pointLight.castShadow = true
// pointLight.position.set(2, 2, 2)
pointLight.intensity = 100

pointLight.shadow.radius = 20
// 设置阴影贴图分辨率
pointLight.shadow.mapSize.set(2048, 2048)

gui.add(sphere.position, 'x').min(-5).max(5).step(0.1)
gui.add(pointLight, 'distance').min(0).max(10).step(0.1)
gui.add(pointLight, 'decay').min(0).max(5).step(0.1)
// scene.add(pointLight)

// 创建一个ball
const smallBall = new THREE.Mesh(
	new THREE.SphereGeometry(0.2, 20, 20),
	new THREE.MeshBasicMaterial({ color: 0xffffff })
)
smallBall.position.set(2, 2, 2)
smallBall.add(pointLight)
scene.add(smallBall)
//  ------ end line -----

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 四. 渲染
const renderer = new THREE.WebGLRenderer()

// 1.3 渲染器开启影音的计算
renderer.shadowMap.enabled = true

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const clock = new THREE.Clock()
function render() {
	// 4. 实现光源动态调整
	const time = clock.getElapsedTime()
	smallBall.position.x = Math.sin(time) * 3
	smallBall.position.z = Math.cos(time) * 3
	smallBall.position.y = 2 + Math.sin(time) * 0.5
	controls.update()

	renderer.render(scene, camera)
	requestAnimationFrame(render)
}
// 调用渲染函数
render()

