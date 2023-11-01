import * as THREE from 'three'
import renderer from './renderer'
import camera from './camera'
import scene from './scene'

const clock = new THREE.Clock()
function animate(t) {
	const elapsedTime = clock.getElapsedTime()
	//   console.log(elapsedTime);
	requestAnimationFrame(animate)
	// 使用渲染器渲染相机看这个场景的内容渲染出来
	renderer.render(scene, camera)
}
export default animate