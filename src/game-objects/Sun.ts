import { Mesh, MeshBasicMaterial, Object3D, PointLight, SphereGeometry, Texture } from 'three';
import { Rotator } from '../components/Rotator';
import { Component } from '../engine/core/components/Component';
import { GameObject } from '../engine/core/GameObject';
import { GameObjectConstructionParams } from '../engine/core/types/GameObjectConstructionParams';
import { PrefabSettings } from '../engine/core/types/PrefabSettings';

export class Sun extends GameObject {
  protected getPrefabSettings(): PrefabSettings {
    return {
      name: 'Sun',
      rotation: 0,
      tags: ['sun'],
      x: 0,
      y: 0,
      z: 0
    };
  }

  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    return [new Rotator(this, 0.04)];
  }

  protected override getModel(_config: GameObjectConstructionParams): Object3D | undefined {
    const geometry = new SphereGeometry(10900000, 64, 64);

    const texture = this.getAsset('sunTexture', Texture);

    const sunMesh = new MeshBasicMaterial({
      map: texture,
      depthWrite: false
    });

    const sun = new Mesh(geometry, sunMesh);

    const light = new PointLight(0xffffff, 2, 3000000000, 2);
    sun.add(light);

    return sun;
  }
}
