# DinoBoop — Architecture

**Version:** 0.1  
**Status:** Initial architecture  
**Project:** DinoBoop

---

## 1. Purpose

This document describes how DinoBoop is structured technically.

It focuses on responsibilities and boundaries rather than implementation details that may change during development.

The main architectural goals are:

- Keep gameplay logic understandable.
- Keep rendering separate from game rules.
- Make the backend authoritative for important game state.
- Support persistent progression from the beginning.
- Allow the frontend visuals to evolve without rewriting gameplay.
- Introduce complexity gradually.
- Keep the project suitable for learning and public portfolio use.

---

## 2. High-Level Architecture

DinoBoop is a web application composed of three main parts:

1. Frontend
2. Backend
3. SQL database

Basic flow:

```text
Browser
  |
  | HTTPS / API requests
  v
Frontend
  |
  | JSON
  v
Backend
  |
  | SQL
  v
Database
```

The frontend handles presentation and player input.

The backend handles authoritative game rules and persistence.

The database stores persistent player and dinosaur data.

---

## 3. Main Technology Stack

### Frontend

- TypeScript
- Vite
- PixiJS
- HTML
- CSS

### Backend

- Node.js
- TypeScript
- REST API

### Database

- SQL database

The specific SQL engine may be selected based on deployment requirements.

### Development

- Git
- GitHub
- Environment variables
- Semantic versioning

### Hosting

Production deployment is planned for Hostinger.

A temporary development domain may be used before the final production domain is selected.

---

## 4. Repository Structure

The initial repository should remain simple.

Recommended structure:

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

The exact internal structure of `frontend/` and `backend/` should be introduced gradually as features are implemented.

Avoid creating many folders or abstractions before they are needed.

---

## 5. Frontend Responsibilities

The frontend is responsible for:

- Rendering the dinosaur.
- Rendering the egg and hatching sequence.
- Rendering the ghost dinosaur.
- Displaying Hunger, Happiness, and Energy.
- Displaying buttons and other UI.
- Capturing player input.
- Sending requests to the backend.
- Showing loading and error states.
- Updating the visual state from backend responses.
- Responsive layout.
- Temporary visual effects and animation.

The frontend should not be the source of truth for important gameplay values.

For example, the frontend should not directly decide:

```text
hunger = 100
```

Instead, it should request:

```text
feed dinosaur
```

The backend calculates and returns the resulting state.

---

## 6. Backend Responsibilities

The backend is responsible for:

- Identifying guest players.
- Creating and retrieving dinosaurs.
- Storing dinosaur names.
- Storing lifecycle state.
- Processing Feed.
- Processing Play.
- Processing Sleep.
- Processing Wake when needed.
- Calculating Hunger changes.
- Calculating Happiness changes.
- Calculating Energy changes.
- Applying offline progression.
- Using server-controlled time.
- Detecting critical neglect.
- Tracking the 24-hour critical neglect period.
- Transitioning a dinosaur to the ghost state.
- Creating a new egg after a restart.
- Validating incoming requests.
- Persisting authoritative state.
- Returning current state to the frontend.

The backend should remain small during the MVP.

It should not contain systems that the game does not yet need.

---

## 7. Server-Authoritative State

Important game state belongs to the backend.

This includes:

- Dinosaur name.
- Lifecycle state.
- Hunger.
- Happiness.
- Energy.
- Sleep state.
- Timestamps.
- Critical neglect state.
- Death state.

The browser may display or cache these values, but it does not own them.

This means the client sends intentions rather than final values.

Good:

```text
POST /actions/feed
```

Bad:

```text
POST /dinosaur
{
  "hunger": 100
}
```

The backend decides what Feed actually changes.

This prevents basic progression from being trivially manipulated through browser developer tools.

---

## 8. Dinosaur Lifecycle

The dinosaur should have an explicit lifecycle state.

Initial lifecycle states:

```text
egg
alive
ghost
```

Possible flow:

```text
egg
 |
 | player chooses a name
 v
alive
 |
 | critically neglected for 24 consecutive hours
 v
ghost
 |
 | player starts again
 v
egg
```

This lifecycle should be stored in the database.

The frontend chooses how each state looks.

The backend decides which lifecycle state is valid.

---

## 9. First-Time Player Flow

For a new guest player:

