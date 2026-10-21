# DinoBoop — Game Design Document

**Version:** 0.3  
**Status:** Pre-production  
**Project:** DinoBoop  
**Tagline:** *Hatch. Care. Grow.*

---

## 1. Game Overview

### 1.1 Concept

DinoBoop is a browser-based 2D virtual pet game where the player raises and cares for a cute cartoon dinosaur.

The player manages the dinosaur's basic needs through interactions such as feeding, playing, and sleeping. The dinosaur continues to exist while the player is away, with its needs changing according to elapsed real-world time.

The initial version focuses on a small, polished virtual-pet loop with server-backed persistence.

Future versions can expand the dinosaur's personality, growth, customization, inventory, minigames, accounts, and social systems without replacing the core gameplay architecture.

---

## 2. Design Goals

DinoBoop should be:

- Easy to understand within seconds.
- Cute and visually expressive.
- Relaxing rather than stressful.
- Suitable for short daily visits.
- Persistent enough that the dinosaur feels alive.
- Resistant to simple client-side manipulation.
- Expandable without rewriting its core systems.
- Suitable as both a playable game and a public portfolio project.

The game should favor clarity and personality over mechanical complexity.

---

## 3. Target Platform

### Primary Platform

Desktop and mobile web browsers.

### Controls

Primary interactions:

- Mouse click.
- Touch.
- UI buttons.
- Direct interaction with the dinosaur where appropriate.

Keyboard controls should not be required for normal gameplay.

### Screen Support

The game should support:

- Desktop.
- Tablet.
- Mobile.

The same core gameplay should remain available across screen sizes.

---

## 4. Target Audience

DinoBoop is intended for players who enjoy:

- Virtual pets.
- Tamagotchi-style games.
- Cute characters.
- Casual browser games.
- Collection and progression systems.
- Short daily gameplay sessions.

---

## 5. Player Fantasy

The central fantasy is:

> "This is my little dinosaur, and I am responsible for taking care of it."

The dinosaur should feel like a character rather than a collection of statistics.

Its animations, expressions, needs, and reactions should gradually create attachment through repeated interaction.

---

## 6. Core Gameplay Loop

The basic loop is:

1. Open DinoBoop.
2. Load the dinosaur's current state from the server.
3. Check its condition.
4. Notice which needs are low.
5. Feed, play with, or rest the dinosaur.
6. Watch the dinosaur react.
7. The server records the resulting state.
8. Leave the game.
9. Return later and see how the dinosaur has changed.

If the dinosaur remains in a critically neglected state for too long, it can die and become a cute ghost dinosaur.

This loop should exist in the first playable release.

---

## 7. Core Needs

The MVP contains three primary needs:

- Hunger.
- Happiness.
- Energy.

Each need uses an internal numerical value.

Recommended range:

`0–100`

Higher values represent a better condition.

These values are authoritative on the server.

The frontend may display them, but it should not be trusted to determine their final values.

---

## 8. Hunger

Hunger represents how well-fed the dinosaur is.

Hunger gradually decreases over time.

### Feed Action

When the player feeds the dinosaur:

1. The frontend sends a Feed request.
2. The backend verifies the current state.
3. The backend applies the action.
4. Hunger increases.
5. The updated state is persisted.
6. The frontend receives the new state.
7. The dinosaur reacts visually.

Future versions may introduce:

- Multiple foods.
- Favorite foods.
- Food inventory.
- Food prices.
- Feeding animations.
- Overfeeding behavior.

These are not required for the MVP.

---

## 9. Happiness

Happiness represents the dinosaur's mood and entertainment.

Happiness gradually decreases over time.

### Play Action

When the player selects Play:

1. The frontend requests the Play action.
2. The backend calculates its effects.
3. Happiness increases.
4. Energy may decrease slightly.
5. The updated state is saved.
6. The frontend reflects the result.

Future versions may replace the generic Play action with toys or minigames.

---

## 10. Energy

Energy represents how tired the dinosaur is.

Energy decreases over time and may also decrease through activities.

### Sleep Action

When the player selects Sleep:

- The backend records the sleeping state.
- The starting timestamp is recorded.
- Energy recovers according to elapsed time.
- Other actions may be restricted while sleeping.
- The frontend displays the dinosaur sleeping.

The exact sleep behavior can remain simple during the MVP.

---

## 11. Stat Relationships

