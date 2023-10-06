import * as THREE from 'three'
import gsap from 'gsap'
import * as dat from 'dat.gui'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 目标：
//  1. 了解three.js 最基本的内容
//  2. 使用控制器查看3D物体
//  3. 创建坐标轴（x/y/z）
//  4. 物体进行移动
//  5. 物体缩放和旋转
//  6. requestAnimationFrame 中更加光滑
//  7. clock 跟踪时间对象（解决了 requestAnimationFrame 只有一个时间参数，不符合多个计时功能的实现）
//  8. gsap 动画修改位置和旋转
//  9. three.js 根据尺寸变化实现自适应画面
// 10. 全屏和退出全屏
// 11. 应用程序用户界面更改变量

// 一. 创建场景
const scene = new THREE.Scene()

// 二. 创建相机
// 视锥体：近的看不见，远的超出范围的也看不见，不在锥体里面的内容，看不见
// 例子： https://localhost:8080/examples/?q=camera#webgl_camera
// 在75度的范围内，可看到0.1～1000位置的物体
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// 设置相机的位置
camera.position.set(0, 0, 10)
// 相机添加到场景中
scene.add(camera)

// 三. 添加物体
// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// 几何体的材质(基础网格材质)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
// 根据几何体大小和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
// 将几何体添加到场景中
scene.add(cube)

// 3. 添加坐标轴辅助器 (创建3个坐标轴)
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

//  ------ line -----
// 4.1 物体进行位置的设置
// cube.position.set(2, 0, 0)
// cube.position.x = 3
//  ------ end line -----

//  ------ line -----
// 5.1 物体进行缩放
// cube.scale.set(3, 1, 1)
// cube.scale.x = 1 // x 轴缩放比例
// 5.2 旋转
// cube.rotation.set(Math.PI / 4, 0, 0) // 旋转 90度
//  ------ end line -----

// 四. 渲染
// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染器的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)

// 首次渲染：使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera)

// 2. 创建轨道控制器(可以移动相机的位置)
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器的阻尼，让控制动器更有真实效果，必须在动画循环里调用 update()
controls.enableDamping = true

// 7. 创建时钟对象
const clock = new THREE.Clock()

// 8. gsap 设置动画
const animate1 = gsap.to(cube.position, {
	x: 5,
	duration: 5,
	ease: 'power2.inOut',
	repeat: -1, // 设置重复次数，无线重复为 -1
	yoyo: true, // 往返运动
	delay: 2, // 延迟两秒执行动画
	onComplete: () => {
		console.log('动画执行完成')
	},
	onStart: () => {
		console.log('动画开始')
	},
})
gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5, ease: 'power2.inOut' })
//监听鼠标点击时间
window.addEventListener('dblclick', () => {
	// 判断是否在运动
	if (animate1.isActive()) {
		animate1.pause()
	} else {
		animate1.resume()
	}
})

function render(time) {
	//  ------ line -----
	// 2. 使动画更加真实, 动画慢慢停下来
	controls.update()
	//  ------ end line -----

	//  ------ line -----
	// 4.2 对物体进行移动
	// cube.position.x += 0.01
	// if (cube.position.x > 5) {
	// 	cube.position.x = 0
	// }
	//  ------ end line -----

	//  ------ line -----
	// 6. requestAnimationFrame 中更加光滑
	// let t = (time / 1000) % 5
	// cube.position.x = t * 1
	//  ------ end line -----

	//  ------ line -----
	// 7.1 获取时钟总时长
	// const time1 = clock.getElapsedTime()
	// console.log('获取时钟总时长', time1)
	// 7.2 获取两次的间隔时间
	// const deltaTime = clock.getDelta()
	// console.log('获取两次的间隔时间', deltaTime)
	// let t2 = time1 % 5
	// cube.position.x = t2 * 1
	//  ------ end line -----

	renderer.render(scene, camera)
	// 渲染下一帧的时候就会调用渲染函数
	requestAnimationFrame(render)
}
// 调用渲染函数
render()

// 9. 监听画面变化，更新渲染画面
window.addEventListener('resize', () => {
	// 更新摄像头宽高比
	camera.aspect = window.innerWidth / window.innerHeight
	// 更新摄像机的投影矩阵
	camera.updateProjectionMatrix()

	// 更新渲染器
	renderer.setSize(window.innerWidth, window.innerHeight)
	// 设置渲染器的像素比
	renderer.setPixelRatio(window.devicePixelRatio)
})

window.addEventListener('dblclick', () => {
	const fullScreenElement = document.fullscreenElement
	if (!fullScreenElement) {
		// 画布对象请求全屏
		renderer.domElement.requestFullscreen()
	} else {
		// 退出全屏，使用 document 对象
		document.exitFullscreen()
	}
})

// 11. 应用程序用户界面更改变量
const gui = new dat.GUI()
gui
	.add(cube.position, 'y')
	.min(0)
	.max(5)
	.step(0.01)
	.name('移动Y轴')
	.onChange(value => {
		console.log('值被修改了', value)
	})
	.onFinishChange(value => {
		console.log('值修改完成了', value)
	})
const params = {
	color: '#ffff00',
	fn: () => {
		if (animate1.isActive()) {
			animate1.pause()
		} else {
			animate1.resume()
		}
	},
}
// 修改材质的颜色
gui.addColor(params, 'color').onChange(value => {
	console.log('值被修改了', value)
	cube.material.color.set(value)
})
// 设置选项框
gui.add(cube, 'visible').name('是否显示')
// 设置按钮，点击触发某个事件
gui.add(params, 'fn').name('立方体停止/开始运动')
// 创建文件夹
const folder = gui.addFolder('设置立方体')
// 在文件夹中添加是否显示线框
folder.add(cube.material, 'wireframe')