1. The frontend requests the current pet state.
2. The backend creates a guest player if needed.
3. The backend creates a dinosaur in the `egg` state.
4. The frontend displays the egg.
5. The player enters a dinosaur name.
6. The frontend sends the name to the backend.
7. The backend validates and stores the name.
8. The backend changes the lifecycle state from `egg` to `alive`.
9. The frontend receives the updated state.
10. The frontend plays the egg cracking and hatching sequence.

The backend does not need to control animation timing.

It only controls the actual lifecycle transition.

---

## 10. Guest Identity

The MVP does not require registered accounts.

A guest identity allows the same browser to reconnect to the same dinosaur.

Possible approach:

1. The backend creates a guest identifier.
2. The browser stores a session identifier or token.
3. Future requests include that identifier.
4. The backend resolves it to the correct guest player.

The identifier must not contain trusted game state.

The browser may store the identifier locally, but the dinosaur itself remains in the database.

### Future Accounts

Later, a guest player should be able to create an account and attach the existing dinosaur to it.

The player should not lose progress when upgrading from guest play to a registered account.

---

## 11. Browser Storage

Browser storage should only contain non-authoritative information.

Possible examples:

- Guest/session identifier.
- Audio preference.
- UI settings.
- Temporary cached state.

Do not store authoritative progression exclusively in:

- `localStorage`
- `sessionStorage`
- frontend variables

The database remains the source of truth.

---

## 12. Game State Model

A simple game state returned to the frontend may conceptually look like:

```ts
type DinosaurState = {
  id: string;
  name: string | null;
  lifecycle: "egg" | "alive" | "ghost";
  hunger: number;
  happiness: number;
  energy: number;
  isSleeping: boolean;
  criticalNeglectStartedAt: string | null;
  diedAt: string | null;
  updatedAt: string;
};
```

This is an architectural example, not a fixed implementation contract.

The exact fields may change as development progresses.

---

## 13. Database Responsibilities

The SQL database stores persistent state.

At minimum, the MVP will likely need data representing:

### Guest Player

Possible fields:

- ID.
- Creation timestamp.
- Session or identity information.

### Dinosaur

Possible fields:

- ID.
- Player ID.
- Name.
- Lifecycle state.
- Hunger.
- Happiness.
- Energy.
- Sleep state.
- Last meaningful care timestamp.
- Critical neglect start timestamp.
- Death timestamp.
- Last processed timestamp.
- Creation timestamp.
- Updated timestamp.

The schema should stay small during the MVP.

Do not create future inventory, achievements, currencies, or social tables before those features exist.

---

## 14. Time-Based Progression

The backend owns time-based progression.

The browser clock must not be trusted.

When current state is requested or an action is performed:

1. Read the dinosaur from the database.
2. Read the last processed timestamp.
3. Get the current server time.
4. Calculate elapsed time.
5. Apply Hunger decay.
6. Apply Happiness decay.
7. Apply Energy changes.
8. Apply sleep recovery if sleeping.
9. Check critical neglect.
10. Check whether the 24-hour neglect period has expired.
11. Apply death if required.
12. Clamp values to valid ranges.
13. Save the resulting state.
14. Return the current state.

This same progression function should be reused by relevant backend operations instead of duplicating time calculations across routes.

---

## 15. Critical Neglect

A dinosaur should not die simply because the player has been offline for 24 hours.

The danger period begins only after the dinosaur enters a defined critical neglect state.

Conceptually:

```text
normal
  |
  | needs become critically low
  v
critical neglect
  |
  | remains critical for 24 hours
  v
ghost
```

If meaningful care occurs before the 24-hour period finishes:

```text
critical neglect
  |
  | player provides meaningful care
  v
normal
```

The exact thresholds that define critical neglect belong in gameplay configuration and should be easy to tune.

---

## 16. Gameplay Configuration

Balance values should not be scattered through the code.

Values such as these should live in a central gameplay configuration:

- Hunger decay rate.
- Happiness decay rate.
- Energy decay rate.
- Sleep recovery rate.
- Feed restoration amount.
- Play restoration amount.
- Play energy cost.
- Critical neglect thresholds.
- Critical neglect duration.

Example concept:

```ts
export const GAME_CONFIG = {
  maxStat: 100,
  criticalNeglectDurationHours: 24
};
```

The exact implementation can remain simple.

The important rule is that balance values should be easy to find and change.

---

## 17. API Design

The API should expose actions and state, not direct arbitrary state mutation.