The needs should interact enough to make the dinosaur feel coherent without becoming a complex simulation.

Examples:

- Playing increases Happiness but consumes Energy.
- Sleeping restores Energy.
- Feeding restores Hunger.
- Real-world time decreases needs.

The system should avoid harsh punishment.

Returning after an absence should create something for the player to care for, not punish the player for leaving.

---

## 12. Time and Offline Progression

Offline progression is calculated using server-controlled time.

The client clock must not be treated as authoritative.

The server stores the latest relevant timestamp for the dinosaur.

When the dinosaur's state is requested:

1. The server reads the previous timestamp.
2. The server determines how much real time has passed.
3. Need decay or recovery is calculated.
4. Values are clamped to valid limits.
5. The new state is persisted when appropriate.
6. The frontend receives the resulting state.

This prevents simple manipulation by changing the local device clock.

### Design Principle

Offline progression should create a reason to return without making DinoBoop demanding.

The dinosaur should not permanently die because the player was absent.

---

## 13. Dinosaur States

The dinosaur's visible state should reflect its gameplay state.

Initial states may include:

- Idle.
- Happy.
- Hungry.
- Tired.
- Sleeping.
- Eating.
- Playing.

The first implementation can use static images or frames.

Complex animation is not required for the initial release.

---

## 14. State Priority

Several conditions may exist simultaneously.

The presentation layer determines which state receives visual priority.

A possible order is:

1. Sleeping.
2. Current interaction.
3. Very tired.
4. Very hungry.
5. Unhappy.
6. Idle.

Exact thresholds should remain configurable.

Gameplay state and rendering state must remain separate.

---

## 15. Player Actions

The MVP contains three primary actions.

### Feed

Primary effect:

- Increase Hunger.

Possible secondary effect:

- Small Happiness increase.

### Play

Primary effect:

- Increase Happiness.

Possible secondary effect:

- Reduce Energy.

### Sleep

Primary effect:

- Restore Energy over time.

Possible secondary behavior:

- Disable Feed and Play while sleeping.

All actions are validated and processed by the backend.

The frontend requests actions but does not determine the authoritative result.

---

## 16. Interaction Feedback

Every action should provide immediate feedback.

Possible feedback includes:

- Expression change.
- Temporary pose.
- Movement.
- Stat meter animation.
- Small effects.
- Short text reaction.
- Sound in later versions.

The player should always understand whether an action succeeded.

---

## 17. Starting State

A new player does not begin with a visible dinosaur.

The first thing the player sees is an egg.

The player must give the dinosaur a name before it hatches.

After the name is confirmed:

1. The name is saved by the backend.
2. The egg reacts visually.
3. The egg cracks.
4. The dinosaur hatches.
5. The normal care interface becomes available.

The newly hatched dinosaur begins with balanced needs.

Example:

- Hunger: 80.
- Happiness: 80.
- Energy: 80.

Exact values should remain configurable.

The hatching moment should feel special and establish an immediate sense of ownership.

The first session should allow the player to experiment without immediately dealing with an emergency.

---

## 18. Persistence

Persistent game data is stored on the backend.

The database should store at minimum:

- Dinosaur identifier.
- Dinosaur name.
- Lifecycle state, such as egg, alive, or ghost.
- Hunger.
- Happiness.
- Energy.
- Sleep state when relevant.
- Last meaningful care timestamp.
- Critical neglect start timestamp when relevant.
- Death timestamp when relevant.
- Last processed timestamp.
- Creation timestamp.
- Other basic progression data introduced later.

The backend is the source of truth.

### Browser Storage

Browser storage may still be used for non-authoritative data such as:

- Guest/session identifiers.
- UI preferences.
- Audio settings.
- Temporary caching.

Gameplay progression should not depend solely on local storage.

---

## 19. Guest Player System

Full user authentication is not required for the first release.

The game may initially create an anonymous or guest player.

A guest player receives a persistent identifier that allows the browser to reconnect to the same dinosaur.

This allows DinoBoop to use a real backend from the beginning without requiring account registration during the MVP.

### Future Upgrade

Later, a guest dinosaur should be attachable to a registered account when authentication is introduced.

The player should not have to restart progress simply because they create an account.

---

## 20. First-Time Experience

The initial experience should be short, personal, and memorable.

Possible flow:

