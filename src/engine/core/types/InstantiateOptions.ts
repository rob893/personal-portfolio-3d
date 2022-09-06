import { Vector3 } from 'three';
import { GameObject } from '../GameObject';

export interface InstantiateOptions {
  position?: Vector3;
  rotation?: number;
  parent?: GameObject;
}