Possible MVP endpoints:

```text
GET  /api/pet
POST /api/pet/name
POST /api/pet/feed
POST /api/pet/play
POST /api/pet/sleep
POST /api/pet/wake
POST /api/pet/restart
```

These endpoint names are provisional.

### Example

The frontend sends:

```text
POST /api/pet/feed
```

The backend:

1. Identifies the player.
2. Loads the dinosaur.
3. Applies elapsed-time progression.
4. Verifies that the dinosaur is alive.
5. Applies Feed.
6. Saves the new state.
7. Returns the resulting state.

The frontend then renders the response.

---

## 18. Rendering Architecture

PixiJS handles the main dinosaur scene.

Rendering should consume game state rather than contain gameplay rules.

Conceptually:

```text
Backend state
    |
    v
Frontend state
    |
    v
Presentation mapping
    |
    v
PixiJS visual
```

Example:

```text
hunger = 12
```

may map to:

```text
visual state = hungry
```

The renderer should not be responsible for deciding how Hunger decays.

---

## 19. Static Frames First

The first version should use static dinosaur frames.

Possible assets:

```text
egg
egg-cracking
idle
happy
hungry
tired
sleeping
ghost
```

Later, these can be replaced by:

- Spritesheets.
- 2D cutout animation.
- Layered animation.
- More expressive state transitions.

Gameplay code should not need to change when the animation system changes.

---

## 20. Frontend State

The frontend needs temporary state for display and interaction.

Examples:

- Current server response.
- Loading state.
- Current animation.
- Whether a button is temporarily disabled.
- Error messages.
- Current visual transition.

This state is different from authoritative game state.

For example:

```text
currently playing hatch animation
```

belongs to the frontend.

```text
lifecycle = alive
```

belongs to the backend.

---

## 21. Error Handling

The frontend should handle expected failures cleanly.

Examples:

- Backend unavailable.
- Request timeout.
- Invalid dinosaur name.
- Action not allowed while sleeping.
- Action not allowed for a ghost dinosaur.
- Session no longer valid.

The backend should return consistent error responses.

The UI should explain errors simply and avoid exposing technical details to the player.

---

## 22. Validation

The backend must validate all player input.

Examples:

- Dinosaur name length.
- Allowed name characters if restrictions are needed.
- Valid action for the current lifecycle.
- Valid action for sleeping state.
- Valid guest session.

Do not trust frontend validation alone.

Frontend validation exists for user experience.

Backend validation exists for correctness.

---

## 23. Security

The MVP does not need complex anti-cheat systems.

It does need basic security discipline.

Rules:

- Never trust gameplay values submitted by the browser.
- Never commit secrets.
- Use `.env` locally.
- Keep `.env` ignored by Git.
- Commit only safe placeholders in `.env.example`.
- Use production environment variables for deployed secrets.
- Validate API input.
- Use parameterized SQL queries or a safe database library.
- Avoid exposing database credentials to the frontend.
- Keep backend and database credentials server-side.

Security should remain proportionate to the project.

---

## 24. Environment Variables

Likely backend environment variables may include:

```text
DATABASE_URL
PORT
NODE_ENV
```

Additional variables can be added when they become necessary.

The repository should contain:

```text
.env.example
```

with placeholder values or variable names.

It must not contain a real `.env` file.

---

## 25. Frontend and Backend Communication

Production communication should use HTTPS.

The frontend sends API requests to the backend and receives JSON responses.

During development, frontend and backend may run on different local ports.

Example:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```

These values are examples only.

CORS configuration may be required during local development if the frontend and backend use different origins.

---

## 26. Shared Types

Because both frontend and backend use TypeScript, some API types may eventually be shared.

Examples:

- Dinosaur state response.
- Lifecycle enum.
- API error shape.

Do not create a separate shared package until duplication becomes a real problem.

For the first version, simple duplication may be easier to understand.

A shared package can be introduced later if it clearly improves maintainability.

---

## 27. Backend Organization

The backend should begin with a straightforward structure.

Possible direction:

```text
backend/
└── src/
    ├── server.ts
    ├── routes/
    ├── game/
    ├── db/
    └── config/
