import {
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  RingGeometry,
  SphereGeometry,
  Texture
} from 'three';
import { Rotator } from '../components/Rotator';
import { Component } from '../engine/core/components/Component';
import { GameObject } from '../engine/core/GameObject';
import { GameObjectConstructionParams } from '../engine/core/types/GameObjectConstructionParams';
import { PrefabSettings } from '../engine/core/types/PrefabSettings';

export class Saturn extends GameObject {
  protected getPrefabSettings(): PrefabSettings {
    return {
      name: 'Saturn',
      rotation: 0,
      tags: ['Saturn'],
      x: 287400000,
      y: 0,
      z: 0
    };
  }

  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    return [new Rotator(this, 2.18)];
  }

  protected override getModel(_config: GameObjectConstructionParams): Object3D | undefined {
    const geometry = new SphereGeometry(900000, 64, 64);
    const ringGeo = new RingGeometry(1000000, 2000000, 64);

    const texture = this.getAsset('satTex', Texture);
    const ringTex = this.getAsset('satRingTex', Texture);

    const ringMat = new MeshBasicMaterial({
      map: ringTex,
      side: DoubleSide,
      opacity: 0.75,
      transparent: true,
      depthWrite: false
    });
    const mat = new MeshStandardMaterial({
      map: texture
    });

    const ringMesh = new Mesh(ringGeo, ringMat);
    const mesh = new Mesh(geometry, mat);

    ringMesh.rotation.x = -0.5 * Math.PI;

    mesh.add(ringMesh);

    return mesh;
  }
}
