import {
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Object3D,
  SphereGeometry,
  Texture
} from 'three';
import { Rotator } from '../components/Rotator';
import { Component } from '../engine/core/components/Component';
import { GameObject } from '../engine/core/GameObject';
import { GameObjectConstructionParams } from '../engine/core/types/GameObjectConstructionParams';
import { PrefabSettings } from '../engine/core/types/PrefabSettings';

class EarthClouds extends GameObject {
  protected getPrefabSettings(): PrefabSettings {
    return {
      name: 'EarthClouds',
      rotation: 0,
      tags: ['EarthClouds'],
      x: 0,
      y: 0,
      z: 0
    };
  }

  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    return [new Rotator(this, 1.15)];
  }

  protected override getModel(_config: GameObjectConstructionParams): Object3D | undefined {
    const cloudTex = this.getAsset('cloudTexture', Texture);

    const cloudGeo = new SphereGeometry(101500, 64, 64);
    const cloudMat = new MeshBasicMaterial({
      map: cloudTex,
      side: DoubleSide,
      opacity: 0.3,
      transparent: true,
      depthWrite: false
    });
    const cloudMesh = new Mesh(cloudGeo, cloudMat);

    return cloudMesh;
  }
}

export class Earth extends GameObject {
  protected getPrefabSettings(): PrefabSettings {
    // 2325000000 x if distance full scaled
    return {
      name: 'Earth',
      rotation: 0,
      tags: ['earth'],
      x: 30000000,
      y: 0,
      z: 0
    };
  }

  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    return [new Rotator(this, 1)];
  }

  protected override getModel(_config: GameObjectConstructionParams): Object3D | undefined {
    const geometry = new SphereGeometry(100000, 64, 64);

    const texture = this.getAsset('earthTexture', Texture);
    const bump = this.getAsset('earthBump', Texture);
    const specular = this.getAsset('earthSpecular', Texture);

    const earthMesh = new MeshPhongMaterial({
      map: texture,
      bumpMap: bump,
      bumpScale: 0.05,
      specular: new Color('grey'),
      specularMap: specular
    });

    const earth = new Mesh(geometry, earthMesh);

    return earth;
  }

  protected override buildAndReturnChildGameObjects(
    config: GameObjectConstructionParams
  ): GameObject<GameObjectConstructionParams>[] {
    return [new EarthClouds(config)];
  }
}