```

Responsibilities:

- `server.ts` — starts the application.
- `routes/` — HTTP/API entry points.
- `game/` — gameplay calculations and rules.
- `db/` — database access.
- `config/` — environment and gameplay configuration.

This is a starting point, not a requirement to create every folder immediately.

---

## 28. Frontend Organization

The frontend should also begin simply.

Possible direction:

```text
frontend/
└── src/
    ├── main.ts
    ├── game/
    ├── api/
    ├── ui/
    └── assets/
```

Responsibilities:

- `main.ts` — application entry point.
- `game/` — PixiJS scene and presentation logic.
- `api/` — backend communication.
- `ui/` — DOM-based interface where appropriate.
- `assets/` — images and other local game assets.

Again, only create folders when they are actually useful.

---

## 29. DOM vs PixiJS

PixiJS should primarily handle the visual game scene.

Regular HTML/CSS can handle interface elements when that is simpler.

A practical split is:

### PixiJS

- Egg.
- Dinosaur.
- Ghost.
- Scene animations.
- Character effects.

### HTML/CSS

- Name input.
- Feed button.
- Play button.
- Sleep button.
- Stat bars.
- Menus.
- Error messages.
- Loading UI.

This avoids forcing every interface element into the canvas.

---

## 30. Deployment

The production system will eventually require:

- Frontend hosting.
- Node.js backend hosting.
- SQL database.
- HTTPS.
- Environment variables.
- Production domain configuration.

Deployment should be automated only when automation provides clear value.

The first priority is a reliable, understandable deployment process.

Host-specific implementation details should be documented once the actual Hostinger environment is configured.

---

## 31. Logging

The backend should log useful technical events during development.

Examples:

- Server startup.
- Database connection failure.
- Unhandled request errors.
- Unexpected gameplay state.

Avoid excessive logging of normal player actions unless needed for debugging.

Never log secrets or sensitive session tokens.

---

## 32. Testing Strategy

Testing should grow with the project.

The most important early tests are gameplay calculations that do not require rendering.

Examples:

- Hunger decay over elapsed time.
- Sleep recovery.
- Stat clamping.
- Critical neglect start.
- Critical neglect reset after care.
- Death after 24 hours of critical neglect.
- Egg to alive transition.
- Restart from ghost to egg.

Rendering can initially be tested manually.

Automated browser testing can be introduced later if it becomes useful.

---

## 33. Code Style

Code should remain understandable to someone learning programming.

Prefer:

- Clear names.
- Small functions.
- Direct control flow.
- Simple modules.
- Explicit logic.

Avoid:

- Premature abstractions.
- Deep inheritance.
- Complex dependency injection.
- Generic systems built for hypothetical future features.
- Patterns used only to make the project look more advanced.

Comments should be concise, practical, and natural.

Prefer self-explanatory code whenever possible.

---

## 34. Git and Change Management

The repository should use:

- Feature branches.
- Issues.
- Pull Requests.
- Meaningful commits.
- Releases.
- Semantic versioning.

`main` should remain stable.

Technical decisions that materially change the project structure should also update this file.

---

## 35. Future Architecture Changes

The architecture should support later features without implementing them early.

Possible future additions include:

- Registered accounts.
- Guest-to-account migration.
- Inventory.
- Currency.
- Growth stages.
- Personality.
- Minigames.
- Achievements.
- Multiple environments.
- Social systems.

These should be added as separate layers around the existing core.

The MVP architecture should not attempt to solve all of them in advance.

---

## 36. Architectural Rules

The project should follow these permanent rules:

1. The backend is authoritative for important gameplay state.
2. Server time controls offline progression.
3. The frontend sends player intentions, not final game values.
4. Gameplay logic must remain separate from rendering.
5. Persistent gameplay state belongs in the database.
6. Browser storage is not the source of truth.
7. The dinosaur lifecycle is explicit: `egg`, `alive`, `ghost`.
8. Balance values should be centralized and easy to tune.
9. Static art can later be replaced without changing gameplay logic.
10. Complexity should only be added when an actual feature requires it.
11. Secrets must never be committed.
12. `main` should remain stable.

---

## 37. Current Architecture Goal

The first architecture milestone is complete when:

- The frontend can communicate with the backend.
- The backend can communicate with the SQL database.
- A guest player can be identified.
- A persistent egg can be created.
- The player can name the dinosaur.
- The backend can transition the pet from egg to alive.
- The frontend can render the correct lifecycle state.
- Gameplay state survives refreshes and returning visits.

After that foundation is stable, Hunger, Happiness, Energy, actions, offline progression, and neglect can be added incrementally.
