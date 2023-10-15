

# Criando sua primeira cena 3D com javascript

  

Neste repositório consta o passo a passo necessário pra você criar a sua primeira cena 3D utilizando a biblioteca ThreeJS e a linguagem de programação javascript.

  

Esse material serve como apoio para uma oficina ministrada no Workshop de Tecnologias Móveis e para a Internet - WTMI. Na oficina também foi utilizada uma apresentação a qual você tem acesso aqui:

https://docs.google.com/presentation/d/1wUL15HgwB1S6IGrVWPIAjKpnl7lvUjFA5mXDDu0Z074/edit?usp=sharing

  
  
  

Para facilitar a nossa vida, esse repositório contém dois projetos, o projeto base, de onde vamos partir e o projeto final para que você possa comparar seu progresso.

  

Este é o projeto:

![App Screenshot](https://github.com/italosll/wtmi-2023-oficina-3d-view/blob/main/.github/demo.gif?raw=true)



Estrutura do projeto:

na pasta src temos os arquivos principais do projeto, o index.html onde definimos a estrutura da nossa página, o style.css onde definimos os estilos para os elementos do intex.html e o script.js responsável por adionar comportamento aos elementos do index.html. Descrever detalhadamente todos os arquivos aqui tornaria essa página verbosa, por isso a seguir está um resumo dos arquivos HTML e CSS. 
   
Nossa árvore DOM descrita no HTML contém:
* **< head >**
	* meta tags padrão de toda página web.
	* Links para obter a fonte Inter do google APIs
* **< body >**
	* **Container**
		* **< h1 >** - Nome da aplicação
		* **< canvas >** - Elemento que irá exibir nossa cena.
		* **< p >** - Nosso textinho.
		* **< script >** - Link para o script deve vir após o canvas.
   
Nossa folha de estilos CSS contém:
* **Css reset**
* **body, html** - Definição de imagem de fundo, fonte e alinhamento.
* **.container** - alinhamento.
* **.webgl** - Aparência e cursor
* **h1** - Aparência
* **p** - Aparência


Agora que você ja tem uma idéia da estrutura da nossa página vamos adicionar o comportamento. Abra seu arquivo javascript e importe os seguintes recursos:

```js 
import  *  as  THREE  from  'three'
import { OrbitControls } from  'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from  'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from  'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from  'three/examples/jsm/loaders/RGBELoader.js'
```
OrbitControls para habilitar os controles nativos da camera, GLTFLoader e DRACOLoader para carregar nosso objeto 3D e RGBELoader para carregar nosso enviroment map.

Recupere os seguintes elementos HTML:


```js 
/**
* Elementos HTML
*/
const  canvas  =  document.querySelector('canvas.webgl')
const  container  =  document.querySelector('.container')
```
Canvas e container, o canvas para exibirmos a cena 3D e o container para tornarmos nossa página responsiva.

Instancie os loaders:
```js
/**
* Loaders
*/
const  gltfLoader  =  new  GLTFLoader()
const  rgbeLoader  =  new  RGBELoader()
```

Defina o tamanho do canvas:
```js
/**
* Dimensoes
*/
const  dimensoesCanvas  = {
	width:container.clientWidth,
	height:container.clientWidth
}

const  atualizarDimensoesCanvas  =()=> {
	dimensoesCanvas.width=container.clientWidth,
	dimensoesCanvas.height=container.clientWidth
}
```
Aqui temos uma constante que contém a largura e altura do canvas, e uma constante contendo uma função anônima que atribui a largura do container a largura e altura do canvas, porque queremos que o canvas preencha toda a largura diponível no container e também que ele seja quadrado, portanto a altura e largura devem ser iguais.

Instancie a cena:
```js
/**
* Scene
*/
const  scene  =  new  THREE.Scene()
```

Carregue o mapa de ambiente:
```js
rgbeLoader.load('/environment_map.hdr', (environmentMap) =>

{

environmentMap.mapping  =  THREE.EquirectangularReflectionMapping
// scene.background = environmentMap
scene.environment  =  environmentMap

})
```
Este mapa de ambiente vai ser responsável por parte da iluminção da nossa cena, ele foi renderizado a partir do blender 3D.
caso queria gerar uma iluminação diferente, voce precisa configurar a camera da cena do blender com o tipo panoramica e  o tipo de panorama como equiretangular, nas configurações do renderer a resolução deve ser 2:1, onde a largura seja duas vezes maior que a altura (2000x1000 por exemplo). Aqui tem um tutorial mostrando o passo a passo: https://www.youtube.com/watch?v=_QkuoHbQrCc  Após renderizar, exporte com a extensão .hdr.

Instancie o Renderer:
```js
/**
* Renderer
*/
const  renderer  =  new  THREE.WebGLRenderer({
	canvas:  canvas,
	antialias:true,
	alpha:true
})
renderer.setSize(dimensoesCanvas.width, dimensoesCanvas.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener('resize',()=>{
	atualizarDimensoesCanvas()
	renderer.setSize(dimensoesCanvas.width, dimensoesCanvas.width)
})
```

Defina o ToneMapping:
```js
// Tone mapping
renderer.toneMapping  =  THREE.ACESFilmicToneMappingToneMapping
renderer.toneMappingExposure  =  0.5
```
Entenda esse Recurso como um filtro aplicado no renderizador, produz um resultado semelhante a um filtro de pós-processamento de imagem, neste caso também atuando sobre a iluminação.


Carregue o modelo 3D:

```js
/**
 * Carregar Modelo 3D
 */
const dracoLoader = new DRACOLoader()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load(
    '/if_logo_3d.glb',
    (gltf) =>
    {
        gltf.scene.rotation.y = -2.3
        gltf.scene.position.set(-0.5, -2.5, 0.5)
        scene.add(gltf.scene)
    }
)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)
```

Além de carregar o modelo, aqui definimos também a rotação e posição do modelo, para que ele fique exatamente no centro da nossa cena, tanto no eixo vertical quanto no eixo horizontal, e a rotação para que o objeto fique de "frente" para a camera. 

Falando em câmera, vamos adicioná-la a seguir:
```js
/**
 * Camera perspectiva
 */
const camera = new THREE.PerspectiveCamera(25, dimensoesCanvas.width / dimensoesCanvas.height, 14, 19)
camera.position.set(  12, 0,12  )
scene.add(camera)
```
Vamos habilitar os controles para manipular a cena (arrastar e soltar): 
```js
/**
 * Controle (arrastar e soltar)
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
```
Por fim vamos criar a função tick, e chamar ela logo em seguida:
```js
const tick = () =>
{
    controls.update() // Atualizar Damping
    renderer.render(scene, camera) // Renderizar o frame atual
    window.requestAnimationFrame(tick)// Chamar tick() novamente no próximo frame (recursivamente)
}

tick()
```
O nome da função (tick) pouco importa nesse caso, o fundamental é que exista uma função que no mínimo renderize a cena e chame a si mesma no proximo frame, como essa é uma chamada recursiva, a cada frame essa função realizar o render de uma imagem, e conforme os frames vao sendo renderizados nos é transmitida a sensação de manipulação em ambiente 3d em tempo real.
