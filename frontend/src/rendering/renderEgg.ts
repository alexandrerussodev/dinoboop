
import { Application, Graphics } from 'pixi.js';
import { createBabyDinosaur } from './createBabyDinosaur.js';

export async function renderEgg(container: HTMLElement): Promise<() => void> {
  const app = new Application();

  await app.init({
    width: 320,
    height: 280,
    backgroundAlpha: 0,
    antialias: true,
  });

  container.appendChild(app.canvas);

  const egg = new Graphics()
    .ellipse(0, 0, 70, 95)
    .fill(0xc5dbad)
    .stroke({ color: 0x91ad7d, width: 5 });

  egg.position.set(app.screen.width / 2, app.screen.height / 2);

  app.stage.addChild(egg);

  
  return () => {
    app.stage.removeChild(egg);
    egg.destroy();

    const dinosaur = createBabyDinosaur();

    dinosaur.position.set(
      app.screen.width / 2,
      app.screen.height / 2
    );

    app.stage.addChild(dinosaur);
  };

}