1. DinoBoop loads.
2. The frontend requests a player session.
3. The backend creates or retrieves the player's current pet state.
4. A new player sees only an egg.
5. The player is asked to name the dinosaur.
6. The backend stores the chosen name.
7. The egg wiggles and cracks.
8. The dinosaur hatches.
9. Hunger, Happiness, and Energy become visible.
10. Feed, Play, and Sleep become available.
11. A short prompt explains the objective.

Example:

> Take care of your new dinosaur.

The naming and hatching sequence is the player's introduction to the pet and should feel charming without becoming a long cutscene.

A long tutorial should not be necessary.

---

## 21. Main Game Screen

The main screen contains three main areas.

### Dinosaur Area

The dinosaur is the visual focus.

### Status Area

Displays:

- Hunger.
- Happiness.
- Energy.

### Action Area

Contains:

- Feed.
- Play.
- Sleep.

The dinosaur should remain visually more important than menus and statistics.

---

## 22. UI Principles

The interface should be:

- Clean.
- Colorful.
- Easy to scan.
- Touch-friendly.
- Responsive.
- Minimal.

The MVP should avoid:

- Deep menus.
- Complicated inventories.
- Multiple currencies.
- Excessive notifications.
- Large amounts of instructional text.

---

## 23. Art Direction

DinoBoop should feature a cute, stylized cartoon dinosaur.

The character should be:

- Friendly.
- Expressive.
- Easily readable at small sizes.
- Recognizable through silhouette.
- Suitable for multiple emotional states.

Realistic dinosaur anatomy is not required.

Personality is more important than realism.

### Initial Art Strategy

Development begins with static frames.

Possible initial frames:

- Egg.
- Cracking egg.
- Idle.
- Happy.
- Hungry.
- Tired.
- Sleeping.
- Ghost.

### Later Art Strategy

Static visuals may later be replaced with:

- Spritesheet animation.
- 2D cutout animation.
- Layered body-part animation.
- Additional expressions.
- Transition animations.

The gameplay systems must not depend on the animation implementation.

---

## 24. Audio

Audio is not required for the first functional build.

Later versions may include:

- UI sounds.
- Eating sounds.
- Happy reactions.
- Sleep sounds.
- Ambient effects.
- Background music.

Audio must be optional.

---

## 25. Failure, Neglect, and Death

DinoBoop includes a real but gentle death state.

A dinosaur does not die simply because the player has been offline for one day.

Instead, death occurs only after sustained critical neglect.

### Critical Neglect

When the dinosaur's needs deteriorate into a critically neglected state, a danger period begins.

If the dinosaur remains in that critical state for 24 consecutive hours without meaningful care, it dies.

Meaningful care may include actions such as:

- Feeding.
- Playing.
- Sleeping or waking when appropriate.
- Other direct care interactions added later.

The exact conditions that define "critical neglect" should remain configurable during balancing.

### Ghost Dino

When the dinosaur dies, it becomes a cute ghost version of itself rather than disappearing or being shown in a harsh way.

The ghost should feel:

- Cute.
- Slightly sad.
- Playful.
- Gentle rather than disturbing.

Possible visual traits include:

- Semi-transparent body.
- Floating movement.
- Soft glow.
- Small ghost-like animations.
- A playful "boo" reaction.

The original dinosaur is considered gone.

After the ghost state is shown, the player can choose to begin again with a new egg.

A future version may preserve previous dinosaurs in a small history or memorial feature, but this is not required for the MVP.

The game should create emotional consequence without using guilt-heavy language or graphic imagery.

---

## 26. Security and Game Integrity

Because the backend exists from the beginning, important gameplay calculations should not trust values submitted by the browser.

The client should not be able to say:

- "My Hunger is now 100."
- "Ten hours have passed."
- "Give me this reward."

Instead, it should send requests such as:

- Feed the dinosaur.
- Play with the dinosaur.
- Put the dinosaur to sleep.
- Wake the dinosaur.

The backend determines the result.

This architecture makes later progression systems easier to protect.

It is not intended to make the game impossible to cheat. The goal is to avoid making basic progression trivially editable through browser tools.

---

## 27. Authentication

Authentication is a post-MVP gameplay feature, even though the backend already exists.

Future authentication may support:

- Email-based accounts.
- Cloud access across devices.
- Recovery of progress.
- Multiple devices.
- Player profiles.

Authentication should build on the existing backend rather than requiring a new persistence architecture.

---

## 28. Progression

Progression is not required for the first MVP.

Possible later systems include:

