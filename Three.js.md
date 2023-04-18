## Three.js

### 一、什么是Three.js

运行在浏览器中的3D引擎，可以使用它创建各种三维场景，包括摄影机、光影、材质等对象。

### 二、Three.js和WebGL的关系

WebGL是基于OpenGL设计的面向web的图形标准，提供了一系列JavaScript API，通过这些API进行图形渲染将得以利用图形硬件从而获得较高性能。

### 三、基本元素

#### 1、场景：

每个Three.js项目里放置内容的容器。可以拥有多个场景进行切换展示；可以在场景内放置模型，灯光和照相机；可以通过调整场景的位置，让场景内的所有内容都一起跟着调整位置。可以理解为拍摄电影中的舞台，决定了可以在什么地方摆放什么物体。

```javascript
const scene = new THREE.Scene();
```

#### 2、相机：

类似于人眼，可以观察到环境中的物体，以及光线效果。

> Three.js必须要往场景中添加一个相机，相机用来确定位置、方向、角度，相机看到的内容就是最终在屏幕上看到的内容。在程序运行过程中，可以调整相机的位置、方向和角度。

##### a、透视相机：可以提供一个近大远小的3D效果。

***PerspectiveCamera***通过四个属性来定义一个视锥。

+ near：定义视锥的前端；
+ far：定义视锥的后端；
+ fov：定义视野，通过计算正确的高度来丛摄像机的位置获得制定的以near为单位的视野，定义的是视锥的前端和后端的高度；
+ aspect：间接定义设追前端和后端的高度，实际上视锥的宽度是通过高度乘以aspect得到的；

![image-20230416153442705](/Users/mac/Library/Application Support/typora-user-images/image-20230416153442705.png)

![image-20230416154006675](/Users/mac/Library/Application Support/typora-user-images/image-20230416154006675.png)

```javascript
const fov = 45;
const aspect = 2; // canvas 默认宽高 300:150
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fav, aspect, near, far);
camera.position.set(0, 10, 20);
```



##### b、正交相机：视锥是一个立方体，在这种投影模式下，无论物体距离相机远近，最终渲染的图片中物体的大小都保持不变，这对于渲染2D场景或者UI元素都是非常有用的。

![image-20230416154633133](/Users/mac/Library/Application Support/typora-user-images/image-20230416154633133.png)

#### 3、灯光：

假如没有灯光，摄像机看不到任何东西，因此需要往场景内添加光源，为了跟真实世界更加接近，Three.js支持模拟不同光源，展现不同光源效果；

Three.js提供的灯光效果主要有：点光源、平行光、聚光灯、环境光等；

##### a、AmbientLight（环境光）

环境光会均匀的照亮场景中的所有物体，环境光不能用来投射阴影，因为它没有方向。（反射光）

```javascript
const _ALight = new THREE.AmbientLight(0x404040);
```

##### b、DirectionLight（平行光）

平行光是沿着特定方向发射的光。这种光的表现视为光源无限远，由其光源发出的光线为平行光线。通常用来模拟太阳光的效果。

```javascript
const _DLight = new THREE.DirectionLight(0xffffff, 0.5); // 第二个参数为光照强度
```

##### c、PointLight（点光源）

从一个点向各个方向发射的光源。一个常见的例子就是模拟一个灯泡发出的光。

##### d、SpotLight（聚光灯）

光线从一个点沿一个方向射出的光，随着光线照射的变远，光锥体的尺寸逐渐增大。

```javascript
const _SLight = new THREE.SpotLight(0xffffff);
```

#### 4、网格（物体）

由Mesh模型构建的三维实体，Mesh模型的最小单元是一个三角形。

Mesh网格分为两部分，分别为***Geometry（几何体）***和***Material（材质）、Texture（纹理）***。

##### a、2D几何体

![image-20230416160956516](/Users/mac/Library/Application Support/typora-user-images/image-20230416160956516.png)

##### b、3D几何体

![image-20230416161030375](/Users/mac/Library/Application Support/typora-user-images/image-20230416161030375.png)

##### c、材质

![image-20230416161116637](/Users/mac/Library/Application Support/typora-user-images/image-20230416161116637.png)

同一个物体，同样的光照，在不同的材质下，其展现效果不同。

![image-20230416161210705](/Users/mac/Library/Application Support/typora-user-images/image-20230416161210705.png)

各种标准的材质的构建速度丛最快到最慢：***MeshBasicMaterial=>MeshLambertMaterial=>MeshPhongMaterial=>MeshStandardMaterial=>MeshPhysicalMaterial***。构建速度越慢的材质，做出的场景越逼真，但在低功率或者移动设备上，构建慢会导致体验很差。

```javascript
const _Material = new Three.MeshPhongMaterial({
  color: 0xff0000, // 红色（也可以使用CSS的颜色字符串）
  flatStading: true,
});
```

##### d、纹理（简单理解为皮肤）

```javascript
let _Texture = Three.ImageUtils.loadTexture('_TextureUrl');
let _Material = new Three.MeshPhongmaterial();
_Material.map = _Texture; // 材质的map属性处理纹理贴图
let _Mesh = new Three.Mesh(geom, _Material);
return _Mesh
```

#### 5、渲染器（Renderer）

Three.js的主要对象；在渲染器中传入一个场景（Scene）和一个相机（Camera），然后渲染器会将摄像机视锥体中的三维场景渲染成一个二位图片显示在画布上。

![image-20230416162359833](/Users/mac/Library/Application Support/typora-user-images/image-20230416162359833.png)

### 四、工程配置和库

#### 1、parcel官网

#### 2、tween.js官网

### 五、辅助工具

#### 1、AxesHelper

#### 2、lil-gui

#### 3、GridHelper

#### 4、OrbitControls轨道控制器

### 六、响应式设计

```javascript
window.addEventListener('resize', () => {
  _Camera.aspect = window.innerWidth / window.innerHeight
  _Camera.updateProjectionMatrix()

  _Renderer.setSize(window.innerWidth, window.innerHeight)
})
```

