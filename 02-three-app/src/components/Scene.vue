<script setup>
import * as THREE from 'three'
import { onMounted, ref } from 'vue'
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

// 导入动画
import animate from '@/three/animate'

// 导入添加物体函数
import createMesh from '@/three/createMesh'

//创建gui对象
const gui = new dat.GUI()

// 摄像机添加到场景中
scene.add(camera)

const sceneDiv = ref(null)

// 加入辅助轴，帮助我们查看3维坐标轴
scene.add(axesHelper)

// 创建物体
createMesh()

onMounted(() => {
	// 将渲染器添加到body
	sceneDiv.value.appendChild(renderer.domElement)
  animate()
})


</script>

<template>
  <div class="scene" ref="sceneDiv"></div>
</template>

<style scoped>
.scene {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}
</style>
