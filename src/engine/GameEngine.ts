import { Camera, PerspectiveCamera, Renderer, Vector3, WebGLRenderer } from 'three';
import { GameObject } from './core/GameObject';
import { GameScene } from './core/GameScene';
import { Input } from './core/Input';
import { Time } from './core/Time';
import { GameObjectConstructionParams } from './core/types/GameObjectConstructionParams';
import { InstantiateOptions } from './core/types/InstantiateOptions';

export class GameEngine {
  public developmentMode: boolean = true;

  private gameLoopId: number | null = null;
  private prevFrameTime: number = 0;
  private fpsIntervalInMS: number = 0;
  private fpsCap: number = 60;
  private currentScene: GameScene | null = null;
  private scenes: GameScene[] = [];
  private currentSceneAssets = new Map<string, unknown>();

  private readonly gameObjects: GameObject[] = [];
  private readonly camera: Camera;
  private readonly renderer: Renderer;
  private readonly timeObj: Time;
  private readonly inputObj: Input;

  public constructor() {
    this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1.0, 10000);
    this.renderer = new WebGLRenderer();
    this.timeObj = new Time();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.inputObj = new Input(this.renderer.domElement);
    this.camera.position.z = 50;
  }

  public get time(): Time {
    return this.timeObj;
  }

  public get input(): Input {
    return this.inputObj;
  }

  public get mainCamera(): Camera {
    return this.camera;
  }

  public get domCanvasElement(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  public get fpsLimit(): number {
    return this.fpsCap;
  }

  public set fpsLimit(value: number) {
    this.fpsCap = value;
    this.fpsIntervalInMS = Math.floor(1000 / value);
  }

  public findGameObjectByName(name: string): GameObject | undefined {
    return this.gameObjects.find(x => x.name === name);
  }

  public findGameObjectsByName(name: string): GameObject[] {
    return this.gameObjects.filter(x => x.name === name);
  }

  public findGameObjectById(id: number): GameObject | undefined {
    return this.gameObjects.find(x => x.id === id);
  }

  public findGameObjectWithTag(tag: string): GameObject | undefined {
    return this.gameObjects.find(x => x.tags.includes(tag));
  }

  public findGameObjectsWithTag(tag: string): GameObject[] {
    return this.gameObjects.filter(x => x.tags.includes(tag));
  }

  public instantiate<T extends GameObject>(
    type: new (constructionParams: GameObjectConstructionParams) => T,
    options?: InstantiateOptions
  ): GameObject {
    const { position, parent, rotation } = options ?? {};
    const newGameObject = new type({ gameEngine: this });

    if (position !== undefined) {
      newGameObject.position.add(position);
    }

    // if (rotation !== undefined) {
    //   newGameObject.transform.rotation = rotation;
    // }

    if (parent !== undefined) {
      newGameObject.parent = parent;
    }

    this.registerGameObject(newGameObject);

    return newGameObject;
  }

  public getAsset<T>(key: string, assertType?: new () => T): T {
    const asset = this.currentSceneAssets.get(key);

    if (!asset) {
      throw new Error(`No asset loaded for key ${key}.`);
    }

    if (assertType && !(asset instanceof assertType)) {
      throw new Error(`Asset loaded for key ${key} is not of type ${assertType.prototype.name}`);
    }

    return asset as T;
  }

  public setScenes(...scenes: GameScene[]): void {
    this.scenes = [...scenes];
  }

  public async loadScene(sceneOrIndex: GameScene | number): Promise<void> {
    if (typeof sceneOrIndex === 'number') {
      if (sceneOrIndex < 0 || sceneOrIndex >= this.scenes.length) {
        throw new Error('Invalid scene index.');
      }

      this.currentScene = this.scenes[sceneOrIndex];
    } else {
      this.currentScene = sceneOrIndex;
    }

    this.gameObjects.clear();

    await this.currentScene.initializeAssets();
    this.currentSceneAssets = this.currentScene.assets;

    this.currentScene.initializeGameObjects(this);

    for (const obj of this.currentScene.gameObjects) {
      this.registerGameObject(obj);
    }

    this.startGame();
  }

  public startGame(): void {
    this.gameLoopId = requestAnimationFrame(timeStamp => this.gameLoop(timeStamp));
  }

  private registerGameObject(newGameObject: GameObject): void {
    this.gameObjects.push(newGameObject);

    newGameObject.start();

    for (const child of newGameObject.children) {
      if (child instanceof GameObject) {
        this.registerGameObject(child);
      }
    }
  }

  private update(timeStamp: number): void {
    if (!this.currentScene) {
      throw new Error('No scene is loaded!');
    }

    this.timeObj.updateTime(timeStamp);

    for (let i = 0; i < this.gameObjects.length; i++) {
      this.gameObjects[i].update();
    }

    this.renderer.render(this.currentScene, this.mainCamera);
  }

  private gameLoop(timeStamp: number): void {
    const now = performance.now();
    const diff = now - this.prevFrameTime;

    if (diff >= this.fpsIntervalInMS) {
      this.prevFrameTime = now;
      this.update(timeStamp);
    }

    this.gameLoopId = requestAnimationFrame(newTimeStamp => this.gameLoop(newTimeStamp));
  }
}
