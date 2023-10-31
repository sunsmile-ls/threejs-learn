import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import renderer from 'render'
import camera from './camera'
// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼
controls.enableDamping = true

export default controls