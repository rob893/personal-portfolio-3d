import { Scene } from 'three';
import { GameEngine } from '../GameEngine';
import { GameObject } from './GameObject';

export abstract class GameScene extends Scene {
  private readonly objects = new Set<GameObject>();

  private sceneAssets = new Map<string, unknown>();

  private objectsInitialized = false;

  private assetsInitialized = false;

  public get gameObjects(): GameObject[] {
    if (!this.objectsInitialized) {
      throw new Error("The scene must be initialized before accessing the scene's game objects.");
    }

    return [...this.objects];
  }

  public get assets(): Map<string, unknown> {
    if (!this.assetsInitialized) {
      throw new Error("The scene must be initialized before accessing the scene's assets.");
    }

    return this.sceneAssets;
  }

  public get sceneInitialized(): boolean {
    return this.objectsInitialized && this.assetsInitialized;
  }

  public override add(...object: GameObject[]): this {
    if (!object || object.length === 0) {
      return this;
    }

    super.add(...object);

    for (const obj of object) {
      this.objects.add(obj);
    }

    return this;
  }

  public async initializeAssets(): Promise<void> {
    this.sceneAssets = await this.loadAssets();
    this.assetsInitialized = true;
  }

  public initializeGameObjects(gameEngine: GameEngine): void {
    if (!this.assetsInitialized) {
      throw new Error("The scene's assets must be loaded before loading initializing the game objects.");
    }

    this.add(...this.buildInitialGameObjects(gameEngine));
    this.objectsInitialized = true;
  }

  protected abstract buildInitialGameObjects(gameEngine: GameEngine): GameObject[];

  protected abstract loadAssets(): Promise<Map<string, unknown>>;
}
