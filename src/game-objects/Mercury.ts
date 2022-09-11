import { Mesh, MeshStandardMaterial, Object3D, SphereGeometry, Texture } from 'three';
import { Rotator } from '../components/Rotator';
import { Component } from '../engine/core/components/Component';
import { GameObject } from '../engine/core/GameObject';
import { GameObjectConstructionParams } from '../engine/core/types/GameObjectConstructionParams';
import { PrefabSettings } from '../engine/core/types/PrefabSettings';

export class Mercury extends GameObject {
  protected getPrefabSettings(): PrefabSettings {
    return {
      name: 'Mercury',
      rotation: 0,
      tags: ['Mercury'],
      x: 11700000,
      y: 0,
      z: 0
    };
  }

  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    return [new Rotator(this, 0.017)];
  }

  protected override getModel(_config: GameObjectConstructionParams): Object3D | undefined {
    const geometry = new SphereGeometry(30000, 64, 64);

    const texture = this.getAsset('mercTex', Texture);

    const mat = new MeshStandardMaterial({
      map: texture
    });

    const mesh = new Mesh(geometry, mat);

    return mesh;
  }
}
