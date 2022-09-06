import {
  AmbientLight,
  BackSide,
  CubeTexture,
  CubeTextureLoader,
  Event,
  Mesh,
  Object3D,
  ShaderMaterial,
  SphereGeometry,
  sRGBEncoding,
  TextureLoader
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GameScene } from '../engine/core/GameScene';
import earthTexture from '../assets/images/earth/earth.jpg';
import earthBumpMap from '../assets/images/earth/earthBumpMap.jpg';
import earthSpecular from '../assets/images/earth/earthSpecular.jpg';
import earthCloud from '../assets/images/earth/earthClouds.png';
import sunImage from '../assets/images/sun/sun.jpg';
import shipModelFile from '../assets/models/spaceship/Imperial.gltf';
import spaceNegX from '../assets/images/skybox/space-negx.jpg';
import spaceNegY from '../assets/images/skybox/space-negy.jpg';
import spaceNegZ from '../assets/images/skybox/space-negz.jpg';
import spacePosX from '../assets/images/skybox/space-posx.jpg';
import spacePosY from '../assets/images/skybox/space-posy.jpg';
import spacePosZ from '../assets/images/skybox/space-posz.jpg';
import { GameObject } from '../engine/core/GameObject';
import { GameEngine } from '../engine/GameEngine';
import { Earth } from '../game-objects/Earth';
import { Sun } from '../game-objects/Sun';
import { Ship } from '../game-objects/Ship';
import { Skybox } from '../game-objects/Skybox';

export class SceneOne extends GameScene {
  protected async loadAssets(): Promise<Map<string, unknown>> {
    const assets = new Map<string, unknown>();

    const loader = new TextureLoader();
    const gltfLoader = new GLTFLoader();
    const cubeLoader = new CubeTextureLoader();

    const skyboxTexure = await new Promise<CubeTexture>((resolve, reject) => {
      cubeLoader.load(
        [spacePosX, spaceNegX, spacePosY, spaceNegY, spacePosZ, spaceNegZ],
        tex => resolve(tex),
        undefined,
        err => reject(err)
      );
    });
    skyboxTexure.encoding = sRGBEncoding;

    assets.set('skyboxTexture', skyboxTexure);

    const shipModel = await gltfLoader.loadAsync(shipModelFile);

    const earthTextureAsset = await loader.loadAsync(earthTexture);
    const earthBumpAsset = await loader.loadAsync(earthBumpMap);
    const earthSpecularAsset = await loader.loadAsync(earthSpecular);
    const earthCloudTexAsset = await loader.loadAsync(earthCloud);
    const sunTexture = await loader.loadAsync(sunImage);

    assets.set('shipModel', shipModel);
    assets.set('earthTexture', earthTextureAsset);
    assets.set('earthBump', earthBumpAsset);
    assets.set('earthSpecular', earthSpecularAsset);
    assets.set('ckoudTexture', earthCloudTexAsset);
    assets.set('sunTexture', sunTexture);

    return assets;
  }

  protected buildInitialGameObjects(gameEngine: GameEngine): GameObject[] {
    return [new Earth({ gameEngine }), new Sun({ gameEngine }), new Ship({ gameEngine }), new Skybox({ gameEngine })];
  }

  protected buildStaticObjects(_gameEngine: GameEngine): Object3D<Event>[] {
    return [new AmbientLight(0x101010, 15)];
  }
}
