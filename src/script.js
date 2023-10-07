import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
 
 /**
 * Elementos HTML
 */
const canvas = document.querySelector('canvas.webgl')
const container = document.querySelector('.container')

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const rgbeLoader = new RGBELoader()


/**
 * Dimensoes
 */
const dimensoesCanvas = {
    width:container.clientWidth,
    height:container.clientWidth
}

const atualizarDimensoesCanvas =()=> {
    dimensoesCanvas.width=container.clientWidth,
    dimensoesCanvas.height=container.clientWidth
}

 /**
 * Scene
 */
const scene = new THREE.Scene()

// HDR (RGBE) equirectangular - > 3 - 5 - 6 - 11
rgbeLoader.load('/environmentMaps/nuppgin_render6.hdr', (environmentMap) =>
{
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    // scene.background = environmentMap
    scene.environment = environmentMap
})

 /**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias:true,
    alpha:true
})
renderer.setSize(dimensoesCanvas.width, dimensoesCanvas.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener('resize',()=>{
    atualizarDimensoesCanvas()
    renderer.setSize(dimensoesCanvas.width, dimensoesCanvas.width)
})

// Tone mapping
renderer.toneMapping = THREE.ACESFilmicToneMappingToneMapping
renderer.toneMappingExposure = 0.5

/**
 * Carregar Modelo 3D
 */
const dracoLoader = new DRACOLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
    '/models/if_logo_3d_2.glb',
    (gltf) =>
    {
        gltf.scene.rotation.y = -2.3
        gltf.scene.position.set(-0.5, -2.5, 0.5)
        scene.add(gltf.scene)
    }
)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)
 
/**
 * Camera perspectiva
 */
const camera = new THREE.PerspectiveCamera(25, dimensoesCanvas.width / dimensoesCanvas.height, 0.1, 100)
camera.position.set(  12, 0,12  )
scene.add(camera)

/**
 * Controle (arrastar e soltar)
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const tick = () =>
{
       
    controls.update() // Atualizar Damping
  
    renderer.render(scene, camera) // Renderizar o frame atual
    
    window.requestAnimationFrame(tick)// Chamar tick() novamente no próximo frame
}

tick()