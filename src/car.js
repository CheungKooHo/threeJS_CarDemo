/*
 * @Author: Coan
 * @Date: 2023-04-17 14:57:59
 * @LastEditors: Coan
 * @LastEditTime: 2023-04-18 15:35:43
 * @FilePath: /ThreeJS/src/car.js
 * @Description:
 */
import * as THREE from 'three'
import { Scene, PerspectiveCamera, WebGLRenderer, Mesh } from 'three'
import { AxesHelper, GridHelper } from 'three'
import { BoxGeometry, PlaneGeometry, CylinderGeometry } from 'three'
import { MeshBasicMaterial, MeshPhysicalMaterial, TextureLoader } from 'three'
import { AmbientLight, SpotLight, SpotLightHelper } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Vector2, Raycaster } from 'three'
import Lamborghini from '../public/Lamborghini.glb'
import MessiJPG from '../public/messi.JPG'
import GUI from 'lil-gui'
const TWEEN = require('@tweenjs/tween.js')

let _Scene, _Camera, _Renderer, _AxesHelper, _GridHelper, _OrbitControls, _AmbientLight;
let _CarDoors = []
let _CarDoorsStatus = false
let _CarBodyMaterial = new MeshPhysicalMaterial({
  color: 'pink',
  metalness: 1,
  roughness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.3
})
let _CarGlassMaterial = new MeshPhysicalMaterial({
  color: '#793e3e',
  metalness: 0.25,
  roughness: 0,
  transmission: 1.0 // 透光度
})

// 初始化场景
function initScene() {
  _Scene = new Scene()
}

// 初始化相机
function initCamera() {
  _Camera = new PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 1000)
  _Camera.position.set(5.75, 2.9, 6)
  // _Camera.position.set(0, -0.83, -0.3)
  // { cx: 0, cy: -0.83, cz: -0.3, ox: 1, oy: 0.63, oz: -0.5 }
}

// 初始化渲染器
function initRenderer() {
  _Renderer = new WebGLRenderer({
    antialias: true, // 抗锯齿
  })
  _Renderer.setSize(window.innerWidth, window.innerHeight)
  _Renderer.shadowMap.enabled = true // 渲染器支持阴影
  document.body.appendChild(_Renderer.domElement)
}

// 初始化坐标系
function initAxesHelper() {
  _AxesHelper = new AxesHelper(3)
  _Scene.add(_AxesHelper)
}

// 绘制地面网格辅助
function initGridHelper() {
  _GridHelper = new GridHelper(20, 40, 'pink', 0xffffff)
  _GridHelper.material.opacity = 0.2
  _GridHelper.material.transparent = true
  _Scene.add(_GridHelper)
}

// 初始化轨道控制器
function initOrbitControls() {
  _OrbitControls = new OrbitControls(_Camera, _Renderer.domElement)
  _OrbitControls.enableDamping = true
  _OrbitControls.maxDistance = 9
  _OrbitControls.minDistance = 1
  _OrbitControls.maxPolarAngle = 80 / 360 * 2 * Math.PI
  _OrbitControls.minPolarAngle = 0
  // _OrbitControls.target.set(1, 0.63, -0.5)
}

// 初始化环境光
function initAmbientLight() {
  _AmbientLight = new AmbientLight('#ffffff', 0.5)
  _Scene.add(_AmbientLight)
}

// 初始化聚光灯
function initSpotLight() {
  const _SpotLight = new SpotLight('#ffffff', 2)

  _SpotLight.angle = Math.PI / 8; // 散射角度，跟水平线的夹角
  _SpotLight.penumbra = 0.2; // 横向 聚光锥的半影衰减百分比
  _SpotLight.decay = 2; // 纵向 沿着光照距离的衰减量
  _SpotLight.distance = 300; // 聚光灯的最远距离

  _SpotLight.shadow.radius = 10
  _SpotLight.shadow.mapSize.set(4096, 4096); // 阴影映射宽度/高度

  _SpotLight.position.set(5, 10, 1); // 聚光灯发射点坐标
  _SpotLight.target.position.set(0, 0, 0); // 聚光灯照射方向
  _SpotLight.castShadow = true

  _Scene.add(_SpotLight)
}

// 初始化物体【加载模型】
function loadCarModel() {
  const _GLTFLoader = new GLTFLoader().load(Lamborghini, (glft) => {
    const carModel = glft.scene
    carModel.rotation.y = 0.5 * Math.PI

    carModel.traverse((node) => {
      if (node.name === 'Object_103' || node.name === 'Object_64' || node.name === 'Object_77') {
        node.material = _CarBodyMaterial
      }
      else if (node.name === 'Object_90') {
        node.material = _CarGlassMaterial
      }
      else if (node.name === 'Empty001_16' || node.name === 'Empty002_20') {
        _CarDoors.push(node)
      }
      else { }
      node.castShadow = true
    })
    _Scene.add(carModel)
  })
}

// 地板
function initFloor() {
  const _PlaneGeometry = new PlaneGeometry(20, 20)
  const _Material = new MeshPhysicalMaterial({
    side: THREE.DoubleSide, // 双面绘制
    color: 0x808080,
    metalness: 0, // 金属度
    roughness: 0.4, // 粗糙度
  })
  const _Floor = new Mesh(_PlaneGeometry, _Material)
  _Floor.position.set(0, 0, 0)
  _Floor.rotation.x = 0.5 * Math.PI
  _Floor.receiveShadow = true // 地板接受阴影
  _Scene.add(_Floor)
}

