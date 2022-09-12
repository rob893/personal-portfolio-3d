import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { GameObject } from '../engine/core/GameObject';
import { Component } from '../engine/core/components/Component';
import { Key } from '../engine/core/enums/Key';

export class ShipController extends Component {
  public _speed = 1000000;
  //private readonly orbitControls: OrbitControls;
  private readonly flyControls: FlyControls;

  public constructor(gameObject: GameObject) {
    super(gameObject);
    // this.orbitControls = new OrbitControls(this.mainCamera, this.domCanvasElement);
    //athis.mainCamera.parent = this.gameObject;
    // this.orbitControls.target = this.gameObject.position;
    this.flyControls = new FlyControls(this.mainCamera, this.domCanvasElement);

    this.flyControls.object.position.copy(this.gameObject.position);
    this.flyControls.movementSpeed = this.speed;
    this.flyControls.rollSpeed = 0.5;
    //this.flyControls.
    //this.flyControls.object.parent = gameObject;
  }

  public get speed(): number {
    return this._speed;
  }

  public set speed(value: number) {
    this.flyControls.movementSpeed = value;
    this._speed = value;
  }

  // public override start(): void {
  //     const player = this.ge
  // }

  public override update(): void {
    this.flyControls.update(this.time.deltaTime);
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

    if (this.input.getKey('1')) {
      this.speed = 250000;
    }

    if (this.input.getKey('2')) {
      this.speed = 1000000;
    }

    if (this.input.getKey('3')) {
      this.speed = 10000000;
    }

    if (this.input.getKey('4')) {
      this.speed = 20000000;
    }

    if (this.input.getKey('t') && this.input.getKey('1')) {
      const obj = this.findGameObjectByName('Mercury');
      if (obj) {
        this.gameObject.position.set(obj.position.x + 1200000, obj.position.y, obj.position.z);
      }
    }

    if (this.input.getKey('t') && this.input.getKey('2')) {
      const obj = this.findGameObjectByName('Venus');
      if (obj) {
        this.gameObject.position.set(obj.position.x + 1200000, obj.position.y, obj.position.z);
      }
    }

    if (this.input.getKey('t') && this.input.getKey('3')) {
      const obj = this.findGameObjectByName('Earth');
      if (obj) {
        this.gameObject.position.set(obj.position.x + 1200000, obj.position.y, obj.position.z);
      }
    }

    if (this.input.getKey('t') && this.input.getKey('4')) {
      const obj = this.findGameObjectByName('Mars');
      if (obj) {
        this.gameObject.position.set(obj.position.x + 1200000, obj.position.y, obj.position.z);
      }
    }

    if (this.input.getKey('t') && this.input.getKey('5')) {
      const obj = this.findGameObjectByName('Jupiter');
      if (obj) {
        this.gameObject.position.set(obj.position.x + 1200000, obj.position.y, obj.position.z);
      }
    }

    if (this.input.getKey('t') && this.input.getKey('6')) {
      const obj = this.findGameObjectByName('Saturn');
      if (obj) {
        this.gameObject.position.set(obj.position.x + 1200000, obj.position.y, obj.position.z);
      }
    }

    if (this.input.getKey('t') && this.input.getKey('7')) {
      const obj = this.findGameObjectByName('Uranus');
      if (obj) {
        this.gameObject.position.set(obj.position.x + 1200000, obj.position.y, obj.position.z);
      }
    }

    if (this.input.getKey('t') && this.input.getKey('8')) {
      const obj = this.findGameObjectByName('Neptune');
      if (obj) {
        const pos = obj.getWorldPosition(new Vector3());
        this.gameObject.position.set(pos.x + 1200000, pos.y, pos.z);
      }
    }

    //this.orbitControls.update();
  }
}
