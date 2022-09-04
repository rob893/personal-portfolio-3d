import { Camera, PerspectiveCamera, Renderer, WebGLRenderer } from 'three';
import { GameObject } from './core/GameObject';
import { GameScene } from './core/GameScene';
import { Input } from './core/Input';
import { Time } from './core/Time';

export class GameEngine {
  public developmentMode: boolean = true;

  private gameLoopId: number | null = null;
  private prevFrameTime: number = 0;
  private fpsIntervalInMS: number = 0;
  private fpsCap: number = 60;
  private currentScene: GameScene | null = null;
  private scenes: GameScene[] = [];
  private gameObjects: GameObject[] = [];
  private currentSceneAssets = new Map<string, unknown>();

  private readonly mainCamera: Camera;
  private readonly renderer: Renderer;
  private readonly time: Time;
  private readonly input: Input;

  public constructor() {
    this.mainCamera = new PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new WebGLRenderer();
    this.time = new Time();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.input = new Input(this.renderer.domElement);
    this.mainCamera.position.z = 50;
  }

  public get fpsLimit(): number {
    return this.fpsCap;
  }

  public set fpsLimit(value: number) {
    this.fpsCap = value;
    this.fpsIntervalInMS = Math.floor(1000 / value);
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

    await this.currentScene.initializeAssets();
    this.currentSceneAssets = this.currentScene.assets;

    this.currentScene.initializeGameObjects(this);
    this.gameObjects = this.currentScene.gameObjects;

    this.startGame();
  }

  public startGame(): void {
    this.gameLoopId = requestAnimationFrame(timeStamp => this.gameLoop(timeStamp));
  }

  private update(timeStamp: number): void {
    if (!this.currentScene) {
      throw new Error('No scene is loaded!');
    }

    this.time.updateTime(timeStamp);

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
