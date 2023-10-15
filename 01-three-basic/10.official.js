import * as THREE from 'three'
import gsap from 'gsap'
// 导入dat.gui
import * as dat from 'dat.gui'

// 目标：打造3D官网
// 步骤：
// 1. 调整相机的位置、摄像机视锥体远端面
// 2. 盒子大小由1调整为2
// 3. cube 的位置调整
// 4. 渲染器变为透明
// 5. 旋转立方体
// 6. 复制炫酷三角形
// 7. 点光源
// 8. 添加动画
// 9. 字体加入动画
// 10. 移动动画

const gui = new dat.GUI()
// 1、创建场景
const scene = new THREE.Scene()

// 2、创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300)

// 设置相机位置
camera.position.set(0, 0, 18)
scene.add(camera)

const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshBasicMaterial({
	wireframe: true,
})
const redMaterial = new THREE.MeshBasicMaterial({
	color: '#ff0000',
})

// 创建立方体
let cubeArr = []
let cubeGroup = new THREE.Group()
for (let i = 0; i < 5; i++) {
	for (let j = 0; j < 5; j++) {
		for (let z = 0; z < 5; z++) {
			const cube = new THREE.Mesh(cubeGeometry, material)
			cube.position.set(i * 2 - 4, j * 2 - 4, z * 2 - 4)
			cubeGroup.add(cube)
			cubeArr.push(cube)
		}
	}
}
scene.add(cubeGroup)

//  ------ line -----
// 3. 产生炫酷三角形
const sjxGroup = new THREE.Group()
for (let i = 0; i < 50; i++) {
	//每个三角形需要三个定点，每3个定点，需要三个值
	const geometry = new THREE.BufferGeometry()
	const vertices = new Float32Array(9)
	for (let j = 0; j < 9; j++) {
		if (j % 3 === 1) {
			// 在 Y 轴上面移动 30
			vertices[j] = Math.random() * 10 - 5
		} else {
			vertices[j] = Math.random() * 10 - 5
		}
	}
	geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
	const color = new THREE.Color(Math.random(), Math.random(), Math.random())
	const material = new THREE.MeshBasicMaterial({
		color,
		transparent: true,
		opacity: 0.5,
		side: THREE.DoubleSide,
	})
	const cube = new THREE.Mesh(geometry, material)
	sjxGroup.add(cube)
}
sjxGroup.position.set(0, -30, 0)
scene.add(sjxGroup)
//  ------ end line -----

//  ------ line -----
// 4. 点光源
const pointGroup = new THREE.Group()
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshStandardMaterial()
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

sphere.castShadow = true
pointGroup.add(sphere)

const planeGeometry = new THREE.PlaneGeometry(60, 60)
const plane = new THREE.Mesh(planeGeometry, sphereMaterial)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true
pointGroup.add(plane)

const pointLight = new THREE.PointLight(0xff0000, 1.0)
pointLight.castShadow = true
pointLight.intensity = 100

pointLight.shadow.radius = 20
// 设置阴影贴图分辨率
pointLight.shadow.mapSize.set(2048, 2048)

// 创建一个ball
const smallBall = new THREE.Mesh(
	new THREE.SphereGeometry(0.2, 20, 20),
	new THREE.MeshBasicMaterial({ color: 0xffffff })
)
smallBall.position.set(2, 2, 2)
smallBall.add(pointLight)
pointGroup.add(smallBall)
pointGroup.position.set(0, -60, 0)
scene.add(pointGroup)
//  ------ end line -----

// ------ start line -----
// 8. 添加动画
gsap.to(cubeGroup.rotation, {
	x: '+=' + Math.PI * 2,
	y: '+=' + Math.PI * 2,
	duration: 10,
	ease: 'power2.inOut',
	repeat: -1,
})
gsap.to(sjxGroup.rotation, {
	x: '-=' + Math.PI * 2,
	z: '+=' + Math.PI * 2,
	duration: 12,
	ease: 'power2.inOut',
	repeat: -1,
})
gsap.to(smallBall.position, {
	x: -3,
	duration: 6,
	ease: 'power2.inOut',
	repeat: -1,
	yoyo: true,
})
gsap.to(smallBall.position, {
	y: 0,
	duration: 0.5,
	ease: 'power2.inOut',
	repeat: -1,
	yoyo: true,
})
// ------ end line -----

// 创建投射光线对象
const raycaster = new THREE.Raycaster()

// 鼠标的位置对象
const mouse = new THREE.Vector2()

// 监听鼠标的位置
window.addEventListener('click', event => {
	//   console.log(event);
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1
	mouse.y = -((event.clientY / window.innerHeight) * 2 - 1)
	raycaster.setFromCamera(mouse, camera)
	let result = raycaster.intersectObjects(cubeArr)
	result.forEach(item => {
		item.object.material = redMaterial
	})
})

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
	alpha: true,
})
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
// 开启场景中的阴影贴图
renderer.shadowMap.enabled = true
renderer.physicallyCorrectLights = true

// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)

// 添加坐标轴辅助器
// const axesHelper = new THREE.AxesHelper(5)
// scene.add(axesHelper)
// 设置时钟
const clock = new THREE.Clock()

// ------ start line -----
// 10. 移动动画
// 鼠标的位置对象
const mouse2 = new THREE.Vector2()

// 监听鼠标的位置
window.addEventListener('mousemove', event => {
	mouse2.x = event.clientX / window.innerWidth - 0.5
	mouse2.y = event.clientY / window.innerHeight - 0.5
})
// ------ end line -----

function render() {
	// let time = clock.getElapsedTime()
	const deltaTime = clock.getDelta()
	// cubeGroup.rotation.x = time * 0.3
	// cubeGroup.rotation.y = time * 0.3

	// 设置三角形旋转
	// sjxGroup.rotation.x = time * 0.3
	// sjxGroup.rotation.y = time * 0.3
	camera.position.y = -(window.scrollY / window.innerHeight) * 30
	// 设置小球旋转
	// smallBall.position.x = Math.sin(time) * 3
	// smallBall.position.z = Math.cos(time) * 3
	// smallBall.position.y = 2 + Math.sin(time) * 0.5
	// pointGroup.rotation.x = Math.sin(time) * 0.05
	// pointGroup.rotation.z = Math.sin(time) * 0.05
	camera.position.x += (mouse2.x * 10 - camera.position.x) * deltaTime * 5
	renderer.render(scene, camera)
	// 渲染下一帧的时候就会调用render函数
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

let currentPage = 0
const arrGroup = [cubeGroup, sjxGroup, pointGroup]

window.addEventListener('scroll', () => {
	const newPage = Math.round(window.scrollY / window.innerHeight)
	if (newPage !== currentPage) {
		currentPage = newPage
		console.log('当前页面切换，当前页为：', currentPage)
		gsap.to(arrGroup[currentPage].rotation, {
			z: '+=' + Math.PI * 2,
			x: '+=' + Math.PI * 2,
			duration: 2,
			onComplete: () => {
				console.log('旋转完成')
			},
		})
		// 9. 字体加入动画
		gsap.fromTo(
			`.page${currentPage} h1`,
			{ x: -300 },
			{
				x: 0,
				rotate: '+=360',
				duration: 1,
			}
		)
	}
})

