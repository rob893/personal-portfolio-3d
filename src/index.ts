import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  MeshPhongMaterial,
  ImageUtils,
  TextureLoader,
  Color,
  DirectionalLight,
  DoubleSide,
  PointLight
} from 'three';
import { bindLinqToNativeTypes } from 'typescript-extended-linq';
import earthTexture from './assets/images/earth/earth.jpg';
import earthBumpMap from './assets/images/earth/earthBumpMap.jpg';
import earthSpecular from './assets/images/earth/earthSpecular.jpg';
import earthCloud from './assets/images/earth/earthClouds.png';
import marsImage from './assets/images/mars/mars.jpg';
import sunImage from './assets/images/sun/sun.jpg';
import backgroundImage from './assets/images/background.jpg';

bindLinqToNativeTypes();

async function getEarthMesh(loader: TextureLoader): Promise<Mesh> {
  const geometry = new SphereGeometry(1, 32, 32);

  const texture = await loader.loadAsync(earthTexture);
  const bump = await loader.loadAsync(earthBumpMap);
  const specular = await loader.loadAsync(earthSpecular);
  const cloudTex = await loader.loadAsync(earthCloud);

  const cloudGeo = new SphereGeometry(1.005, 32, 32);
  const cloudMat = new MeshPhongMaterial({
    map: cloudTex,
    side: DoubleSide,
    opacity: 0.3,
    transparent: true,
    depthWrite: false
  });
  const cloudMesh = new Mesh(cloudGeo, cloudMat);

  const earthMesh = new MeshPhongMaterial({
    map: texture,
    bumpMap: bump,
    bumpScale: 0.05,
    specular: new Color('grey'),
    specularMap: specular
  });

  const earth = new Mesh(geometry, earthMesh);
  earth.add(cloudMesh);

  return earth;
}

async function getMars(loader: TextureLoader): Promise<Mesh> {
  const geometry = new SphereGeometry(1, 32, 32);

  const texture = await loader.loadAsync(marsImage);

  const marsMesh = new MeshPhongMaterial({
    map: texture
  });

  const mars = new Mesh(geometry, marsMesh);

  return mars;
}

async function getSun(loader: TextureLoader): Promise<Mesh> {
  const geometry = new SphereGeometry(1, 32, 32);

  const texture = await loader.loadAsync(sunImage);

  const sunMesh = new MeshBasicMaterial({
    map: texture
    // emissive: 0xffffff,
    // emissiveIntensity: 0.1
  });

  const sun = new Mesh(geometry, sunMesh);

  const light = new PointLight(0xffffff, 1, 10);
  sun.add(light);

  return sun;
}

async function main(): Promise<void> {
  const scene = new Scene();
  const camera = new PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const loader = new TextureLoader();

  const backgroundTexture = await loader.loadAsync(backgroundImage);
  scene.background = backgroundTexture;

  const earth = await getEarthMesh(loader);
  const mars = await getMars(loader);
  const sun = await getSun(loader);

  scene.add(sun, mars, earth);

  earth.translateX(-3);
  mars.translateX(4);

  sun.translateX(0);

  camera.position.z = 50;

  function animate(): void {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.005;
    //cloudMesh.rotation.y += 0.006;

    renderer.render(scene, camera);
  }

  animate();

  //const material = new MeshBasicMaterial({ color: 0xffff00 });
  // const earth = new Mesh(geometry, material);
  // scene.add(earth);
}

main();
