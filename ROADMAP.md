# DinoBoop — Roadmap

**Version:** 0.1  
**Status:** Active  
**Project:** DinoBoop

---

## 1. Purpose

This roadmap defines the order in which DinoBoop should be built.

The goal is to develop the game incrementally, keep `main` stable, and avoid implementing future systems before the core virtual pet loop is complete.

Each phase should end with a working project state.

A phase does not have to equal a single commit. Use as many meaningful commits as needed to complete the work cleanly.

---

## 2. MVP Goal

The first public MVP should allow a player to:

1. Open DinoBoop in a browser.
2. Receive a persistent guest identity.
3. See an egg.
4. Name the dinosaur.
5. Watch the egg crack and hatch.
6. Care for the dinosaur through Hunger, Happiness, and Energy.
7. Feed, play with, and put the dinosaur to sleep.
8. Leave the website and return later with progress preserved.
9. Experience server-controlled offline progression.
10. Enter a critical neglect state if the dinosaur is not cared for.
11. Lose the dinosaur if it remains critically neglected for 24 consecutive hours.
12. See the dinosaur become a cute ghost.
13. Start again with a new egg.
14. Use the game comfortably on desktop and mobile.

The MVP should prove the complete care loop before larger systems are added.

---

# Phase 0 — Repository and Documentation

## Goal

Create a clean public project foundation before game development begins.

## Tasks

- Create the GitHub repository.
- Add `README.md`.
- Add `GDD.md`.
- Add `ROADMAP.md`.
- Add `ARCHITECTURE.md`.
- Add `.gitignore`.
- Add `.env.example`.
- Choose the initial license when ready.
- Confirm English-only project naming, code, comments, documentation, Issues, and commits.

## Done When

- The repository exists publicly.
- Project documentation is committed.
- Secrets cannot accidentally be committed through `.env`.
- `main` contains only the project foundation.

## Suggested Release

No release required yet.

---

# Phase 1 — Frontend and Backend Foundation

## Goal

Create the basic web application and make the frontend communicate with the backend.

## Frontend

Set up:

- Vite.
- TypeScript.
- PixiJS.
- Basic HTML/CSS.
- Application entry point.

## Backend

Set up:

- Node.js.
- TypeScript.
- HTTP server.
- Basic API route.
- Environment configuration.

## Integration

Create a simple request from the frontend to the backend.

Example purpose:

```text
GET /api/health
```

The response only needs to prove that both sides can communicate.

## Done When

- The frontend runs locally.
- The backend runs locally.
- PixiJS initializes successfully.
- The frontend can request data from the backend.
- Development environment variables work.
- No secrets are committed.

## Suggested Release

`v0.1.0`

---

# Phase 2 — Database and Guest Identity

## Goal

Introduce persistent server-side data from the beginning.

## Tasks

- Choose and configure the SQL database.
- Connect the backend to the database.
- Create the initial database schema.
- Add guest player persistence.
- Add guest session identification.
- Create a persistent pet record for a new guest.
- Restore the same pet on later visits from the same guest session.
- Add basic database error handling.

## Initial Data

The pet should begin with:

```text
lifecycle = egg
name = null
```

Gameplay stats may exist in the schema already, but they do not need to be active yet.

## Done When

- A new visitor receives a persistent guest identity.
- The backend creates one pet in the `egg` state.
- Refreshing the page retrieves the same pet.
- Important data lives in the database rather than only in the browser.

## Suggested Release

`v0.2.0`

---

# Phase 3 — Egg, Naming, and Hatching

## Goal

Build the first real player experience.

## Tasks

- Display the egg in PixiJS.
- Create the dinosaur naming UI.
- Validate the name in the frontend.
- Validate the name again in the backend.
- Save the name to the database.
- Change lifecycle state from `egg` to `alive`.
- Create an egg reaction or wiggle.
- Create the egg cracking sequence.
- Reveal the dinosaur after hatching.
- Ensure returning players skip the naming flow if their pet is already alive.

## Design Rule

The backend controls the lifecycle transition.

The frontend controls the visual hatching sequence.

## Done When

A new player can:

1. Open DinoBoop.
2. See only an egg.
3. Enter a name.
4. Confirm the name.
5. Watch the egg crack.
6. See their dinosaur hatch.
7. Refresh and return to the same named dinosaur.

## Suggested Release

`v0.3.0`

---

# Phase 4 — Core Pet State

## Goal

Give the dinosaur persistent needs.

## Tasks

Implement:

- Hunger.
- Happiness.
- Energy.
- Valid stat ranges.
- Central gameplay configuration.
- Backend-owned stat values.
- API response containing current pet state.
- Frontend stat display.

Recommended internal range:

