import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

// 目标：掌握设置环境纹理

//创建gui对象
const gui = new dat.GUI()

// 初始化场景
const scene = new THREE.Scene()

// 创建透视相机
const camera = new THREE.PerspectiveCamera(75, window.innerHeight / window.innerHeight, 1, 50)
// 设置相机位置
// object3d具有position，属性是1个3维的向量
camera.position.set(0, 0, 3)
scene.add(camera)

// 加入辅助轴，帮助我们查看3维坐标轴
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// 加载纹理

// 创建纹理加载器对象
const textureLoader = new THREE.TextureLoader()

// 添加环境纹理
const cubeTextureLoader = new THREE.CubeTextureLoader()
const envMapTexture = cubeTextureLoader.load([
	'textures/environmentMaps/0/px.jpg',
	'textures/environmentMaps/0/nx.jpg',
	'textures/environmentMaps/0/py.jpg',
	'textures/environmentMaps/0/ny.jpg',
	'textures/environmentMaps/0/pz.jpg',
	'textures/environmentMaps/0/nz.jpg',
])

const directionLight = new THREE.DirectionalLight('#ffffff', 1)
directionLight.castShadow = true
directionLight.position.set(0, 0, 200)
scene.add(directionLight)

scene.environment = envMapTexture
scene.background = envMapTexture

const customUniforms = {
	uTime: {
		value: 0,
	},
}

// 模型加载
const gltfLoader = new GLTFLoader()
gltfLoader.load('./textures/postProcessing/DamagedHelmet.gltf', gltf => {
	console.log(gltf)
	const mesh = gltf.scene.children[0]
	mesh.castShadow = true
	scene.add(mesh)
})

// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

// 合成效果
const effectComposer = new EffectComposer(renderer)
effectComposer.setSize(window.innerWidth, window.innerHeight)

// 添加渲染通道
const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

// 故障通道
const glitchPass = new GlitchPass()
glitchPass.enabled = false
effectComposer.addPass(glitchPass)

// 抗锯齿
const sMAAPass = new SMAAPass()
sMAAPass.enabled = false
effectComposer.addPass(sMAAPass)

// 发光效果
const unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.enabled = false
effectComposer.addPass(unrealBloomPass)

renderer.toneMapping = THREE.ACESFilmicToneMapping // 色调映射
renderer.toneMappingExposure = 1 // 色调曝光级别
unrealBloomPass.strength = 1 // 泛光的强度
unrealBloomPass.radius = 0 // 泛光散发的半径
unrealBloomPass.threshold = 1 // 泛光的光照强度阈值

gui.add(renderer, 'toneMappingExposure').min(0).max(2).step(0.01)
gui.add(unrealBloomPass, 'strength').min(0).max(2).step(0.01)
gui.add(unrealBloomPass, 'radius').min(0).max(2).step(0.01)
gui.add(unrealBloomPass, 'threshold').min(0).max(2).step(0.01)
const colorParams = {
	r: 0,
	g: 0,
	b: 0,
}
const shaderPass = new ShaderPass({
	uniforms: {
		tDiffuse: {
			value: null,
		},
		uColor: {
			value: new THREE.Color(colorParams.r, colorParams.g, colorParams.b),
		},
	},
	vertexShader: `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
    }
  `,
	fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform vec3 uColor;
    void main(){
      vec4 color = texture2D(tDiffuse,vUv); // 获取纹理的颜色
      // gl_FragColor = vec4(vUv,0.0,1.0);
      color.xyz+=uColor; // 在纹理颜色的基础上面叠加其他颜色
      gl_FragColor = color;
    }
  `,
})
effectComposer.addPass(shaderPass)

gui
	.add(colorParams, 'r')
	.min(-1)
	.max(1)
	.step(0.01)
	.onChange(value => {
		shaderPass.uniforms.uColor.value.r = value
	})
gui
	.add(colorParams, 'g')
	.min(-1)
	.max(1)
	.step(0.01)
	.onChange(value => {
		shaderPass.uniforms.uColor.value.g = value
	})
gui
	.add(colorParams, 'b')
	.min(-1)
	.max(1)
	.step(0.01)
	.onChange(value => {
		shaderPass.uniforms.uColor.value.b = value
	})
const normalTexture = textureLoader.load('./textures/postProcessing/interfaceNormalMap.png')
const techPass = new ShaderPass({
	uniforms: {
		tDiffuse: {
			value: null,
		},
		uNormalMap: {
			value: null,
		},
		uTime: {
			value: 0,
		},
	},
	vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
	fragmentShader: `
  varying vec2 vUv;
  uniform sampler2D tDiffuse;
  uniform sampler2D uNormalMap;
  uniform float uTime;
  void main(){
    vec2 newUv = vUv;
    newUv += sin(newUv.x*10.0+uTime*0.5)*0.03;

    vec4 color = texture2D(tDiffuse,newUv);
    // gl_FragColor = vec4(vUv,0.0,1.0);
    vec4 normalColor = texture2D(uNormalMap,vUv);
    // 设置光线的角度
    // normalize(vec3(-5,5,2)) 求 vec3(5,5,-2) 的单位向量
    vec3 lightDirection = normalize(vec3(-5,5,2));
    // 求亮度 dot(normalColor.xyz,lightDirection) 法线的颜色和单位向量得到亮度
    // clamp 让函数在 0.0 ～ 1.0 范围内
    float lightness = clamp(dot(normalColor.xyz,lightDirection),0.0,1.0);
    color.xyz+=lightness;
    gl_FragColor = color;
  }
  `,
})
techPass.material.uniforms.uNormalMap.value = normalTexture
effectComposer.addPass(techPass)
// 监听屏幕大小改变的变化，设置渲染的尺寸
window.addEventListener('resize', () => {
	// 更新摄像头
	camera.aspect = window.innerWidth / window.innerHeight
	//   更新摄像机的投影矩阵
	camera.updateProjectionMatrix()

	//   更新渲染器
	renderer.setSize(window.innerWidth, window.innerHeight)
	effectComposer.setSize(window.innerWidth, window.innerHeight)
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

const clock = new THREE.Clock()
function animate(t) {
	controls.update()
	const time = clock.getElapsedTime()
	customUniforms.uTime.value = time
	requestAnimationFrame(animate)
	// 使用渲染器渲染相机看这个场景的内容渲染出来
	// renderer.render(scene, camera)
	techPass.material.uniforms.uTime.value = time
	effectComposer.render()
}

animate()

