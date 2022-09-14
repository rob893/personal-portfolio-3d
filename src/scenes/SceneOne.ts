import {
  AmbientLight,
  CubeTexture,
  CubeTextureLoader,
  Event,
  Object3D,
  PerspectiveCamera,
  sRGBEncoding,
  TextureLoader
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GameScene } from '../engine/core/GameScene';
import earthTexture from '../assets/images/earth/earth.jpg';
import earthBumpMap from '../assets/images/earth/earthBumpMap.jpg';
import earthSpecular from '../assets/images/earth/earthSpecular.jpg';
import earthCloud from '../assets/images/earth/8k_earth_clouds.jpg';
import sunImage from '../assets/images/sun/sun.jpg';
import shipModelFile from '../assets/models/spaceship/Imperial.gltf';
import spaceNegX from '../assets/images/skybox/space-negx.jpg';
import spaceNegY from '../assets/images/skybox/space-negy.jpg';
import spaceNegZ from '../assets/images/skybox/space-negz.jpg';
import spacePosX from '../assets/images/skybox/space-posx.jpg';
import spacePosY from '../assets/images/skybox/space-posy.jpg';
import spacePosZ from '../assets/images/skybox/space-posz.jpg';
import mercTex from '../assets/images/mercury/mercury.jpg';
import venusTex from '../assets/images/venus/venus.jpg';
import marsTex from '../assets/images/mars/mars.jpg';
import jupTex from '../assets/images/jupiter/jupiter.jpg';
import satTex from '../assets/images/saturn/saturn.jpg';
import satRingTex from '../assets/images/saturn/saturn-ring.png';
import urTex from '../assets/images/uranus/uranus.jpg';
import urRing from '../assets/images/uranus/uranus-ring.png';
import nepTex from '../assets/images/neptune/neptune.jpg';
import { GameObject } from '../engine/core/GameObject';
import { GameEngine } from '../engine/GameEngine';
import { Earth } from '../game-objects/Earth';
import { Sun } from '../game-objects/Sun';
import { Ship } from '../game-objects/Ship';
import { Skybox } from '../game-objects/Skybox';
import { PlayerCameraRig } from '../game-objects/PlayerCameraRig';
import { Mercury } from '../game-objects/Mercury';
import { Venus } from '../game-objects/Venus';
import { Mars } from '../game-objects/Mars';
import { Jupiter } from '../game-objects/Jupiter';
import { Saturn } from '../game-objects/Saturn';
import { Uranus } from '../game-objects/Uranus';
import { Neptune } from '../game-objects/Neptune';
import { Orbiter } from '../game-objects/Orbiter';

export class SceneOne extends GameScene {
  protected async loadAssets(): Promise<Map<string, unknown>> {
    const assets = new Map<string, unknown>();

    const loader = new TextureLoader();
    const gltfLoader = new GLTFLoader();
    const cubeLoader = new CubeTextureLoader();

    const promises: [string, Promise<unknown>][] = [
      [
        'skyboxTexture',
        new Promise<CubeTexture>((resolve, reject) => {
          cubeLoader.load(
            [spacePosX, spaceNegX, spacePosY, spaceNegY, spacePosZ, spaceNegZ],
            tex => {
              tex.encoding - sRGBEncoding;
              resolve(tex);
            },
            undefined,
            err => reject(err)
          );
        })
      ],
      ['shipModel', gltfLoader.loadAsync(shipModelFile)],
      ['earthTexture', loader.loadAsync(earthTexture)],
      ['earthBump', loader.loadAsync(earthBumpMap)],
      ['earthSpecular', loader.loadAsync(earthSpecular)],
      ['cloudTexture', loader.loadAsync(earthCloud)],
      ['sunTexture', loader.loadAsync(sunImage)],
      ['mercTex', loader.loadAsync(mercTex)],
      ['venusTex', loader.loadAsync(venusTex)],
      ['marsTex', loader.loadAsync(marsTex)],
      ['jupTex', loader.loadAsync(jupTex)],
      ['satTex', loader.loadAsync(satTex)],
      ['satRingTex', loader.loadAsync(satRingTex)],
      ['urTex', loader.loadAsync(urTex)],
      ['urRing', loader.loadAsync(urRing)],
      ['nepTex', loader.loadAsync(nepTex)]
    ];

    const loadedAssets = await Promise.all(
      promises.map(async ([key, prom]) => {
        const asset = await prom;

        return {
          key,
          asset
        };
      })
    );

    for (const { key, asset } of loadedAssets) {
      assets.set(key, asset);
    }

    return assets;
  }

  protected buildInitialGameObjects(gameEngine: GameEngine): Object3D[] {
    const getRand = (min: number, max: number): number => Math.random() * (max - min + 1) + min;
    const farCamera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      10000000,
      Number.MAX_SAFE_INTEGER
    );
    const midCamera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 10000, 10000000);
    const nearCamera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000);
    farCamera.add(midCamera, nearCamera);

    return [
      farCamera,
      midCamera,
      nearCamera,
      new Skybox({ gameEngine }),
      new Ship({ gameEngine }),
      new PlayerCameraRig({ gameEngine }),
      new Sun({ gameEngine }),
      new Orbiter({ gameEngine, orbiteeCtor: Mercury, orbitSpeed: 4.15, startingRotation: getRand(0, 7) }),
      new Orbiter({ gameEngine, orbiteeCtor: Venus, orbitSpeed: 1.62, startingRotation: getRand(0, 7) }),
      new Orbiter({ gameEngine, orbiteeCtor: Earth, orbitSpeed: 1, startingRotation: 0 }),
      new Orbiter({ gameEngine, orbiteeCtor: Mars, orbitSpeed: 0.53, startingRotation: getRand(0, 7) }),
      new Orbiter({ gameEngine, orbiteeCtor: Jupiter, orbitSpeed: 0.084, startingRotation: getRand(0, 7) }),
      new Orbiter({ gameEngine, orbiteeCtor: Saturn, orbitSpeed: 0.0339, startingRotation: getRand(0, 7) }),
      new Orbiter({ gameEngine, orbiteeCtor: Uranus, orbitSpeed: 0.0119, startingRotation: getRand(0, 7) }),
      new Orbiter({ gameEngine, orbiteeCtor: Neptune, orbitSpeed: 0.006068, startingRotation: getRand(0, 7) })
    ];
  }

  protected buildStaticObjects(_gameEngine: GameEngine): Object3D<Event>[] {
    return [new AmbientLight(0x333333)];
  }
}