- Dinosaur age.
- Growth stages.
- Experience.
- Unlockable items.
- Food.
- Toys.
- Rooms.
- Decorations.
- Achievements.

The core care loop should be proven before these systems are introduced.

---

## 29. Growth System

A future version may include:

- Egg.
- Hatchling.
- Young dinosaur.
- Adult dinosaur.

Growth may depend on:

- Time.
- Quality of care.
- Interaction milestones.
- Progression achievements.

Different care patterns may eventually influence appearance or personality.

---

## 30. Personality System

Future dinosaurs may develop individual traits.

Possible examples:

- Playful.
- Sleepy.
- Curious.
- Hungry.
- Affectionate.
- Independent.

Personality may affect:

- Reactions.
- Favorite activities.
- Favorite foods.
- Idle behavior.
- Dialogue.
- Stat tendencies.

The system should make the dinosaur feel individual rather than become another collection of numbers.

---

## 31. Inventory

Inventory is a post-MVP feature.

Possible categories:

- Food.
- Toys.
- Cosmetics.
- Decorations.
- Collectibles.

Inventory data should be owned and validated by the backend once introduced.

---

## 32. Food System

The MVP uses a generic Feed action.

Later versions may introduce food items with properties such as:

- Hunger restoration.
- Happiness bonus.
- Favorite food status.
- Rarity.
- Cost.

Example food types:

- Meat.
- Berries.
- Fruit.
- Dino snacks.
- Special treats.

---

## 33. Toys and Play

The MVP uses a generic Play action.

Future toys may include:

- Ball.
- Stick.
- Plush dinosaur.
- Bubble toy.
- Puzzle toy.

Different toys may trigger different interactions or bonuses.

---

## 34. Minigames

Minigames are post-MVP features.

Possible purposes:

- Increase Happiness.
- Earn currency.
- Unlock items.
- Create gameplay variety.

Possible concepts:

- Catch falling food.
- Fetch.
- Memory matching.
- Obstacle running.
- Fossil digging.

Minigames should remain optional to basic pet maintenance.

---

## 35. Currency

Currency is not required for the MVP.

Later, players may earn currency through:

- Daily interactions.
- Minigames.
- Achievements.
- Progression milestones.

Currency may be spent on:

- Food.
- Toys.
- Cosmetics.
- Decorations.

The game should avoid unnecessary multiple-currency systems.

---

## 36. Customization

Future customization may include:

- Dinosaur colors.
- Patterns.
- Hats.
- Accessories.
- Backgrounds.
- Room decorations.

Customization should increase player ownership while preserving DinoBoop's recognizable visual identity.

---

## 37. Environment

The MVP should begin with one environment.

Future environments may include:

- Bedroom.
- Garden.
- Prehistoric forest.
- Beach.
- Cave.
- Playground.

Multiple environments are not required for the initial care loop.

---

## 38. Notifications

Notifications are not required for the MVP.

If introduced later, they should be optional.

Possible notifications:

- The dinosaur is hungry.
- The dinosaur woke up.
- A reward is available.

The game should avoid excessive notification pressure.

---

## 39. Online Features

Possible later online features include:

- User profiles.
- Cross-device saves.
- Leaderboards.
- Sharing dinosaurs.
- Visiting another player's dinosaur.
- Seasonal events.

These should be introduced separately rather than as one large multiplayer system.

---

## 40. Core MVP

The first public playable version should contain only the systems required to establish the core game and its technical foundation.

### MVP Features

- Vite + TypeScript frontend.
- PixiJS rendering.
- Node.js + TypeScript backend.
- SQL database.
- Basic API communication.
- Guest player/session system.
- Egg-first onboarding.
- Dinosaur naming.
- Hatching sequence.
- Static dinosaur.
- Hunger.
- Happiness.
- Energy.
- Feed action.
- Play action.
- Sleep action.
- Critical neglect tracking.
- 24-hour critical neglect danger period.
- Ghost-dino death state.
- Restart with a new egg after death.
- Server-authoritative gameplay state.
- Server-controlled timestamps.
- Offline progression.
- Persistent database save.
- Basic dinosaur visual states.
- Responsive web interface.
- Deployment of frontend and backend.

### Not Required for MVP

- Registered user accounts.
- Social login.
- Inventory.
- Currency.
- Growth.
- Personality.
- Minigames.
- Cosmetics.
- Multiple dinosaurs.
- Social systems.
- Complex animation.
- Achievements.
- Notifications.

