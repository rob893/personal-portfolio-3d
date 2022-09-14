import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { GameObject } from '../engine/core/GameObject';
import { Component } from '../engine/core/components/Component';
import { Key } from '../engine/core/enums/Key';

export class ShipController extends Component {
  public _speed = 1000000;
  //private readonly orbitControls: OrbitControls;
  private flyControls: FlyControls | undefined;

  public constructor(gameObject: GameObject) {
    super(gameObject);
    // this.orbitControls = new OrbitControls(this.mainCamera, this.domCanvasElement);
    //athis.mainCamera.parent = this.gameObject;
    // this.orbitControls.target = this.gameObject.position;
    // this.flyControls = new FlyControls(this.mainCamera, this.domCanvasElement);

    // this.flyControls.object.position.copy(this.gameObject.position);
    // this.flyControls.movementSpeed = this.speed;
    // this.flyControls.rollSpeed = 0.5;
    //this.flyControls.
    //this.flyControls.object.parent = gameObject;
  }

  public get speed(): number {
    return this._speed;
  }

  public set speed(value: number) {
    if (!this.flyControls) {
      throw new Error('Flight controls not initialized.');
    }
    console.log(
      `Speed set to ${value.toLocaleString('en-US', { maximumSignificantDigits: 2 })} meters per second. ${Math.floor(
        value / 1609.34
      ).toLocaleString('en-US', { maximumSignificantDigits: 2 })} miles per second. ${(
        (value / 299792458) *
        100
      ).toLocaleString('en-US', { maximumSignificantDigits: 2 })}% light speed.`
    );
    this.flyControls.movementSpeed = value;
    this._speed = value;
  }

  public override start(): void {
    this.flyControls = new FlyControls(this.mainCamera, this.domCanvasElement);

    this.flyControls.object.position.copy(this.gameObject.position);
    this.flyControls.movementSpeed = this.speed;
    this.flyControls.rollSpeed = 0.5;

    this.teleToPlanet('Earth');
  }

  public override update(): void {
    this.flyControls?.update(this.time.deltaTime);
    // if (this.input.getKey('w')) {
    //   this.gameObject.position.addScaledVector(
    //     this.gameObject.getWorldDirection(new Vector3()),
    //     this.speed * this.time.deltaTime
    //   );
    // } else if (this.input.getKey('s')) {
    //   this.gameObject.position.addScaledVector(
    //     this.gameObject.getWorldDirection(new Vector3()),
    //     -(this.speed * 0.25 * this.time.deltaTime)
    //   );
    // }

    if (this.input.getKey('q')) {
      // this.gameObject.position.addScaledVector(this.gameObject.getWorldDirection(new Vector3()), 1);
    } else if (this.input.getKey('e')) {
      // const forward = this.gameObject.getWorldDirection(new Vector3());
      // const up = new Vector3();
      // up.copy(this.gameObject.up).applyMatrix4(this.gameObject.matrixWorld).normalize();
      // const right = new Vector3();
      // right.crossVectors(forward, up).normalize();
      // this.gameObject.position.addScaledVector(right, 1);
    }

    // if (this.input.getKey(Key.Space)) {
    //   this.gameObject.position.addScaledVector(new Vector3(0, 1, 0), this.speed * 0.25 * this.time.deltaTime);
    // } else if (this.input.getKey('c')) {
    //   this.gameObject.position.addScaledVector(new Vector3(0, -1, 0), this.speed * 0.25 * this.time.deltaTime);
    // }

    // if (this.input.getKey('d')) {
    //   this.gameObject.rotateY(-this.time.deltaTime * 5);
    // } else if (this.input.getKey('a')) {
    //   this.gameObject.rotateY(5 * this.time.deltaTime);
    // }

    if (this.input.getKey('t') && this.input.getKey('1')) {
      this.teleToPlanet('Mercury');
      return;
    }

    if (this.input.getKey('t') && this.input.getKey('2')) {
      this.teleToPlanet('Venus');
      return;
    }

    if (this.input.getKey('t') && this.input.getKey('3')) {
      this.teleToPlanet('Earth');
      return;
    }

    if (this.input.getKey('t') && this.input.getKey('4')) {
      this.teleToPlanet('Mars');
      return;
    }

    if (this.input.getKey('t') && this.input.getKey('5')) {
      this.teleToPlanet('Jupiter');
      return;
    }

    if (this.input.getKey('t') && this.input.getKey('6')) {
      this.teleToPlanet('Saturn');
      return;
    }

    if (this.input.getKey('t') && this.input.getKey('7')) {
      this.teleToPlanet('Uranus');
      return;
    }

    if (this.input.getKey('t') && this.input.getKey('8')) {
      this.teleToPlanet('Neptune');
      return;
    }

    if (this.input.getKey('1')) {
      this.speed = 10000;
      return;
    }

    if (this.input.getKey('2')) {
      this.speed = 100000;
      return;
    }

    if (this.input.getKey('3')) {
      this.speed = 299792458 / 100;
      return;
    }

    if (this.input.getKey('4')) {
      this.speed = 299792458 / 10;
      return;
    }

    if (this.input.getKey('5')) {
      this.speed = 299792458 / 2;
      return;
    }

    if (this.input.getKey('6')) {
      this.speed = 299792458;
      return;
    }

    if (this.input.getKey('7')) {
      this.speed = 299792458 * 2;
      return;
    }

    if (this.input.getKey('8')) {
      this.speed = 2997924580;
      return;
    }

    if (this.input.getKey('9')) {
      this.speed = 29979245800;
      return;
    }

    //this.orbitControls.update();
  }

  private teleToPlanet(name: string): void {
    const obj = this.findGameObjectByName(name);
    if (obj) {
      const pos = obj.getWorldPosition(new Vector3());
      this.flyControls?.object.position.set(pos.x + 120000000, pos.y + 10000000, pos.z);
      this.mainCamera.lookAt(pos);
    }
  }
}
