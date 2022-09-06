import { Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, PointLight, SphereGeometry, Texture } from 'three';
import { Rotator } from '../components/Rotator';
import { Component } from '../engine/core/components/Component';
import { Color } from '../engine/core/enums/Color';
import { GameObject } from '../engine/core/GameObject';
import { GameObjectConstructionParams } from '../engine/core/types/GameObjectConstructionParams';
import { PrefabSettings } from '../engine/core/types/PrefabSettings';

export class Sun extends GameObject {
  protected getPrefabSettings(): PrefabSettings {
    return {
      name: 'Sun',
      rotation: 5,
      tags: ['sun'],
      x: 0,
      y: 0,
      z: 0
    };
  }

  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    return [new Rotator(this)];
  }

  protected override getModel(_config: GameObjectConstructionParams): Object3D | undefined {
    const geometry = new SphereGeometry(100, 32, 32);

    const texture = this.getAsset('sunTexture', Texture);

    const sunMesh = new MeshStandardMaterial({
      map: texture,
      emissive: Color.Yellow,
      emissiveIntensity: 0.1
    });

    const sun = new Mesh(geometry, sunMesh);

    const light = new PointLight(0xffffff, 10, 3000);
    sun.add(light);

    return sun;
  }
}
