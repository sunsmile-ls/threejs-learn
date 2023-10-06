import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 目标：
//  1. 基础材质和纹理
//  2. 纹理偏移，旋转，重复
//  3. 纹理显示算法配置
//  4. 透明纹理
//  5. AO环境遮挡贴图

// 一. 创建场景
const scene = new THREE.Scene()

// 二. 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 10)
scene.add(camera)

// 三. 添加物体(geometry)
// 1.1 导入纹理
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/door.jpg')
// const texture = textureLoader.load('/textures/door/minecraft.png')
// 4.1 透明纹理
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
// 5.1 加载AO贴图纹理
const doorAoTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')

// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 创建材质
// 1.2 将纹理添加到材质里面
const material = new THREE.MeshBasicMaterial({
	color: 0xffff00,
	map: doorColorTexture,
	// map: texture,
	alphaMap: doorAlphaTexture, // 4.2 一张灰度纹理，用于控制整个表面的不透明度， 在设置了 transparent 后生效
	transparent: true, // 4.3 表示材质是否透明
	// opacity: 0.4, // 4.4 设置透明度
	side: THREE.DoubleSide, // 4.5 默认只渲染前面，渲染两面需要单独设置
	aoMap: doorAoTexture, // 5.3 设置ao贴图属性
})

//  ------ line -----
// // 2. 纹理的偏移，旋转，重复
// // 2.1 偏移
// // doorColorTexture.offset.x = 0.5
// // doorColorTexture.offset.y = 0.5
// // doorColorTexture.offset.set(0.2, 0.2)
// // 2.2 旋转
// // 设置旋转原点
// // doorColorTexture.center.set(0.5, 0.5)
// // 旋转45deg
// // doorColorTexture.rotation = Math.PI / 4
// // 2.3 重复
// doorColorTexture.repeat.set(2, 3)
// // 设置纹理重复的模式
// // wrapS、wrapT 默认值是THREE.ClampToEdgeWrapping，即纹理边缘将被推到外部边缘的纹素
// doorColorTexture.wrapS = THREE.MirroredRepeatWrapping // 纹理将重复到无穷大，在每次重复时将进行镜像
// doorColorTexture.wrapT = THREE.RepeatWrapping // 纹理将简单地重复到无穷大, 重复每一个纹理
//  ------ end line -----

//  ------ line -----
// 3. 设置纹理算法
// THREE.NearestFilter 纹理坐标（在曼哈顿距离之内）最接近的纹理元素的值
// texture.magFilter = THREE.NearestFilter // 默认值 THREE.LinearFilter 纹理坐标最近的四个纹理元素的加权平均值
// texture.minFilter = THREE.NearestFilter //默认值 THREE.LinearMipmapLinearFilter 创建mipmap， 然后在根据像素去选择最靠近的纹理进行显示
//  ------ end line -----
// 根据支架和材质创建几何体
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// 5.2 需要创建第二组uv
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

