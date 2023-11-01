import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import renderer from './renderer'
import camera from './camera'
// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement)

// 设置控制器阻尼
controls.enableDamping = true

// 设置自动旋转
// controls.autoRotate = true;

export default controls