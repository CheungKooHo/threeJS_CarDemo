/*
 * @Author: Coan
 * @Date: 2023-04-16 16:45:14
 * @LastEditors: Coan
 * @LastEditTime: 2023-04-17 15:23:57
 * @FilePath: /ThreeJS/src/app.js
 * @Description:
 */
import * as THREE from 'three'
import { Scene, PerspectiveCamera, WebGLRenderer, AxesHelper, BoxGeometry, TextureLoader, MeshBasicMaterial, Mesh } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
const TWEEN = require('@tweenjs/tween.js')
import TextureJpg from '../public/pkq.jpg'

let _Scene, _Camera, _Renderer, _OrbitControls, _Mesh;

// 初始化场景
function initScene() {
  _Scene = new Scene()
}

// 初始化相机
function initCamera() {
  _Camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  // _Camera.position.z = 10
  _Camera.position.set(10, 10, 10)
}

// 初始化渲染器
function initRenderer() {
  _Renderer = new WebGLRenderer({
    antialias: true, // 抗锯齿
  })
  _Renderer.setSize(window.innerWidth, window.innerHeight)

  document.body.appendChild(_Renderer.domElement)
}

// 初始化坐标系
function initAxesHelper() {
  const _AxesHelper = new AxesHelper(3)
  _Scene.add(_AxesHelper)
}

// 初始化轨道控制器
function initOrbitControls() {
  _OrbitControls = new OrbitControls(_Camera, _Renderer.domElement)
}

// 初始化物体
function initMesh() {
  const _Geometry = new BoxGeometry()
  const _Texture = new TextureLoader().load(TextureJpg)
  const _Material = new MeshBasicMaterial({
    color: '#ffffff',
    map: _Texture
  })
  _Mesh = new Mesh(_Geometry, _Material)
  _Scene.add(_Mesh)
}

// tween动画
function initTween() {
  const coords = { x: 0, y: 0 } // Start at (0, 0)
  const tween = new TWEEN.Tween(coords) // Create a new tween that modifies 'coords'.
    .to({ x: 3, y: 3 }, 3000) // Move to (3, 3) in 3 second.
    .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
    .onUpdate((that) => {
      _Mesh.position.x = that.x
      _Mesh.position.y = that.y
      _Mesh.position.z = that.x
    })
    .start() // Start the tween immediately.
}

function init() {
  initScene()
  initCamera()
  initRenderer()
  initAxesHelper()
  initOrbitControls()
  initMesh()
  initTween()
}

init()

function render(time) {
  // 动画
  // if (_Mesh.position.x > 3) {
  //   _Mesh.position.x -= 0.01
  // } else {
  //   _Mesh.position.x += 0.01
  // }
  _Renderer.render(_Scene, _Camera)
  requestAnimationFrame(render)
  TWEEN.update(time)
}
render()

// 响应式
window.addEventListener('resize', () => {
  _Camera.aspect = window.innerWidth / window.innerHeight
  _Camera.updateProjectionMatrix()

  _Renderer.setSize(window.innerWidth, window.innerHeight)
})