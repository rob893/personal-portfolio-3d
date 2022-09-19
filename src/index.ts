import { bindLinqToNativeTypes } from 'typescript-extended-linq';
import { GameEngine } from './engine/GameEngine';
import { SceneOne } from './scenes/SceneOne';

async function main(): Promise<void> {
  bindLinqToNativeTypes();

  if ('serviceWorker' in navigator) {
    if (ENVIRONMENT === 'production') {
      await navigator.serviceWorker.register('./sw.js');
      console.log('Service worker registered.');
    } else {
      console.log(`Service worker not enabled for ${ENVIRONMENT} environment.`);
      const registration = await navigator.serviceWorker.getRegistration('./sw.js');

      if (registration) {
        const res = await registration.unregister();

        if (res) {
          console.log('sw.js unregistered successfully.');
        } else {
          console.warn('Unable to unregister sw.js.');
        }
      } else {
        console.log('No ./sw.js registration found.');
      }
    }
  } else {
    console.warn('serviceWorker is not supported in this browser.');
  }

  const scene = new SceneOne();
  const gameEngine = new GameEngine();

  await gameEngine.loadScene(scene);
}

main();
