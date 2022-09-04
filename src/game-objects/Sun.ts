import { Mesh, MeshBasicMaterial, PointLight, SphereGeometry, Texture } from 'three';
import { Rotator } from '../components/Rotator';
import { Component } from '../engine/core/components/Component';
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

  protected override getMesh(_config: GameObjectConstructionParams): Mesh | undefined {
    const geometry = new SphereGeometry(1, 32, 32);

    const texture = this.getAsset('sunTexture', Texture);

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
}
