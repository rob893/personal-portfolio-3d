import { Vector3 } from 'three';
import { Component } from '../engine/core/components/Component';
import { GameObject } from '../engine/core/GameObject';

export class ThirdPersonCameraController extends Component {
  private target: GameObject | null = null;
  private readonly scale = 1;

  public override start(): void {
    const player = this.findGameObjectByName('player');

    if (!player) {
      throw new Error('No object with name player found!');
    }

    this.target = player;
    this.mainCamera.rotateY(180);
  }

  public override update(): void {
    if (!this.target) {
      return;
    }

    const detlaTime = this.time.deltaTime;

    const idealOffset = this.calculateIdealOffset();

    const t1 = 1.0 - (0.05 * this.scale) ** detlaTime;

    this.gameObject.position.lerp(idealOffset, t1);

    this.mainCamera.position.copy(this.gameObject.position);
    this.mainCamera.lookAt(this.target.position);
  }

  private calculateIdealOffset(): Vector3 {
    const idealOffset = new Vector3(0, 10, -30).multiplyScalar(this.scale);

    if (this.input.getKey('a')) {
      idealOffset.lerp(new Vector3(10 * -1, 5, -20).multiplyScalar(this.scale), 1);
    }

    if (this.input.getKey('d')) {
      idealOffset.lerp(new Vector3(10 * 1, 5, -20).multiplyScalar(this.scale), 1);
    }

    if (this.input.getKey('s')) {
      idealOffset.lerp(new Vector3(0, 0, 18 * -1).multiplyScalar(this.scale), 1);
    }

    if (this.input.getKey('w')) {
      idealOffset.lerp(new Vector3(0, 5, 15 * -1).multiplyScalar(this.scale), 1);
    }

    if (this.target) {
      idealOffset.applyQuaternion(this.target.quaternion);
      idealOffset.add(this.target.position);
    }

    return idealOffset;
  }
}
