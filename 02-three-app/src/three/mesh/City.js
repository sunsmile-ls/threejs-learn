import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from 'three'

import scene from '@/three/scene'
import modifyCityMaterial from '../modify/modifyCityMaterial'

// 创建物体
export default function createCity() {
  const gltfLoader = new GLTFLoader()
  gltfLoader.load('model/city.glb', (gltf) => {
    gltf.scene.traverse(item => {
      if(item.type === 'Mesh') {
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0x0c0e33)
        })
        item.material = material;
        modifyCityMaterial(item)
      }
    })
    scene.add(gltf.scene)
  })
}