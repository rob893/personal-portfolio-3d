import { GameEngine } from '../../GameEngine';

export interface GameObjectConstructionParams {
  gameEngine: GameEngine;
  name?: string;
  x?: number;
  y?: number;
  z?: number;
  rotation?: number;
  tags?: string[];
}
