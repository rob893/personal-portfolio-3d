import { Object3D, Event, CubeTexture, BackSide, Mesh, ShaderMaterial, SphereGeometry } from 'three';
import { Component } from '../engine/core/components/Component';
import { GameObject } from '../engine/core/GameObject';
import { GameObjectConstructionParams } from '../engine/core/types/GameObjectConstructionParams';
import { PrefabSettings } from '../engine/core/types/PrefabSettings';
import skyFragmentShader from '../shaders/skybox-fragment.glsl';
import skyVertexShader from '../shaders/skybox-vertex.glsl';

export class Skybox extends GameObject {
  protected getPrefabSettings(): PrefabSettings {
    return {
      name: 'Skybox',
      rotation: 0,
      tags: [],
      x: 0,
      y: 0,
      z: 0
    };
  }
  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    return [];
  }

  protected override getModel(_config: GameObjectConstructionParams): Object3D<Event> | undefined {
    const skyboxTexture = this.getAsset('skyboxTexture', CubeTexture);
    const uniforms = {
      background: { value: skyboxTexture }
    };
    const skyGeo = new SphereGeometry(15000000000, 32, 32);
    const skyMat = new ShaderMaterial({
      uniforms,
      vertexShader: skyVertexShader,
      fragmentShader: skyFragmentShader,
      side: BackSide,
      depthWrite: false
    });
    const skybox = new Mesh(skyGeo, skyMat);

    return skybox;
  }
}