---

## 41. MVP Success Criteria

The MVP is successful when:

- A new player sees an egg and can name their dinosaur.
- Naming triggers a clear hatching moment.
- The dinosaur clearly communicates its current state.
- Feed, Play, and Sleep produce visible results.
- Gameplay actions are processed by the backend.
- Important game values cannot be changed simply by editing frontend state.
- Need decay works correctly using server time.
- Critical neglect is tracked correctly.
- A dinosaur that remains critically neglected for 24 consecutive hours becomes a ghost.
- The player can begin again with a new egg after death.
- Leaving and returning preserves the dinosaur.
- Offline progression works correctly.
- Refreshing the page does not reset progress.
- The game works on desktop and mobile layouts.
- The core interaction loop feels complete without advanced systems.

---

## 42. Development Phases

### Phase 1 — Project Foundation

Create:

- Frontend project.
- Backend project.
- Shared development structure.
- Environment configuration.
- Git repository structure.
- Basic deployment configuration.

Target result:

Frontend and backend run and communicate successfully.

### Phase 2 — Database and Player Identity

Create:

- SQL database connection.
- Guest player/session model.
- Dinosaur persistence model.
- Dinosaur name and lifecycle state.
- Basic create/read API.

Target result:

Opening DinoBoop creates or retrieves a persistent pet state.

### Phase 3 — Egg, Naming, and Hatching

Implement:

- PixiJS scene.
- Static egg.
- Dinosaur naming.
- Egg crack/hatching sequence.
- Static dinosaur.
- Basic responsive layout.

Target result:

A new player names the dinosaur and sees it hatch, while returning players see their existing pet state.

### Phase 4 — Pet State

Implement:

- Hunger.
- Happiness.
- Energy.
- Server-side state rules.

Target result:

The backend owns the dinosaur's gameplay state.

### Phase 5 — Player Actions

Implement:

- Feed.
- Play.
- Sleep.
- Backend action validation.
- API responses.

Target result:

The player can manage the dinosaur through server-authoritative actions.

### Phase 6 — Time, Offline Progression, and Neglect

Implement:

- Server timestamps.
- Need decay.
- Sleep recovery.
- Offline calculations.
- Critical neglect detection.
- 24-hour critical neglect timer.
- Ghost-dino death transition.

Target result:

The dinosaur changes correctly while the player is away and can die after sustained critical neglect.

### Phase 7 — Character Feedback

Add:

- Dinosaur states.
- Expressions.
- Interaction feedback.
- Basic transitions.

Target result:

The dinosaur visibly reacts to both needs and player actions.

### Phase 8 — MVP Polish

Improve:

- Responsive UI.
- Game balance.
- Visual consistency.
- Loading states.
- API error handling.
- Database error handling.
- Deployment reliability.

Target result:

A complete first public release.

---

## 43. Game Balance Philosophy

Balance values should remain easy to change during development.

Examples include:

- Hunger decay rate.
- Happiness decay rate.
- Energy decay rate.
- Feed restoration.
- Play restoration.
- Play energy cost.
- Sleep recovery rate.

Initial balance should support casual play.

Desired behavior:

- The player can leave for several hours without serious consequences.
- Returning after a day provides meaningful actions.
- A short session can restore the dinosaur to a healthy state.
- Repeated button spam should not be required.

Exact numbers should be determined through testing.

---

## 44. Emotional Design

Attachment should come primarily from the dinosaur's reactions.

### Feeding

The dinosaur may:

- Become excited.
- Eat.
- Show satisfaction.

### Playing

The dinosaur may:

- Become energetic.
- React to the player.
- Show happiness.

### Tired

The dinosaur may:

- Develop heavy eyes.
- Move less.
- Yawn.

### Sleeping

The dinosaur may:

- Close its eyes.
- Stop most movement.
- Display subtle breathing.
- Show a sleeping indicator.

Small expressive reactions are more important than large amounts of UI.

---

## 45. Design Constraints

DinoBoop should avoid feature creep.

Before adding a feature, ask:

- Does it improve caring for the dinosaur?
- Does it make the dinosaur feel more alive?
- Does it create meaningful progression?
- Is the current system already stable?
- Can it be added without unnecessarily complicating the game?

If not, it can wait.

---

## 46. Separation of Responsibilities

The project should separate:

