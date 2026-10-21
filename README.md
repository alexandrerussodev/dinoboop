# DinoBoop

**Hatch. Care. Grow.**

DinoBoop is a browser-based 2D virtual pet game about raising and caring for a cute dinosaur.

The player manages the dinosaur's needs through simple interactions such as feeding, playing, and sleeping. The dinosaur continues to change while the player is away, with its state stored and calculated by the backend.

DinoBoop is being developed publicly as both a playable web game and a programming portfolio project.

## Current Status

DinoBoop is currently in early development.

The first goal is to build a small but complete virtual pet experience before expanding into larger systems.

The initial version will focus on:

- A persistent dinosaur.
- Hunger.
- Happiness.
- Energy.
- Feeding.
- Playing.
- Sleeping.
- Offline progression.
- Basic visual reactions.
- Responsive desktop and mobile support.

More advanced systems will be added only after the core loop is stable.

## Core Gameplay

The basic gameplay loop is simple:

1. Visit DinoBoop in a web browser.
2. Check how your dinosaur is feeling.
3. Feed it when it is hungry.
4. Play with it when it is unhappy.
5. Let it sleep when it is tired.
6. Leave and return later to see how its state has changed.

The goal is to make the dinosaur feel like a small persistent companion rather than a collection of statistics.

## Technology

DinoBoop uses:

### Frontend

- TypeScript
- PixiJS
- Vite
- HTML
- CSS

### Backend

- Node.js
- TypeScript
- REST API
- SQL database

### Development

- Git
- GitHub
- Environment variables
- Semantic versioning

The project will eventually be deployed on Hostinger.

A temporary development domain will be used until the final production domain is chosen.

## Architecture

DinoBoop uses a backend from the beginning.

Important gameplay state is server-authoritative.

The browser requests actions such as:

- Feed the dinosaur.
- Play with the dinosaur.
- Put the dinosaur to sleep.

The backend determines the resulting state and stores it in the database.

This includes values such as:

- Hunger.
- Happiness.
- Energy.
- Sleep state.
- Time-based progression.

The client is responsible primarily for presentation, input, and rendering.

This separation allows the game to grow without later moving core progression logic out of the frontend.

More detailed technical decisions are documented in `ARCHITECTURE.md`.

## Persistence

The dinosaur is stored in the backend database.

The game uses server-controlled timestamps for offline progression so changing the user's local clock does not directly control game progression.

The initial version will use a guest player system so the game can be played without creating an account.

Authentication and cross-device accounts can be introduced later.

## Art and Animation

Development begins with static dinosaur frames.

Initial states may include:

- Idle.
- Happy.
- Hungry.
- Tired.
- Sleeping.

These can later be replaced with spritesheet or 2D cutout animation without changing the underlying gameplay logic.

Rendering and gameplay systems are intentionally kept separate.

## Project Principles

DinoBoop is developed incrementally.

The project aims to:

- Keep the core gameplay simple.
- Avoid unnecessary feature creep.
- Keep code readable.
- Introduce complexity gradually.
- Keep gameplay logic separate from rendering and UI.
- Keep the main branch stable.
- Use meaningful commits.
- Document important design and technical decisions.

New systems should only be introduced when the current layer is stable.

## Planned MVP

The first public version is expected to include:

- Frontend and backend communication.
- SQL persistence.
- Guest player identity.
- Persistent dinosaur state.
- Hunger.
- Happiness.
- Energy.
- Feed action.
- Play action.
- Sleep action.
- Server-side time calculations.
- Offline progression.
- Static dinosaur visuals.
- Basic character reactions.
- Responsive UI.
- Public deployment.

The MVP will intentionally exclude larger systems such as:

- Registered accounts.
- Inventory.
- Currency.
- Growth stages.
- Personality.
- Minigames.
- Cosmetics.
- Social features.

These may be introduced later.

## Documentation

Project documentation is divided into:

- `README.md` — project overview and local development information.
- `GDD.md` — game design and gameplay rules.
- `ROADMAP.md` — development order and milestones.
- `ARCHITECTURE.md` — technical structure and engineering decisions.

## Local Development

DinoBoop is a website, so players do not install the game.

This section is for developers who want to run the project locally while working on it.

Local setup commands will be added once the initial frontend and backend projects are created.

The repository is expected to follow a structure similar to:

```text
dinoboop/
├── README.md
├── GDD.md
├── ROADMAP.md
├── ARCHITECTURE.md
├── .gitignore
├── .env.example
├── frontend/
└── backend/
```

## Environment Variables

Secrets must never be committed to the repository.

Local secrets should be stored in:

```text
.env
```

The `.env` file must be ignored by Git.

An `.env.example` file may be committed to document which environment variables are required without exposing real credentials.

## Git Workflow

Development should use:

- Feature branches.
- Issues.
- Pull Requests.
- Meaningful commits.
- Releases.
- Semantic versioning.

The `main` branch should remain stable.

## Play

DinoBoop will be playable directly in a web browser.

The public game URL will be added here once the first deployed version is available.

## License

DinoBoop uses a dual licensing structure:

- **Source code:** Licensed under the MIT License. See [LICENSE](LICENSE.md).
- **Creative assets:** All rights reserved. See [ASSETS_LICENSE](ASSETS_LICENSE.md).

The MIT License does not grant permission to reuse DinoBoop's original characters, artwork, animations, audio, or other proprietary creative assets.

Copyright © 2026 Alexandre Russo.
