import { Color, DoubleSide, Mesh, MeshPhongMaterial, Object3D, SphereGeometry, Texture } from 'three';
import { Rotator } from '../components/Rotator';
import { Component } from '../engine/core/components/Component';
import { GameObject } from '../engine/core/GameObject';
import { GameObjectConstructionParams } from '../engine/core/types/GameObjectConstructionParams';
import { PrefabSettings } from '../engine/core/types/PrefabSettings';

export class Earth extends GameObject {
  protected getPrefabSettings(): PrefabSettings {
    return {
      name: 'Earth',
      rotation: 5,
      tags: ['earth'],
      x: 3,
      y: 0,
      z: 0
    };
  }

  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    return [new Rotator(this)];
  }

  protected override getModel(_config: GameObjectConstructionParams): Object3D | undefined {
    const geometry = new SphereGeometry(1, 32, 32);

    const texture = this.getAsset('earthTexture', Texture);
    const bump = this.getAsset('earthBump', Texture);
    const specular = this.getAsset('earthSpecular', Texture);
    const cloudTex = this.getAsset('ckoudTexture', Texture);

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
}