- Gameplay rules.
- Backend persistence.
- API communication.
- Rendering.
- UI.
- Animation.

For example:

The backend determines that the dinosaur has `18` Hunger.

The gameplay interpretation determines that this means the dinosaur is very hungry.

The presentation layer decides how that condition appears visually.

It may use:

- A static hungry frame.
- A spritesheet animation.
- A cutout animation.
- An expression.
- A sound.

Changing the visual representation should not require changing the underlying gameplay rules.

Detailed technical structure belongs in `ARCHITECTURE.md`.

---

## 47. Backend Design Principle

The backend exists from the beginning because DinoBoop is intended to become a persistent progression game.

Introducing it early avoids moving important game systems from client-side storage to server-side storage later.

The backend should remain small during the MVP.

Its initial responsibilities are limited to:

- Identifying the guest player.
- Storing the dinosaur.
- Processing actions.
- Calculating time-based progression.
- Persisting authoritative state.
- Returning current game state.

Features such as accounts, inventory, achievements, and social systems should not be added merely because a backend already exists.

---

## 48. Public Project Goals

DinoBoop is also a public portfolio project.

It should demonstrate:

- Incremental development.
- Meaningful Git history.
- Feature branches.
- Pull Requests.
- Issues.
- Releases.
- Semantic versioning.
- TypeScript frontend development.
- PixiJS.
- Backend API design.
- SQL persistence.
- Client/server separation.
- Game-state management.
- Responsive UI.
- 2D rendering.
- Production deployment.

The portfolio aspect must not make the code unnecessarily complex.

Readable code is more valuable than architecture added only to appear advanced.

---

## 49. Security Principles

The project must never commit secrets.

Local secrets should use:

`.env`

This file must be ignored by Git.

Public configuration examples may use:

`.env.example`

Production secrets should use environment variables provided by the hosting environment.

Sensitive values may include:

- Database credentials.
- Authentication secrets.
- API secrets.
- Production configuration.

---

## 50. Release Philosophy

Development should produce small working milestones.

Possible progression:

**v0.1.0**  
Frontend, backend, database connection, and basic deployment.

**v0.2.0**  
Persistent guest dinosaur.

**v0.3.0**  
Hunger, Happiness, and Energy.

**v0.4.0**  
Feed, Play, and Sleep.

**v0.5.0**  
Offline progression and state reactions.

**v0.6.0**  
UI and gameplay polish.

**v1.0.0**  
Stable public MVP.

Exact version boundaries may change during development.

---

## 51. Post-MVP Direction

After the core game is stable, development may gradually explore:

1. Better dinosaur animation.
2. Registered accounts.
3. Guest-to-account migration.
4. Growth stages.
5. Inventory.
6. Multiple foods.
7. Toys.
8. Currency.
9. Personality.
10. Minigames.
11. Customization.
12. Achievements.
13. Additional environments.
14. Social features.
15. Seasonal content.

These are possible directions rather than commitments.

---

## 52. Long-Term Vision

The long-term version of DinoBoop can become a persistent virtual dinosaur companion.

A player could:

- Hatch a dinosaur.
- Name it.
- Raise it over time.
- Discover its personality.
- Watch it grow.
- Feed it different foods.
- Give it toys.
- Customize its appearance.
- Decorate its environment.
- Play minigames together.
- Unlock collectibles.
- Create an account.
- Continue playing across multiple devices.

The larger game should continue to revolve around the original simple idea:

> Care for a small dinosaur and watch it become yours.

---

## 53. Current Development Focus

The immediate development priorities are:

1. Project setup.
2. Backend setup.
3. Database setup.
4. Frontend-to-backend communication.
5. Guest player identity.
6. Persistent pet creation.
7. Egg state.
8. Dinosaur naming.
9. Egg cracking and hatching.
10. Static dinosaur rendering.
11. Hunger.
12. Happiness.
13. Energy.
14. Feed.
15. Play.
16. Sleep.
17. Server-side time calculations.
18. Offline progression.
19. Critical neglect tracking.
20. Ghost-dino death state.
21. Restart with a new egg.
22. Dinosaur state feedback.
23. Responsive UI.
24. MVP deployment and polish.

Everything else remains secondary until this loop works reliably.

---

## 54. Core Rule

When deciding what DinoBoop needs next, prioritize the smallest feature that makes the dinosaur feel more alive or makes its existing gameplay foundation more reliable.

**Hatch. Care. Grow.**
