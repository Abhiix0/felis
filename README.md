# FELIS

> "I don't need to figure out what to do. It already figured that part out."

FELIS is a context-aware personal execution OS for developers. Its core job is to help you
capture work, understand your state, and always know the next best action.

## North-Star Interaction
"What should I do right now?"

## Architecture (Target)
- apps/mobile — Expo React Native
- apps/desktop — Vite + Tauri
- packages/types — Shared domain models
- packages/core — Recommendation engine, task parser, date utilities
- packages/validation — Zod schemas
- packages/api-client — Typed API client
- packages/design-tokens — Colors, spacing, typography
- backend/ — FastAPI + PostgreSQL

## Current State
The repository currently contains the working mobile prototype in expo-app/
and a Vite design preview in the root directory.

See docs/implementation-status.md for feature completion status.

## Running the Mobile App
```bash
cd expo-app
npm install
npx expo start
```

## Documentation
- docs/architecture.md — System architecture
- docs/implementation-status.md — Feature status
- docs/local-development.md — Full dev setup guide (coming in Phase 2)
