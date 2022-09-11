import { bindLinqToNativeTypes } from 'typescript-extended-linq';
import { GameEngine } from './engine/GameEngine';
import { SceneOne } from './scenes/SceneOne';

bindLinqToNativeTypes();

async function main(): Promise<void> {
  const scene = new SceneOne();
  const gameEngine = new GameEngine();

  await gameEngine.loadScene(scene);
}

main();
