import { ThirdPersonCameraController } from '../components/ThirdPersonCameraController';
import { Component } from '../engine/core/components/Component';
import { GameObject } from '../engine/core/GameObject';
import { GameObjectConstructionParams } from '../engine/core/types/GameObjectConstructionParams';
import { PrefabSettings } from '../engine/core/types/PrefabSettings';

export class PlayerCameraRig extends GameObject {
  protected getPrefabSettings(): PrefabSettings {
    return {
      name: 'PlayerCameraRig',
      rotation: 0,
      tags: ['PlayerCameraRig'],
      x: 0,
      y: 0,
      z: 0
    };
  }
  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    return [new ThirdPersonCameraController(this)];
  }
}
