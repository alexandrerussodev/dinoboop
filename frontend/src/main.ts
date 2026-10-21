
import './style.css';
import { renderEgg } from './rendering/renderEgg';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('App container not found');
}

app.innerHTML = `
  <main class="game">
    <h1>DinoBoop</h1>
    <p class="tagline">Hatch. Care. Grow.</p>

    <div id="game-canvas" role="img" aria-label="Dinosaur egg"></div>

    <p class="message">A little friend is waiting to meet you.</p>
  </main>
`;

const canvasContainer = document.querySelector<HTMLDivElement>('#game-canvas');

if (!canvasContainer) {
  throw new Error('Game canvas container not found');
}

renderEgg(canvasContainer).catch(console.error);