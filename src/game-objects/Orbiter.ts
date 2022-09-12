import { Rotator } from '../components/Rotator';
import { Component } from '../engine/core/components/Component';
import { GameObject } from '../engine/core/GameObject';
import { GameObjectConstructionParams } from '../engine/core/types/GameObjectConstructionParams';
import { PrefabSettings } from '../engine/core/types/PrefabSettings';

export interface OrbiterConfig extends GameObjectConstructionParams {
  orbiteeCtor: new (config: GameObjectConstructionParams) => GameObject;
  orbitSpeed: number;
  startingRotation: number;
}

export class Orbiter extends GameObject<OrbiterConfig> {
  protected getPrefabSettings(): PrefabSettings {
    return {
      name: 'Orbiter',
      rotation: 0,
      tags: ['Orbiter'],
      x: 0,
      y: 0,
      z: 0
    };
  }

  protected buildInitialComponents({ orbitSpeed, startingRotation }: OrbiterConfig): Component[] {
    return [new Rotator(this, orbitSpeed * 0.001, startingRotation)];
  }

  protected override buildAndReturnChildGameObjects(config: OrbiterConfig): GameObject<GameObjectConstructionParams>[] {
    return [new config.orbiteeCtor(config)];
  }
}
