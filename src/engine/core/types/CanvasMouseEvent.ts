import { Vector2 } from 'three';

export interface CanvasMouseEvent extends MouseEvent {
  cursorPositionOnCanvas: Vector2;
}
