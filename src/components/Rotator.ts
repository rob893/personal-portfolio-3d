import { Component } from '../engine/core/components/Component';
import { GameObject } from '../engine/core/GameObject';

export class Rotator extends Component {
  public speed: number;
  // counter = 0;
  // prev = 0;
  // startTime = 0;

  public constructor(gameObject: GameObject, speed: number = 1) {
    super(gameObject);
    this.speed = speed;
  }

  // public override start(): void {
  //   this.prev = this.gameObject.parent?.rotation.y ?? 0;
  //   this.startTime = Date.now();
  // }

  public override update(): void {
    this.gameObject.rotation.y += this.speed * 0.25 * this.time.deltaTime;

    // if (this.gameObject.name !== 'Orbiter' && this.gameObject.parent && this.gameObject.parent.name) {
    //   const deg = this.gameObject.parent.rotation.y % 6.28;
    //   if (deg < this.prev && this.counter < 5) {
    //     const now = Date.now();
    //     const elappsedMs = now - this.startTime;
    //     const seconds = elappsedMs / 1000;
    //     this.startTime = now;
    //     this.counter++;
    //     console.log(`${this.gameObject.name} year ${this.counter} in ${seconds} seconds`);
    //   }
    //   this.prev = deg;
    // }

    // if (this.gameObject.name === 'Mercury') {
    //   //console.log(this.gameObject.parent?.rotation.y);
    // }
  }
}
