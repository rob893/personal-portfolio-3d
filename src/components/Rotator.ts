import { Component } from '../engine/core/components/Component';

export class Rotator extends Component {
  public override update(): void {
    this.gameObject.rotation.y += 0.005;
  }
}
