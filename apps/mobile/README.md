# FELIS Mobile

The Expo React Native application for FELIS — a context-aware personal execution OS for developers.

## What It Does
FELIS helps you answer "what should I do right now?" by:
- Maintaining your projects and tasks
- Computing the next best action using a deterministic scoring engine
- Running focused work sessions with a built-in timer
- Parsing natural-language quick-add input into structured tasks

## Tech Stack
- Expo ~57.0 / React Native 0.86.3
- Expo Router (file-based navigation)
- TypeScript ~6.0
- AsyncStorage for local persistence (SQLite migration planned in Phase 6)

## Running Locally
```bash
cd expo-app
npm install
npx expo start
```

## Screens
- Home: Next-best-action recommendation + today's tasks
- Projects: Project list with live-computed stats
- Project Detail: Tasks per project
- Tasks: Full task list
- Add Task: Natural-language quick-add with deterministic parser
- Focus Mode: Countdown timer with optional subtask checklist
- Radar: Tech news feed (placeholder)
- Profile: User settings (placeholder)

## Architecture
State: AppContext (React Context + AsyncStorage)
Domain logic: src/domain/ (pure functions, no React dependencies)
  - recommendation.ts: deterministic task scoring
  - taskParsing.ts: rule-based NLP parser (NOT AI)
  - projectSelectors.ts: derived project statistics
  - taskSelectors.ts: date-aware task filtering
Theme: src/theme/tokens.ts

## Implementation Status
See docs/implementation-status.md in the repo root.
