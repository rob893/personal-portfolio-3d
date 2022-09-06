import { Event, Mesh, Object3D, Vector3 } from 'three';
import { GameEngine } from '../GameEngine';
import { Component } from './components/Component';
import { Input } from './Input';
import { Time } from './Time';
import { GameObjectConstructionParams } from './types/GameObjectConstructionParams';
import { InstantiateOptions } from './types/InstantiateOptions';
import { PrefabSettings } from './types/PrefabSettings';

export abstract class GameObject<
  TConfig extends GameObjectConstructionParams = GameObjectConstructionParams
> extends Object3D {
  public readonly tags: string[] = [];
  public readonly model: Object3D | undefined;

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

    this.model = this.getModel(config);

    if (this.model) {
      // Ensure to use super here as mesh is threejs object.
      super.add(this.model);
    }

    const childGameObjects = this.buildAndReturnChildGameObjects(config);

    if (childGameObjects && childGameObjects.length > 0) {
      this.add(...childGameObjects);
    }
  }

  public get input(): Input {
    return this.gameEngine.input;
  }

  public get time(): Time {
    return this.gameEngine.time;
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

  public findGameObjectByName(name: string): GameObject | undefined {
    return this.gameEngine.findGameObjectByName(name);
  }

  public findGameObjectsByName(name: string): GameObject[] {
    return this.gameEngine.findGameObjectsByName(name);
  }

  public findGameObjectById(id: number): GameObject | undefined {
    return this.gameEngine.findGameObjectById(id);
  }

  public findGameObjectWithTag(tag: string): GameObject | undefined {
    return this.gameEngine.findGameObjectWithTag(tag);
  }

  public findGameObjectsWithTag(tag: string): GameObject[] {
    return this.gameEngine.findGameObjectsWithTag(tag);
  }

  public instantiate<T extends GameObject>(
    type: new (constructionParams: GameObjectConstructionParams) => T,
    options?: InstantiateOptions
  ): GameObject {
    return this.gameEngine.instantiate(type, options);
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

  public hasComponent<T extends Component>(component: new () => T): boolean {
    return this.componentMap.has(component);
  }

  public getComponent<T extends Component>(component: new () => T): T | undefined {
    const components = this.componentMap.get(component);

    if (!components || components.length === 0) {
      return undefined;
    }

    return components[0] as T;
  }

  public getComponents<T extends Component>(component: new () => T): T[] {
    const components = this.componentMap.get(component);

    if (!components || components.length === 0) {
      return [];
    }

    return [...components] as T[];
  }

  public getComponentInParent<T extends Component>(component: new () => T): T | undefined {
    let parent = this.parent;

    while (parent) {
      if (parent instanceof GameObject && parent.hasComponent(component)) {
        return parent.getComponent(component);
      }

      parent = parent.parent;
    }

    return undefined;
  }

  public getComponentsInParent<T extends Component>(component: new () => T): T[] {
    let parent = this.parent;
    const components: T[] = [];

    while (parent) {
      if (parent instanceof GameObject) {
        components.push(...parent.getComponents(component));
      }

      parent = parent.parent;
    }

    return components;
  }

  public getComponentInChildren<T extends Component>(component: new () => T): T | undefined {
    const children = this.children;

    while (children.length > 0) {
      const child = children.pop();

      if (!child) {
        continue;
      }

      if (child instanceof GameObject && child.hasComponent(component)) {
        return child.getComponent(component);
      }

      children.push(...child.children);
    }

    return undefined;
  }

  public getComponentsInChildren<T extends Component>(component: new () => T): T[] {
    const children = this.children;
    const components: T[] = [];

    while (children.length > 0) {
      const child = children.pop();

      if (!child) {
        continue;
      }

      if (child instanceof GameObject) {
        components.push(...child.getComponents(component));
      }

      children.push(...child.children);
    }

    return components;
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
  protected getModel(config: TConfig): Object3D | undefined {
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
