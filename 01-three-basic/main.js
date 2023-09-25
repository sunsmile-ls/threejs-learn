import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 目标：
//  1. 了解three.js 最基本的内容
//  2. 使用控制器查看3D物体
//  3. 物体进行移动
//  4. 物体缩放和旋转

// 1. 创建场景
const scene = new THREE.Scene()

// 2. 创建相机
// 视锥体：近的看不见，远的超出范围的也看不见，不在锥体里面的内容，看不见
// 例子： https://localhost:8080/examples/?q=camera#webgl_camera
// 在75度的范围内，可看到0.1～1000位置的物体
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// 设置相机的位置
camera.position.set(0, 0, 10)
// 相机添加到场景中
scene.add(camera)

// 3. 添加物体
// 创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// 几何体的材质(基础网格材质)
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
// 根据几何体大小和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
// 将几何体添加到场景中
scene.add(cube)

// 3.1 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 3.2.1 物体进行位置的设置
cube.position.set(2, 0, 0)
cube.position.x = 3

// 3.3.1 物体进行缩放
cube.scale.set(3, 1, 1)
cube.scale.x = 0

// 4. 渲染
// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染器的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)

// 首次渲染：使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera)

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)

function render() {
	// 3.2.2 对物体进行移动
	cube.position.x += 0.01
	if (cube.position.x > 5) {
		cube.position.x = 0
	}
	renderer.render(scene, camera)
	// 渲染下一帧的时候就会调用渲染函数
	requestAnimationFrame(render)
}
// 调用渲染函数
render()

