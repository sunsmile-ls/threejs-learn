import * as THREE from 'three'
import gsap from 'gsap'
// 导入dat.gui
import * as dat from 'dat.gui'
import * as CANNON from 'cannon-es'

// 目标：
//  1. 立方体相互碰撞

console.log(CANNON)
const gui = new dat.GUI()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300)
// 设置相机位置
camera.position.set(0, 0, 18)
scene.add(camera)

const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial({
		color: 0xffffff,
	})
)

floor.position.set(0, -5, 0)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

// 创建物理世界
const world = new CANNON.World()
world.gravity.set(0, -9.8, 0)
// 设置物理材质
const cubeWorldMaterial = new CANNON.Material('cube')
const cubeArr = []
function createCube() {
	// 1. 创建物形状
	const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
	// 2. 创建材质
	const cubeMaterial = new THREE.MeshStandardMaterial({
		color: 0xffffff,
	})
	// 3. 创建物体
	const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
	cube.castShadow = true
	scene.add(cube)

	// 创建小球形状
	const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))

	// 创建物理世界的小球
	const cubeBody = new CANNON.Body({
		shape: cubeShape,
		position: new CANNON.Vec3(0, 0, 0),
		// 小球的质量
		mass: 1,
		// 小球的材质
		material: cubeWorldMaterial,
	})
	// 将物体添加到物理世界
	world.addBody(cubeBody)
	// 监听碰撞事件
	// 引入 audio
	const audio = new Audio('/assets/metalHit.mp3')
	cubeBody.addEventListener('collide', e => {
		console.log(e)
		// 获取碰撞强度
		const impactStrength = e.contact.getImpactVelocityAlongNormal()
		console.log(impactStrength)
		if (impactStrength > 2) {
			audio.volume = impactStrength / 20
			audio.currentTime = 0
			audio.play()
		}
	})
	cubeBody.applyLocalForce(
		new CANNON.Vec3(300, 0, 0), // 添加的力的大小和方向
		new CANNON.Vec3(0, 0, 0) // 施加的力所在的位置
	)
	cubeArr.push({
		mesh: cube,
		body: cubeBody,
	})
}
window.addEventListener('click', createCube)
// 创建物理世界的地面
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
const floorWorldMaterial = new CANNON.Material('plane')
floorBody.material = floorWorldMaterial
// 当质量设置为 0 的话，可以使得物体保持不动
floorBody.mass = 0
floorBody.addShape(floorShape)
// 地面位置
floorBody.position.set(0, -5, 0)
// 旋转地面位置
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
// 将物体添加到物理世界
world.addBody(floorBody)

// 设置材质的碰撞系数
const defaultContactMaterial = new CANNON.ContactMaterial(cubeWorldMaterial, floorWorldMaterial, {
	friction: 0.1,
	restitution: 0.7,
})
// 将材料的关联设置添加到物理世界
world.addContactMaterial(defaultContactMaterial)
//添加环境光和平行光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
dirLight.castShadow = true
scene.add(dirLight)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
	alpha: true,
})
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true

// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
// 设置时钟
const clock = new THREE.Clock()

function render() {
	renderer.render(scene, camera)
	// 渲染下一帧的时候就会调用render函数
	// 每次渲染的时候，更新位置
	const deltaTime = clock.getDelta()
	world.step(1 / 120, deltaTime)
	cubeArr.forEach(item => {
		item.mesh.position.copy(item.body.position)
		// 设置渲染的物体跟随物理的物体旋转
		item.mesh.quaternion.copy(item.body.quaternion)
	})
	requestAnimationFrame(render)
}

render()

// 监听画面变化，更新渲染画面
window.addEventListener('resize', () => {
	// 更新摄像头
	camera.aspect = window.innerWidth / window.innerHeight
	//   更新摄像机的投影矩阵
	camera.updateProjectionMatrix()

	//   更新渲染器
	renderer.setSize(window.innerWidth, window.innerHeight)
	//   设置渲染器的像素比
	renderer.setPixelRatio(window.devicePixelRatio)
})

