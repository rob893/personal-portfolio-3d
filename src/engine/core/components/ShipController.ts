import { Vector3 } from 'three';
import { Component } from './Component';

export class ShipController extends Component {
  public override update(): void {
    if (this.input.getKey('w')) {
      this.gameObject.position.addScaledVector(this.gameObject.getWorldDirection(new Vector3()), 0.1);
    } else if (this.input.getKey('s')) {
      // this.gameObject.translateY(-0.1);
    }

    if (this.input.getKey('d')) {
      this.gameObject.rotateY(0.01);
    } else if (this.input.getKey('a')) {
      this.gameObject.rotateY(-0.01);
    }
  }
}