```text
0–100
```

Initial values can begin around:

```text
Hunger: 80
Happiness: 80
Energy: 80
```

Exact values should remain easy to tune.

## Done When

- The database stores the three needs.
- The backend returns them.
- The frontend displays them.
- Editing frontend state does not permanently alter server state.
- All balance values are easy to locate and change.

## Suggested Release

`v0.4.0`

---

# Phase 5 — Feed, Play, and Sleep

## Goal

Make the core care loop playable.

## Feed

Implement a server-authoritative Feed action.

Initial behavior:

- Increase Hunger.
- Optionally increase Happiness slightly.

## Play

Implement a server-authoritative Play action.

Initial behavior:

- Increase Happiness.
- Reduce Energy slightly.

## Sleep

Implement sleeping.

Initial behavior:

- Record sleeping state.
- Restrict incompatible actions.
- Allow Energy recovery over time.

## Frontend Feedback

Add simple feedback for:

- Feeding.
- Playing.
- Sleeping.
- Invalid actions.

Static visual changes are enough at this stage.

## Done When

The player can successfully:

- Feed the dinosaur.
- Play with the dinosaur.
- Put the dinosaur to sleep.
- Wake it when appropriate.
- See updated state returned by the backend.

## Suggested Release

`v0.5.0`

---

# Phase 6 — Server Time and Offline Progression

## Goal

Make the dinosaur continue changing while the player is away.

## Tasks

- Add server-controlled timestamps.
- Track the last processed game time.
- Calculate elapsed time on the backend.
- Apply Hunger decay.
- Apply Happiness decay.
- Apply Energy changes.
- Apply sleep recovery.
- Clamp all values safely.
- Save the resulting state.
- Reuse the same progression logic across relevant API actions.

## Important Rule

Do not trust the user's device clock for progression.

## Done When

- Leaving the website for a period changes the dinosaur correctly.
- Refreshing does not reset progression.
- Changing the local device clock does not directly control game progression.
- Sleeping works correctly across offline periods.

## Suggested Release

`v0.6.0`

---

# Phase 7 — Critical Neglect and Ghost Dino

## Goal

Add meaningful consequences while keeping the tone cute.

## Critical Neglect

Define configurable conditions that place the dinosaur in a critically neglected state.

The exact thresholds should be tuned during testing.

## Danger Period

When critical neglect begins:

- Store the critical neglect start time.
- Start a 24-hour server-controlled danger period.

If meaningful care restores the dinosaur before the timer ends:

- Clear the critical neglect state.
- Clear the critical neglect timestamp.

If the dinosaur remains critically neglected for 24 consecutive hours:

- Change lifecycle state to `ghost`.
- Record the death timestamp.

## Ghost Dino

Create a static ghost version of the dinosaur.

Initial ghost behavior may include:

- Floating.
- Semi-transparent appearance.
- Small playful ghost reaction.
- No normal Feed, Play, or Sleep actions.

Keep the presentation gentle and non-graphic.

## Restart

Allow the player to choose:

```text
Hatch a New Egg
```

Restart should:

- Preserve the guest player.
- End the previous pet lifecycle.
- Create a new pet in the `egg` state.
- Return the player to the naming flow.

## Done When

- Critical neglect begins correctly.
- Care can cancel the danger state.
- The 24-hour timer uses server time.
- A neglected dinosaur becomes a ghost.
- The ghost state persists after refresh.
- The player can start again with a new egg.

## Suggested Release

`v0.7.0`

---

# Phase 8 — Character State Feedback

## Goal

Make the dinosaur visibly communicate how it feels.

## Initial Visual States

Add or improve:

- Egg.
- Cracking egg.
- Idle.
- Happy.
- Hungry.
- Tired.
- Sleeping.
- Eating.
- Playing.
- Ghost.

Static frames are acceptable.

## State Priority

Implement a clear visual priority system.

Possible order:

1. Ghost.
2. Sleeping.
3. Current interaction.
4. Very tired.
5. Very hungry.
6. Unhappy.
7. Idle.

## Done When

The player can understand the dinosaur's general condition without relying only on stat values.

## Suggested Release

`v0.8.0`

---

# Phase 9 — Responsive UI and Game Feel

## Goal

Make the MVP comfortable and pleasant to use.

## Tasks

Improve:

- Desktop layout.
- Mobile layout.
- Touch targets.
- Stat readability.
- Button feedback.
- Name input experience.
- Loading states.
- API error messages.
- Hatching presentation.
- Ghost presentation.
- Basic transitions.
- Visual consistency.

Optional at this stage:

- Small sound effects.
- Simple ambient audio.

Audio must remain optional.

## Done When