// 初始化圆柱体展厅
function initShowroom() {
  const _CylinderGeometry = new CylinderGeometry(12, 12, 20, 128)
  const _Material = new MeshPhysicalMaterial({
    side: THREE.DoubleSide,
    color: 0x6c6c6c,
  })
  const _Showroom = new Mesh(_CylinderGeometry, _Material)
  // _Showroom.position.y = 10
  _Scene.add(_Showroom)
}

// 初始化GUI
function initGUI() {
  let _GUIobj = {
    bodyColor: '#6e2121',
    glassColor: '#aaa',
    openCarDoor,
    closeCarDoor,
    goIntoCar,
    getOutCar,
  }
  const _GUI = new GUI()
  _GUI.addColor(_GUIobj, 'bodyColor').name('CarBody').onChange(value => {
    _CarBodyMaterial.color.set(value)
  })
  _GUI.addColor(_GUIobj, 'glassColor').name('CarGlass').onChange(value => {
    _CarGlassMaterial.color.set(value)
  })
  _GUI.add(_GUIobj, 'openCarDoor').name('OpenCarDoors')
  _GUI.add(_GUIobj, 'closeCarDoor').name('CloseCarDoors')
  _GUI.add(_GUIobj, 'goIntoCar').name('GoIntoCar')
  _GUI.add(_GUIobj, 'getOutCar').name('GetOutCar')
}

// GUI动作面板方法
function openCarDoor() {
  for (let index = 0; index < _CarDoors.length; index++) {
    const door = _CarDoors[index];
    setAnimationDoor({ x: 0 }, { x: Math.PI / 3 }, door)
    _CarDoorsStatus = 'open'
  }
}
function closeCarDoor() {
  for (let index = 0; index < _CarDoors.length; index++) {
    const door = _CarDoors[index];
    setAnimationDoor({ x: Math.PI / 3 }, { x: 0 }, door)
    _CarDoorsStatus = 'close'
  }
}
function setAnimationDoor(start, end, _mesh) {
  const tween = new TWEEN.Tween(start).to(end).easing(TWEEN.Easing.Quadratic.Out)
  tween.onUpdate((that) => {
    _mesh.rotation.x = that.x
  })
  tween.start()
}
function goIntoCar() {
  setAnimationView({ cx: 5.75, cy: 2.9, cz: 6, ox: 0, oy: 0.5, oz: 0 }, { cx: 0, cy: -0.83, cz: -0.3, ox: 1, oy: 0.63, oz: -0.5 })
}
function getOutCar() {
  setAnimationView({ cx: 0, cy: -0.83, cz: -0.3, ox: 1, oy: 0.63, oz: -0.5 }, { cx: 5.75, cy: 2.9, cz: 6, ox: 0, oy: 0.5, oz: 0 })
}
function setAnimationView(start, end) {
  const tween = new TWEEN.Tween(start).to(end).easing(TWEEN.Easing.Quadratic.Out)
  tween.onUpdate((that) => {
    _Camera.position.set(that.cx, that.cy, that.cz)
    _OrbitControls.target.set(that.ox, that.oy, that.oz)
  })
  tween.start()
}

function createSpotLight(color) {
  const _SpotLight = new SpotLight(color, 2)
  _SpotLight.castShadow = true
  _SpotLight.angle = Math.PI / 12
  _SpotLight.penumbra = 0.2
  _SpotLight.decay = 2
  _SpotLight.distance = 300
  return _SpotLight
}
function initMessiSpotLight() {
  const _MessiSpotLight = createSpotLight('#ffffff')
  const _MessiTexture = new TextureLoader().load(MessiJPG)

  _MessiSpotLight.position.set(0, 3, 0)
  _MessiSpotLight.target.position.set(-10, 3, -10)
  _MessiSpotLight.map = _MessiTexture
  _Scene.add(new SpotLightHelper(_MessiSpotLight))
}

function init() {
  initScene()
  initCamera()
  initRenderer()
  initAxesHelper()
  initGridHelper()
  initOrbitControls()
  loadCarModel()

  initAmbientLight()
  initSpotLight()
  initFloor()
  initShowroom()

  initGUI()
  initMessiSpotLight()
}

init()

function render(time) {
  // 动画
  _Renderer.render(_Scene, _Camera)
  requestAnimationFrame(render)
  TWEEN.update(time)
  _OrbitControls.update()
}
render()

// 响应式
window.addEventListener('resize', () => {
  _Camera.aspect = window.innerWidth / window.innerHeight
  _Camera.updateProjectionMatrix()

  _Renderer.setSize(window.innerWidth, window.innerHeight)
})

window.addEventListener('click', onPointClick)
function onPointClick(e) {
  let pointer = {}
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1
  pointer.y = (e.clientY / window.innerHeight) * 2 - 1

  let _Vector = new Vector2(pointer.x, pointer.y)
  let _Raycaster = new Raycaster() // 光线投射类，可以捕捉鼠标交互穿过了什么物体
  _Raycaster.setFromCamera(_Vector, _Camera)

  let _IntersectObjects = _Raycaster.intersectObjects(_Scene.children)
  _IntersectObjects.forEach(item => {
    if (item.object.name === 'Object_64' || item.object.name === 'Object_77') {
      if (!_CarDoorsStatus || _CarDoorsStatus === 'close') {
        openCarDoor()
      } else closeCarDoor()
    }
  })
}