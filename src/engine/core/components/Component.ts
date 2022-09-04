import { GameObject } from '../GameObject';

export abstract class Component {
  public readonly gameObject: GameObject;

  private isEnabled: boolean = true;

  public constructor(gameObject: GameObject, enabled: boolean = true) {
    this.gameObject = gameObject;
    this.isEnabled = enabled;
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
}