- The game is usable on common desktop and mobile screen sizes.
- Core interactions are clear.
- Loading and backend errors do not leave the UI in a broken state.
- The game feels coherent even with simple art.

## Suggested Release

`v0.9.0`

---

# Phase 10 — Public MVP Deployment

## Goal

Deploy a stable public version of DinoBoop.

## Tasks

- Configure production frontend hosting.
- Configure production Node.js backend.
- Configure the production SQL database.
- Configure environment variables.
- Configure HTTPS.
- Configure the temporary production domain.
- Verify frontend/backend communication in production.
- Test new guest creation.
- Test returning guest persistence.
- Test hatching.
- Test all three care actions.
- Test offline progression.
- Test critical neglect.
- Test ghost transition.
- Test restart with a new egg.
- Test desktop.
- Test mobile.
- Update `README.md` with the live website URL.
- Update local development instructions.
- Review public repository for secrets or accidental private data.

## Done When

A new user can visit the public URL and complete the full MVP lifecycle without developer intervention.

## Suggested Release

`v1.0.0`

---

# MVP Completion Checklist

The first public MVP is complete when all of the following work reliably:

- [ ] Public web deployment.
- [ ] Guest identity.
- [ ] Persistent database-backed pet.
- [ ] Egg-first onboarding.
- [ ] Dinosaur naming.
- [ ] Hatching sequence.
- [ ] Hunger.
- [ ] Happiness.
- [ ] Energy.
- [ ] Feed.
- [ ] Play.
- [ ] Sleep.
- [ ] Wake behavior.
- [ ] Server-authoritative state.
- [ ] Server-controlled time.
- [ ] Offline progression.
- [ ] Critical neglect detection.
- [ ] 24-hour critical neglect timer.
- [ ] Ghost-dino death state.
- [ ] Restart with a new egg.
- [ ] Basic character state feedback.
- [ ] Responsive desktop UI.
- [ ] Responsive mobile UI.
- [ ] Production error handling.
- [ ] No committed secrets.

---

# Post-MVP Roadmap

Do not begin these systems until the MVP is stable.

The order below is provisional.

## Stage A — Better Character Presentation

Possible work:

- Spritesheet animation.
- 2D cutout animation.
- Better transitions.
- More expressions.
- More idle behavior.
- Improved sound.

The rendering upgrade should not change gameplay rules.

---

## Stage B — Accounts

Possible work:

- Registered user accounts.
- Login.
- Account recovery.
- Guest-to-account migration.
- Cross-device access.

Existing guest progress should be preserved when possible.

---

## Stage C — Growth

Possible work:

- Egg.
- Hatchling.
- Young dinosaur.
- Adult dinosaur.
- Growth milestones.
- Age or care-based progression.

Do not introduce growth until the basic care loop is already enjoyable.

---

## Stage D — Inventory and Food

Possible work:

- Inventory.
- Multiple foods.
- Favorite foods.
- Toys.
- Item ownership.
- Backend item validation.

---

## Stage E — Economy

Possible work:

- Single game currency.
- Rewards.
- Purchases using in-game currency.
- Unlockable items.

Avoid multiple currencies unless there is a strong design reason.

---

## Stage F — Personality

Possible work:

- Individual personality traits.
- Preferred activities.
- Favorite foods.
- Different reactions.
- Personality-influenced idle behavior.

Personality should make dinosaurs feel different without turning into an overly complex stat system.

---

## Stage G — Minigames

Possible work:

- Small optional minigames.
- Happiness rewards.
- Currency rewards.
- Collectible rewards.

Minigames should not become mandatory for basic care.

---

## Stage H — Customization and Environments

Possible work:

- Dinosaur colors.
- Patterns.
- Accessories.
- Room decorations.
- Multiple environments.

---

## Stage I — Social and Seasonal Features

Possible future work:

- Player profiles.
- Visiting another player's dinosaur.
- Sharing.
- Seasonal events.
- Achievements.
- Leaderboards where appropriate.

These systems are long-term possibilities, not current commitments.

---

# Development Rules

Throughout the roadmap:

1. Keep `main` stable.
2. Use feature branches for meaningful changes.
3. Use Issues to define work.
4. Use Pull Requests to merge completed work.
5. Use meaningful Git commits.
6. Prefer small working increments.
7. Do not build future systems early.
8. Keep gameplay logic separate from rendering.
9. Keep authoritative progression on the backend.
10. Never commit secrets.
11. Update documentation when a design or architectural decision changes.
12. Prefer understandable code over unnecessary abstraction.

---

# Current Next Step

The next implementation milestone is:

**Phase 0 — Repository and Documentation**

Once the documentation files are committed, move directly to:

**Phase 1 — Frontend and Backend Foundation**
