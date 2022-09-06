import { GameObject } from '../GameObject';
import { Input } from '../Input';
import { Time } from '../Time';
import { GameObjectConstructionParams } from '../types/GameObjectConstructionParams';
import { InstantiateOptions } from '../types/InstantiateOptions';

export abstract class Component {
  public readonly gameObject: GameObject;

  private isEnabled: boolean = true;

  public constructor(gameObject: GameObject, enabled: boolean = true) {
    this.gameObject = gameObject;
    this.isEnabled = enabled;
  }

  public get input(): Input {
    return this.gameObject.input;
  }

  public get time(): Time {
    return this.gameObject.time;
  }

  public get enabled(): boolean {
    if (!this.gameObject.enabled) {
      return false;
    }

    return this.isEnabled;
  }

  public set enabled(enabled: boolean) {
    if (enabled === this.isEnabled) {
      return;
    }

    this.isEnabled = enabled;

    if (enabled) {
      this.onEnabled();
    } else {
      this.onDisabled();
    }
  }

  public start(): void {}

  public update(): void {}

  public onEnabled(): void {}

  public onDisabled(): void {}

  public onDestroy(): void {}

  public getAsset<T>(key: string, assertType?: new () => T): T {
    return this.gameObject.getAsset(key, assertType);
  }

  public findGameObjectByName(name: string): GameObject | undefined {
    return this.gameObject.findGameObjectByName(name);
  }

  public findGameObjectsByName(name: string): GameObject[] {
    return this.gameObject.findGameObjectsByName(name);
  }

  public findGameObjectById(id: number): GameObject | undefined {
    return this.gameObject.findGameObjectById(id);
  }

  public findGameObjectWithTag(tag: string): GameObject | undefined {
    return this.gameObject.findGameObjectWithTag(tag);
  }

  public findGameObjectsWithTag(tag: string): GameObject[] {
    return this.gameObject.findGameObjectsWithTag(tag);
  }

  public instantiate<T extends GameObject>(
    type: new (constructionParams: GameObjectConstructionParams) => T,
    options?: InstantiateOptions
  ): GameObject {
    return this.gameObject.instantiate(type, options);
  }
}
