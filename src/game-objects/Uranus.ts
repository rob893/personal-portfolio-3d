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

export class Uranus extends GameObject {
  protected getPrefabSettings(): PrefabSettings {
    return {
      name: 'Uranus',
      rotation: 0,
      tags: ['Uranus'],
      x: 287100000000,
      y: 0,
      z: 0
    };
  }

  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    return [new Rotator(this, 1.411)];
  }

  protected override getModel(_config: GameObjectConstructionParams): Object3D | undefined {
    const geometry = new SphereGeometry(25362000, 64, 64);
    const ringGeo = new RingGeometry(25362000, 43115000, 64);

    const ringTex = this.getAsset('urRing', Texture);

    const ringMat = new MeshBasicMaterial({
      map: ringTex,
      side: DoubleSide,
      opacity: 0.5,
      transparent: true,
      depthWrite: false
    });

    const texture = this.getAsset('urTex', Texture);

    const mat = new MeshStandardMaterial({
      map: texture
    });

    const ringMesh = new Mesh(ringGeo, ringMat);

    const mesh = new Mesh(geometry, mat);

    ringMesh.rotation.x = -0.5 * Math.PI;

    mesh.add(ringMesh);

    mesh.rotation.x = -0.5 * Math.PI;

    return mesh;
  }
}
