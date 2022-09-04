import { Event, Mesh, Object3D } from 'three';
import { GameEngine } from '../GameEngine';
import { Component } from './components/Component';
import { GameObjectConstructionParams } from './types/GameObjectConstructionParams';
import { PrefabSettings } from './types/PrefabSettings';

export abstract class GameObject<
  TConfig extends GameObjectConstructionParams = GameObjectConstructionParams
> extends Object3D {
  public readonly tags: string[] = [];
  public readonly mesh: Mesh | undefined;

  private isEnabled = true;

  private readonly updatableComponents: Component[] = [];
  private readonly componentMap = new Map<new (...args: unknown[]) => Component, Component[]>();
  private readonly gameEngine: GameEngine;

  public constructor(config: TConfig) {
    super();
    const prefabSettings = this.getPrefabSettings();
    const {
      gameEngine,
      name = prefabSettings.name,
      rotation = prefabSettings.rotation,
      tags = prefabSettings.tags,
      x = prefabSettings.x,
      y = prefabSettings.y,
      z = prefabSettings.z
    } = config;
    this.gameEngine = gameEngine;
    this.name = name;
    this.tags.push(...tags);

    this.translateX(x);
    this.translateY(y);
    this.translateZ(z);

    const initialComponents = this.buildInitialComponents(config);
    this.setComponents(initialComponents);

    this.mesh = this.getMesh(config);

    if (this.mesh) {
      // Ensure to use super here as mesh is threejs object.
      super.add(this.mesh);
    }

    const childGameObjects = this.buildAndReturnChildGameObjects(config);

    if (childGameObjects && childGameObjects.length > 0) {
      this.add(...childGameObjects);
    }
  }

  public get enabled(): boolean {
    return this.isEnabled;
  }

  public set enabled(enabled: boolean) {
    if (enabled === this.isEnabled) {
      return;
    }

    this.isEnabled = enabled;

    for (const component of this.updatableComponents) {
      if (component.enabled) {
        enabled ? component.onEnabled() : component.onDisabled();
      }
    }
  }

  public start(): void {
    for (const componentType of this.componentMap.values()) {
      for (const component of componentType) {
        component.start();
      }
    }
  }

  public update(): void {
    if (!this.enabled) {
      return;
    }

    for (const component of this.updatableComponents) {
      if (component.enabled) {
        component.update();
      }
    }
  }

  public onDestroy(): void {
    for (const componentType of this.componentMap.values()) {
      for (const component of componentType) {
        component.onDestroy();
      }
    }
  }

  public addComponent<T extends Component>(newComponent: Component): T {
    const currentComponents = this.componentMap.get(newComponent.constructor as new () => T);

    if (currentComponents !== undefined) {
      currentComponents.push(newComponent);
    } else {
      this.componentMap.set(newComponent.constructor as new () => T, [newComponent]);
    }

    newComponent.enabled = true;
    newComponent.start();

    return newComponent as T;
  }

  public removeComponent(component: Component): void {
    if (!this.componentMap.has(component.constructor as new () => Component)) {
      throw new Error(`This object does not have a ${component.constructor.name} component!`);
    }

    this.updatableComponents.remove(component);
    this.componentMap.delete(component.constructor as new () => Component);
    component.onDestroy();
  }

  public hasComponent<T extends Component>(component: new (...args: unknown[]) => T): boolean {
    return this.componentMap.has(component);
  }

  public getComponent<T extends Component>(component: new (...args: unknown[]) => T): T | undefined {
    const components = this.componentMap.get(component);

    if (!components || components.length === 0) {
      return undefined;
    }

    return components[0] as T;
  }

  public getComponents<T extends Component>(component: new (...args: unknown[]) => T): T[] {
    const components = this.componentMap.get(component);

    if (!components || components.length === 0) {
      return [];
    }

    return [...components] as T[];
  }

  public getAsset<T>(key: string, assertType?: new () => T): T {
    return this.gameEngine.getAsset(key, assertType);
  }

  public override add(...object: GameObject[]): this {
    super.add(...object);
    return this;
  }

  /**
   * This function is meant to be overridden by subclasses that require child game objects. Not making abstract as not all subclasses need it.
   *
   * @param config The gameobject config.
   */
  protected buildAndReturnChildGameObjects(config: TConfig): GameObject[] {
    return [];
  }

  /**
   * This function is meant to be overridden by subclasses that require child game objects. Not making abstract as not all subclasses need it.
   *
   * @param config The gameobject config.
   */
  protected getMesh(config: TConfig): Mesh | undefined {
    return undefined;
  }

  private setComponents(components: Component[]): void {
    for (const component of components) {
      this.updatableComponents.push(component);
      const currentComponents = this.componentMap.get(component.constructor as new () => Component);

      if (currentComponents !== undefined) {
        currentComponents.push(component);
      } else {
        this.componentMap.set(component.constructor as new () => Component, [component]);
      }
    }
  }

  /**
   * These settings are overridden by non-default constructor values.
   */
  protected abstract getPrefabSettings(): PrefabSettings;
  protected abstract buildInitialComponents(config: TConfig): Component[];
}
