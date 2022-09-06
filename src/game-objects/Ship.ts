import { Object3D } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { Component } from '../engine/core/components/Component';
import { ShipController } from '../components/ShipController';
import { GameObject } from '../engine/core/GameObject';
import { GameObjectConstructionParams } from '../engine/core/types/GameObjectConstructionParams';
import { PrefabSettings } from '../engine/core/types/PrefabSettings';

export class Ship extends GameObject {
  protected getPrefabSettings(): PrefabSettings {
    return {
      name: 'Ship',
      rotation: 5,
      tags: ['ship'],
      x: 300,
      y: 0,
      z: 0
    };
  }

  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    return [new ShipController(this)];
  }

  protected override getModel(_config: GameObjectConstructionParams): Object3D | undefined {
    const model = this.getAsset<GLTF>('shipModel');

    return model.scene;
  }
}
