import * as THREE from 'three'

// 创建透视相机
const camera = new THREE.PerspectiveCamera(90, window.innerHeight / window.innerHeight, 0.1, 1000)
// 设置相机位置
camera.position.set(5, 5, 5)
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix()


export default camera