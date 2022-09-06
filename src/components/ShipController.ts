import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GameObject } from '../engine/core/GameObject';
import { Component } from '../engine/core/components/Component';

export class ShipController extends Component {
  private readonly orbitControls: OrbitControls;

  public constructor(gameObject: GameObject) {
    super(gameObject);
    this.orbitControls = new OrbitControls(this.mainCamera, this.domCanvasElement);
    //athis.mainCamera.parent = this.gameObject;
    this.orbitControls.target = this.gameObject.position;
  }

  public override update(): void {
    if (this.input.getKey('w')) {
      this.gameObject.position.addScaledVector(this.gameObject.getWorldDirection(new Vector3()), 1);
    } else if (this.input.getKey('s')) {
      // this.gameObject.translateY(-0.1);
    }

    if (this.input.getKey('d')) {
      this.gameObject.rotateY(-0.01);
    } else if (this.input.getKey('a')) {
      this.gameObject.rotateY(0.01);
    }

    this.orbitControls.update();
  }
}
