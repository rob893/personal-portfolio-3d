import {
  BackSide,
  CubeCamera,
  DoubleSide,
  IUniform,
  LinearMipmapLinearFilter,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PointLight,
  RGBAFormat,
  RGBFormat,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  sRGBEncoding,
  Texture,
  Vector3,
  Vector4,
  WebGLCubeRenderTarget,
  WebGLRenderer
} from 'three';
import { Rotator } from '../components/Rotator';
import { Component } from '../engine/core/components/Component';
import { GameObject } from '../engine/core/GameObject';
import { GameObjectConstructionParams } from '../engine/core/types/GameObjectConstructionParams';
import { PrefabSettings } from '../engine/core/types/PrefabSettings';
import sunFragShader from '../shaders/sun-fragment.glsl';
import sunVertShader from '../shaders/sun-vertex.glsl';
import sun2FragShader from '../shaders/sun2-fragment.glsl';
import sun2VertShader from '../shaders/sun2-vertex.glsl';
import sunAuraFragShader from '../shaders/sun-aura-fragment.glsl';
import sunAuraVertShader from '../shaders/sun-aura-vertex.glsl';

export class Sun extends GameObject {
  private uniforms: { [uniform: string]: IUniform } | undefined;
  private materialSun: ShaderMaterial | undefined;
  private auraUniforms:
    | { time: { value: number }; resolution: { value: Vector4 }; uPerlin: { value: null } }
    | undefined;
  private materialAura: ShaderMaterial | undefined;

  private readonly uniforms2: { [uniform: string]: IUniform } | undefined;
  private readonly cubeRendererTarget: WebGLCubeRenderTarget;
  private readonly cubeCamera: CubeCamera;
  private readonly materialPerlin: ShaderMaterial;
  private readonly texScene = new Scene();

  public constructor(config: GameObjectConstructionParams) {
    super(config);

    this.cubeRendererTarget = new WebGLCubeRenderTarget(256, {
      format: RGBAFormat,
      generateMipmaps: true,
      minFilter: LinearMipmapLinearFilter,
      encoding: sRGBEncoding
    });

    this.cubeCamera = new CubeCamera(0.1, 10, this.cubeRendererTarget);

    if (!this.uniforms2) {
      this.uniforms2 = {
        time: { value: 0 },
        uPerlin: { value: null },
        resolution: { value: new Vector4() }
      };
    }

    const geometry = new SphereGeometry(1, 32, 32);

    this.materialPerlin = new ShaderMaterial({
      uniforms: this.uniforms2,
      side: DoubleSide,
      vertexShader: sunVertShader,
      //depthWrite: false,
      fragmentShader: sunFragShader
    });

    const sunPerlin = new Mesh(geometry, this.materialPerlin);
    this.texScene.add(sunPerlin);
  }

  public override update(): void {
    super.update();

    // if (!this.uniforms || !this.materialSun || !this.uniforms2) {
    //   return;
    // }

    if (!this.materialSun) {
      return;
    }

    this.cubeCamera.update(this.engine.renderer as WebGLRenderer, this.texScene);
    this.materialSun.uniforms.uPerlin.value = this.cubeRendererTarget.texture;
    this.materialSun.uniforms.time.value = this.time.totalTime;

    this.materialPerlin.uniforms.time.value = this.time.totalTime;
  }

  protected getPrefabSettings(): PrefabSettings {
    return {
      name: 'Sun',
      rotation: 0,
      tags: ['sun'],
      x: 0,
      y: 0,
      z: 0
    };
  }

  protected buildInitialComponents(_config: GameObjectConstructionParams): Component[] {
    return [new Rotator(this, 0.04)];
  }

  protected override getModel(_config: GameObjectConstructionParams): Object3D | undefined {
    const geometry = new SphereGeometry(10900000, 64, 64);

    const texture = this.getAsset('sunTexture', Texture);

    // const sunMesh = new MeshBasicMaterial({
    //   map: texture
    // });

    this.uniforms = {
      time: { value: 0 },
      resolution: { value: new Vector4() },
      uPerlin: { value: null }
    };

    this.materialSun = new ShaderMaterial({
      uniforms: this.uniforms,
      side: DoubleSide,
      vertexShader: sun2VertShader,
      fragmentShader: sun2FragShader
    });

    const sun = new Mesh(geometry, this.materialSun);

    this.auraUniforms = {
      time: { value: 0 },
      resolution: { value: new Vector4() },
      uPerlin: { value: null }
    };

    this.materialAura = new ShaderMaterial({
      uniforms: this.auraUniforms,
      extensions: {
        derivatives: true
      },
      side: BackSide,
      vertexShader: sunAuraVertShader,
      fragmentShader: sunAuraFragShader
    });

    const auraGeometry = new SphereGeometry(13900000, 64, 64);

    const sunAura = new Mesh(auraGeometry, this.materialAura);

    const light = new PointLight(0xffffff, 2, 13000000000, 2);
    sun.add(light);

    return sun;
  }
}
