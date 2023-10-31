import * as THREE from 'three'
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true })

// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)

export default renderer