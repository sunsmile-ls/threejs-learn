import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import * as dat from 'dat.gui'

// 目标：认识shader
// 1. 使用行内的着色器
// 2. 着色器抽取成文件
// 3. 使用原生的着色器
// 4. 动态设置参数和纹理

// ------ start line -------
// 2.1 着色器抽取成文件
// 顶点着色器
import basicVertexShader from './assets/shader/basic/vertex.glsl?raw'
// 片元着色器
import basicFragmentShader from './assets/shader/basic/fragment.glsl?raw'
// ------ end line --------

// ------ start line -------
// 2.1 着色器抽取成文件
// 顶点着色器
import rawVertexShader from './assets/shader/raw/vertex.glsl?raw'
// 片元着色器
import rawFragmentShader from './assets/shader/raw/fragment.glsl?raw'
// ------ end line --------

//创建gui对象
const gui = new dat.GUI()

// console.log(THREE);
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

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// const material = new THREE.MeshBasicMaterial({ color: "#00ff00" });
// ------ start line -------
// 1. 使用行内的着色器
// 创建着色器材质
// 需要进行 投影矩阵 * 视图矩阵 * 模型矩阵 * 顶点坐标 进行转换
// const shaderMaterial = new THREE.ShaderMaterial({
// 	vertexShader: `
//     void main(){
//       gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0 );
//     }
//   `,
// 	fragmentShader: `
//     void main(){
//       gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//     }
//   `,
// })
// ------ end line --------

// ------ start line -------
// 2.2 着色器抽取成文件
// 通过文件的方式导入着色器，可以进行glsl 书写代码，有高亮状态
// ! 下载插件 Shader languages support
// const shaderMaterial = new THREE.ShaderMaterial({
// 	vertexShader: basicVertexShader,
// 	fragmentShader: basicFragmentShader,
// })
// ------ end line --------

// ------ start line -------
// 4.1 创建纹理加载器对象
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('./assets/texture/ca.jpeg')

// 3.2 着色器抽取成文件
const shaderMaterial = new THREE.RawShaderMaterial({
	vertexShader: rawVertexShader,
	fragmentShader: rawFragmentShader,
	// 4.2 动态设置参数和纹理
	side: THREE.DoubleSide,
	uniforms: {
		uTime: {
			value: 0,
		},
		uTexture: {
			value: texture,
		},
	},
})
// ------ end line --------
// 创建平面
const floor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 64, 64), shaderMaterial)

console.log(floor)
scene.add(floor)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true })
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.BasicShadowMap;
// renderer.shadowMap.type = THREE.VSMShadowMap;

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
// controls.autoRotate = true;

const clock = new THREE.Clock()
function animate(t) {
	const elapsedTime = clock.getElapsedTime()
	//   console.log(elapsedTime);
	// 4.3 动态设置 uTime 值， 使飘起来
	shaderMaterial.uniforms.uTime.value = elapsedTime
	requestAnimationFrame(animate)
	// 使用渲染器渲染相机看这个场景的内容渲染出来
	renderer.render(scene, camera)
}

animate()

