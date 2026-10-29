
import './style.css';
import { renderEgg } from './rendering/renderEgg';
import { checkBackendHealth } from './api/health';
import { createDinosaur, getMyDinosaur } from './api/dinosaurs';
import { ensureGuestSession } from './api/session';

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

    <form id="hatch-form" class="hatch-form" hidden>
      <label for="dinosaur-name">Give your dinosaur a name</label>

      <input
        type="text"
        id="dinosaur-name"
        name="name"
        placeholder="Enter a name..."
        maxlength="20"
        autocomplete="off"
        required
      />

      <button type="submit" id="hatch-button">Hatch!</button>
    </form>


    <p id="server-status" role="status">Checking server connection...</p>
  </main>
`;

const canvasContainer = document.querySelector<HTMLDivElement>('#game-canvas');

if (!canvasContainer) {
  throw new Error('Game canvas container not found');
}

const rendererReady = renderEgg(canvasContainer);
void rendererReady.catch(console.error);


const serverStatus = document.querySelector<HTMLParagraphElement>('#server-status');

if (!serverStatus) {
  throw new Error('Server status element not found');
}


async function checkBackend(statusElement: HTMLParagraphElement): Promise<void> {
  try {
    await checkBackendHealth();
    statusElement.textContent = 'Backend connected';
  } catch (error) {
    console.error(error);
    statusElement.textContent = 'Backend unavailable';
  }
}

void checkBackend(serverStatus);



const hatchForm = document.querySelector<HTMLFormElement>('#hatch-form');
const nameInput = document.querySelector<HTMLInputElement>('#dinosaur-name');
const hatchButton = document.querySelector<HTMLButtonElement>('#hatch-button');
const message = document.querySelector<HTMLParagraphElement>('.message');

if (!hatchForm || !nameInput || !hatchButton || !message) {
  throw new Error('Hatching interface elements not found');
}

hatchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();

  if (!name) {
    message.textContent = 'Please enter a name.';
    return;
  }

  hatchButton.disabled = true;

  try {
    const showBabyDinosaur = await rendererReady;

    await ensureGuestSession();

    const dinosaur = await createDinosaur(name);

    showBabyDinosaur();

    message.textContent = `${dinosaur.name} has hatched!`;
    hatchForm.remove();

  } catch (error) {
    console.error(error);
    message.textContent = 'Could not hatch the egg. Please try again.';
  } finally {
    hatchButton.disabled = false;
  }
});


async function loadSavedDinosaur(
  form: HTMLFormElement,
  statusMessage: HTMLParagraphElement
): Promise<void> {
  try {
    await ensureGuestSession();

    const dinosaur = await getMyDinosaur();

    if (!dinosaur) {
      form.hidden = false;
      statusMessage.textContent = 'A little friend is waiting to meet you.';
      return;
    }

    const showBabyDinosaur = await rendererReady;

    showBabyDinosaur();

    statusMessage.textContent = `${dinosaur.name} has hatched!`;
    form.remove();
  } catch (error) {
    console.error(error);
    statusMessage.textContent = 'Could not load your dinosaur. Please refresh to try again.';
  }
}

message.textContent = 'Loading your dinosaur...';

void loadSavedDinosaur(hatchForm, message);

