<script setup>
import * as THREE from 'three'

import { Water } from 'three/examples/jsm/objects/Water2'

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import gsap from 'gsap'
import * as dat from 'dat.gui'

// 导入场景
import scene from '@/three/scene'

// 导入摄像机
import camera from '@/three/camera'

// 导入坐标轴
import axesHelper from '@/three/axesHelper'

// 初始化控制器
import controls from '@/three/controls'

// 导入渲染器
import renderer from '@/three/renderer'

// 初始化导入
import '@/three/init'
//创建gui对象
const gui = new dat.GUI()

// 摄像机添加到场景中
scene.add(camera)

// 加入辅助轴，帮助我们查看3维坐标轴
scene.add(axesHelper)


const rgbeLoader = new RGBELoader()
rgbeLoader.load('./textures/threejsWater/050.hdr', texture => {
	texture.mapping = THREE.EquirectangularReflectionMapping
	scene.background = texture
	scene.environment = texture
})
// 加载浴缸
const gltfLoader = new GLTFLoader()
gltfLoader.load('./textures/threejsWater/model/yugang.glb', gltf => {
	console.log(gltf)
	const yugang = gltf.scene.children[0]
	yugang.material.side = THREE.DoubleSide
	const waterGeometry = gltf.scene.children[1].geometry
	const water = new Water(waterGeometry, {
		color: '#ffffff',
		scale: 1,
		flowDirection: new THREE.Vector2(1, 1),
		textureHeight: 1024,
		textureWidth: 1024,
	})
	scene.add(water)
	scene.add(gltf.scene)
})




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
	requestAnimationFrame(animate)
	// 使用渲染器渲染相机看这个场景的内容渲染出来
	renderer.render(scene, camera)
}

animate()


</script>

<template>
  <div>
    这个是容器页面
  </div>
</template>

<style scoped>

</style>
