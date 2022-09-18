import { bindLinqToNativeTypes } from 'typescript-extended-linq';
import { GameEngine } from './engine/GameEngine';
import { SceneOne } from './scenes/SceneOne';

bindLinqToNativeTypes();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

async function main(): Promise<void> {
  const scene = new SceneOne();
  const gameEngine = new GameEngine();

  await gameEngine.loadScene(scene);
}

main();
