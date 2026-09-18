# FELIS System Architecture

## Overview

FELIS is a context-aware personal execution OS for developers. Its core responsibility is to help developers capture work, understand current context, and immediately determine the next best action.

```
+-------------------------------------------------------------------------+
|                               FELIS Clients                             |
|                                                                         |
|   +--------------------------+          +---------------------------+   |
|   |   Mobile App (Expo)      |          |   Desktop App (Vite+Tauri)|   |
|   |   apps/mobile            |          |   apps/desktop            |   |
|   +------------+-------------+          +-------------+-------------+   |
+----------------|--------------------------------------|-----------------+
                 |                                      |
                 +-------------------+------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                              Shared Packages                            |
|                                                                         |
|  +--------------------+  +--------------------+  +-------------------+  |
|  |   packages/types   |  |   packages/core    |  |packages/validation|  |
|  |   Domain Models    |  |  Recom/NLP/Dates   |  |   Zod Schemas     |  |
|  +--------------------+  +--------------------+  +-------------------+  |
|  +--------------------+  +--------------------+                         |
|  |packages/design-tok |  |packages/api-client |                         |
|  | Colors/Typography  |  | Typed Fetch Client |                         |
|  +--------------------+  +--------------------+                         |
+------------------------------------+------------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                             Backend Service                             |
|                                                                         |
|   +-----------------------------------------------------------------+   |
|   |   FastAPI Application (backend/)                                |   |
|   |   - Auth & Session Management (DevJWT / OAuth abstraction)      |   |
|   |   - Project & Task CRUD APIs                                    |   |
|   |   - Recommendation Scoring Engine (Python counterpart)          |   |
|   |   - Focus Session Telemetry & Tracking                          |   |
|   +--------------------------------+--------------------------------+   |
|                                    |                                    |
|                                    v                                    |
|   +-----------------------------------------------------------------+   |
|   |   PostgreSQL Database (SQLAlchemy 2.x + Alembic Migrations)     |   |
|   +-----------------------------------------------------------------+   |
+-------------------------------------------------------------------------+
```

## Layers & Components

### 1. Clients
- **Mobile (`apps/mobile` / `expo-app`)**: React Native with Expo Router. Offline-first local persistence with background synchronization.
- **Desktop (`apps/desktop`)**: Vite + React with Tauri shell. Native keyboard shortcuts (Cmd/Ctrl+K quick add) and system tray integrations.

### 2. Shared Core (`packages/*`)
- **`packages/types`**: Cross-platform TypeScript models for Users, Projects, Tasks, Recommendations, and Focus Sessions.
- **`packages/core`**: Deterministic recommendation engine, natural language quick-add parser, and date utilities.
- **`packages/validation`**: Zod schemas validating API payloads, mutations, and local database entries.
- **`packages/api-client`**: Typed fetch wrapper handling auth headers, base URLs, and typed error responses.
- **`packages/design-tokens`**: Shared dark-notebook design tokens (colors, spacing, radius, typography).

### 3. Backend Service (`backend/`)
- **FastAPI**: REST API with OpenAPI documentation, request ID tracking, and standardized FelisException handling.
- **SQLAlchemy 2.x**: Relational schema with User, Project, Task, and FocusSession models.
- **Alembic**: Database migrations managing schema evolution.
