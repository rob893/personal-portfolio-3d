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
      name: 'player',
      rotation: 0,
      tags: ['ship', 'player'],
      x: 30000000,
      y: 0,
      z: 150000
    };
  }

  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    return [new ShipController(this)];
  }

  protected override getModel(_config: GameObjectConstructionParams): Object3D | undefined {
    const model = this.getAsset<GLTF>('shipModel');
    // model.scene.scale.multiplyScalar(0.00001);

    return model.scene;
  }
}
