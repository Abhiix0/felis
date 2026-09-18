# FELIS Implementation Prompts
## Two-Engineer Division | Phases 0–8

---

## HOW TO USE THIS DOCUMENT

Each prompt is **self-contained** — it includes the full repo context needed to execute it without looking elsewhere.

**Engineer A (Mobile + Core)** owns:
- The existing Expo mobile app
- Shared packages (`types`, `core`, `validation`, `api-client`, `design-tokens`)
- Mobile-to-backend integration
- Mobile-first features

**Engineer B (Backend + Desktop)** owns:
- FastAPI backend
- PostgreSQL / migrations
- Desktop Vite + Tauri app
- Sync architecture

**Synchronization points** (both engineers must coordinate before continuing):
- After Phase 2 (monorepo structure must be agreed before either continues)
- After Phase 3 (shared package APIs must be stable before backend or mobile consume them)
- After Phase 5 (auth + domain API contract must be agreed before Phase 6/8)

**Within each phase, work is parallel.**

---

## REPO AUDIT (run before anything)

```
Repo: https://github.com/Abhiix0/felis

Root layout:
felis/
├── expo-app/                  ← CURRENT MOBILE SOURCE OF TRUTH
│   ├── app/                   ← Expo Router screens
│   │   ├── (tabs)/            ← index.tsx, projects.tsx, radar.tsx, profile.tsx
│   │   ├── _layout.tsx        ← root stack
│   │   ├── add-task.tsx
│   │   ├── tasks.tsx
│   │   ├── focus/[taskId].tsx
│   │   ├── modal/recommendation.tsx
│   │   └── project/[id].tsx
│   ├── src/
│   │   ├── components/        ← CatIllustration, FocusTimer, SignalRail, ProgressBar, ui/*
│   │   ├── context/           ← AppContext.tsx (all state), DrawerContext.tsx
│   │   ├── domain/            ← recommendation.ts, taskParsing.ts
│   │   ├── storage/           ← persistence.ts (AsyncStorage)
│   │   ├── theme/             ← tokens.ts (colors, spacing, radius, typography)
│   │   ├── types.ts           ← Project, Task, Recommendation interfaces
│   │   └── utils/             ← haptics.ts
│   ├── assets/Reactions/      ← 20 cat PNG emotion images
│   ├── package.json           ← expo 57, react-native 0.86, npm
│   └── tsconfig.json
│
├── src/                       ← ROOT VITE APP (design prototype only)
│   ├── App.tsx                ← screen switcher, not a real app
│   ├── components/screens/    ← Screen01..10 wireframes
│   ├── context/AppContext.tsx ← prototype context (different from mobile)
│   ├── services/mockData.ts   ← hardcoded demo data
│   ├── types/index.ts
│   └── theme/tokens.ts
├── index.html
├── vite.config.ts
├── package.json               ← Vite + Tailwind + @google/genai, bun lockfile
└── bun.lock                   ← ROOT USES BUN, mobile uses npm (conflict!)

KNOWN BUGS (documented in PRD):
1. createTask() always sets projectId: 'proj-spawn' regardless of selected project
2. Project stats (totalTasks, activeTasks, progressPercent) are stored, not derived
3. Add-task UI says "AI understands it." — it's a deterministic rule parser
4. focusSession initializes with a hardcoded running session (not null)
5. Home screen shows hardcoded "THURSDAY, 17 SEPTEMBER" date
6. Home shows tasks.slice(0,4) as "today" instead of real date filtering
7. Greeting hardcodes "Abhi" — no auth system
8. focusSession.actualMinutes is hardcoded to 41
9. startFocus() injects fake subtasks: 'Login tests', 'Token validation', 'Error cases'
10. recommendation.ts says "Matches your ~{n}m focus window" — not grounded in history
11. expo-app README mentions outdated SDK/branding
12. Root package.json uses bun.lock; expo-app uses package-lock.json — incompatible
```

---

---

# PHASE 0 — AUDIT & BASELINE
## Both Engineers | ~2 hours | No code changes yet

**Run in expo-app/ and document results before touching anything.**

---

### PROMPT 0-A (Engineer A): Mobile Baseline Audit

```
You are working on the FELIS repository at https://github.com/Abhiix0/felis

Your ONLY job in this prompt is to AUDIT and DOCUMENT. Do not change any code.

CONTEXT:
The expo-app/ directory is the current mobile source of truth.
It uses Expo 57, React Native 0.86.3, Expo Router, npm.
The root directory has a separate Vite prototype app with a bun.lock file.

TASKS:

1. cd into expo-app/ and run:
   npx tsc --noEmit
   Document every TypeScript error found.

2. List every file in expo-app/src/ with a one-line summary of what it does.

3. For each screen in expo-app/app/, document:
   - What state it reads from AppContext
   - What mutations it calls
   - Any hardcoded values you find

4. Document all hardcoded values in AppContext.tsx:
   - The INITIAL_PROJECTS array (3 projects: proj-spawn, proj-ucdp, proj-preflight)
   - The INITIAL_TASKS array (4 tasks — note fake subtasks on task-auth-tests)
   - The focusSession initial state (hardcoded running session with actualMinutes: 41)
   - Hardcoded "Abhi" greeting in index.tsx
   - Hardcoded date "THURSDAY, 17 SEPTEMBER" in index.tsx
   - tasks.slice(0,4) used as "today" in index.tsx
   - projectId: 'proj-spawn' hardcoded in createTask()
   - reasonBullets includes "Matches your ~{n}m focus window" not grounded in any history

5. List every file in expo-app/ that is dead code or unused.

6. Document what domain/recommendation.ts actually does (it's a pure deterministic scorer —
   NOT AI). Record the exact scoring logic:
   - getDueDateScore(): string-match based, returns 0-10
   - getPriorityScore(): high=3, medium=2, low=1
   - computeNextAction(): sorts by priority desc, dueDate asc, estimatedMinutes asc

7. Document what domain/taskParsing.ts does:
   - Pure rule-based regex parser
   - Extracts: project name (by matching existing projects), priority (!high/!low/!medium),
     duration (30m / 1h / ~45m), due date (today/tomorrow/weekday names)
   - Returns: { title, projectName?, priority?, dueLabel?, estimatedMinutes? }

8. List every dependency in expo-app/package.json and note if any seem unused.

9. Create docs/implementation-status.md at the REPO ROOT with this content:

# FELIS Implementation Status

## Phase 0 — Audit
✅ Mobile audit complete

## Phase 1 — Bug Fixes
❌ project/task ID mismatch
❌ demo focus state initialization
❌ hardcoded user
❌ hardcoded date
❌ fake today calculation
❌ hardcoded focus actualMinutes
❌ fake subtasks in startFocus()
❌ stale project metrics
❌ misleading "AI" wording
❌ stale documentation

## Phase 2 — Monorepo
❌ npm workspaces root
❌ apps/mobile (moved from expo-app/)
❌ apps/desktop (scaffold)
❌ packages/types
❌ packages/core
❌ packages/validation
❌ packages/api-client
❌ packages/design-tokens
❌ backend/ scaffold

## Phase 3 — Shared Core
❌ packages/types domain models
❌ packages/core recommendation engine
❌ packages/core task parser
❌ packages/core date utilities
❌ packages/validation schemas
❌ packages/design-tokens
❌ packages/api-client

## Phase 4 — Backend Foundation
❌ FastAPI app
❌ PostgreSQL + SQLAlchemy
❌ Alembic migrations
❌ Health endpoint
❌ Error contract
❌ Request IDs

## Phase 5 — Auth + Domain
❌ Auth abstraction layer
❌ User / Profile CRUD
❌ Project CRUD
❌ Task CRUD
❌ Ownership enforcement

## Phase 6 — Mobile Real Data
❌ SQLite local storage
❌ Repository pattern (mobile)
❌ Backend sync
❌ Mutation queue
❌ Offline-first behavior

## Phase 7 — Core FELIS Loop
❌ End-to-end: login → project → task → recommend → focus → complete → sync

## Phase 8 — Desktop Foundation
❌ apps/desktop Vite scaffold
❌ Tauri integration
❌ Login / Home / Projects / Tasks / Focus
❌ Desktop sync

OUTPUT: docs/implementation-status.md committed to the repo.
Do not change any source code in this phase.
```

---

### PROMPT 0-B (Engineer B): Backend & Infrastructure Audit

```
You are working on the FELIS repository at https://github.com/Abhiix0/felis

Your ONLY job in this prompt is to AUDIT infrastructure concerns. Do not change code.

CONTEXT:
- expo-app/ = mobile app (npm, Expo 57)
- root/ = Vite prototype (bun, not a real product — just design previews)
- There is NO backend yet
- There is NO authentication yet
- There is NO database yet

TASKS:

1. Check root package.json vs expo-app/package.json:
   - Root uses bun.lock, expo-app uses package-lock.json
   - These cannot coexist cleanly as workspaces — document this conflict
   - Recommended resolution: convert root to npm workspaces, delete bun.lock

2. List the Vite root app's current screens (Screen01–Screen10 in src/components/screens/):
   - These are DESIGN WIREFRAMES, not a real app
   - They use a different AppContext than the mobile app
   - src/services/mockData.ts has completely hardcoded data
   - src/App.tsx renders a phone frame device preview for design review
   - Recommend: repurpose the Vite app as apps/desktop (not throw it away)

3. List reusable visual assets from the root Vite app:
   - src/theme/tokens.ts — same color palette as mobile (can become packages/design-tokens)
   - src/components/cat/CatIllustration.tsx — SVG cat (reusable for desktop)
   - Screen07FocusSession, Screen08RecommendationModal — desktop UI inspiration
   - src/components/ui/* — Buttons, ProgressBar, TaskRow, ProjectCard, SignalRail, etc.

4. Evaluate database options for the backend:
   - PostgreSQL is specified in the PRD
   - SQLAlchemy 2.x + Alembic for migrations
   - Recommend a dev Docker Compose setup

5. Evaluate auth options:
   - PRD says: use managed auth, abstract provider
   - Do not implement OAuth from scratch
   - Evaluate: Supabase Auth, Clerk, Auth0, or a simple JWT dev adapter
   - Recommended approach: build an AuthAdapter interface, implement a
     DevJWTAdapter for development that accepts email/password and issues signed JWTs
     without an external provider dependency

6. Design the proposed monorepo structure (document only, don't implement):

felis/
├── apps/
│   ├── mobile/          ← moved from expo-app/
│   └── desktop/         ← new, from root Vite repurposed
├── packages/
│   ├── types/           ← domain models
│   ├── core/            ← recommendation engine, task parser, date utils
│   ├── validation/      ← Zod schemas
│   ├── api-client/      ← typed fetch wrapper
│   └── design-tokens/   ← colors, spacing, typography
├── backend/
│   ├── app/             ← FastAPI entry, config, middleware
│   ├── domain/          ← services
│   ├── api/             ← routes
│   ├── agent/           ← LLM tool layer (stub for now)
│   ├── db/              ← SQLAlchemy models
│   ├── migrations/      ← Alembic
│   └── tests/
├── docs/
├── .github/workflows/
├── .env.example
├── package.json         ← npm workspaces root
└── README.md

7. Write a Docker Compose spec (docs/docker-compose-plan.md) for local dev:
   - postgres:16 container
   - POSTGRES_DB=felis, POSTGRES_USER=felis, POSTGRES_PASSWORD=felis_dev
   - port 5432:5432
   - volume for persistence

8. Write the proposed .env.example content:
# Backend
DATABASE_URL=postgresql://felis:felis_dev@localhost:5432/felis
SECRET_KEY=change-me-in-production
AUTH_PROVIDER=dev_jwt          # dev_jwt | supabase | clerk
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=30

# API
BACKEND_URL=http://localhost:8000

# Mobile (Expo)
EXPO_PUBLIC_API_URL=http://localhost:8000

# Desktop
VITE_API_URL=http://localhost:8000

OUTPUT: Deliver your findings as a written document. No code changes.
```

---

---

# PHASE 1 — BUG FIXES
## Engineer A owns all of Phase 1 | Engineer B continues infrastructure planning

**Work in expo-app/ (the existing mobile app). Do not reorganize files yet.**
**All bugs must be fixed before the monorepo migration.**

---

### PROMPT 1-A: Fix projectId Bug in createTask()

```
Repository: https://github.com/Abhiix0/felis
Working directory: expo-app/

CONTEXT:
File: expo-app/src/context/AppContext.tsx
Function: createTask()

CURRENT BROKEN CODE:
  const createTask = (
    title: string,
    projectName: string,
    priority: 'low' | 'medium' | 'high',
    due: string,
    estMin: number
  ) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      projectId: 'proj-spawn',          // ← BUG: always hardcoded
      projectName: projectName || 'Spawn', // ← only display name used
      ...
    };
  };

Also in: expo-app/app/add-task.tsx
  const effectiveProject = manualProject || parsed.projectName || projects[0]?.name || 'Spawn';
  // ← effectiveProject is a NAME, but createTask() needs an ID

TASK:
1. Change createTask() signature from (projectName: string) to (projectId: string)
   - Resolve the project ID from the projects array internally using the name
   - If the name doesn't match any project, use projects[0].id as fallback
   - Never fall back to the hardcoded string 'proj-spawn'

2. Update createTask() to correctly set both projectId and projectName:
  const createTask = (
    title: string,
    projectId: string,           // ← now takes ID
    priority: 'low' | 'medium' | 'high',
    due: string,
    estMin: number
  ) => {
    const project = projects.find(p => p.id === projectId) || projects[0];
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      projectId: project.id,        // ← correct
      projectName: project.name,    // ← derived from actual project
      ...
    };
  };

3. Update expo-app/app/add-task.tsx:
   - Change effectiveProject to track a projectId instead of a projectName
   - Show the project name in the UI (derived from the project object)
   - Pass the projectId to createTask()

   Current UI selection pattern in add-task.tsx uses:
     const [manualProject, setManualProject] = useState<string | null>(null);
   Change to:
     const [manualProjectId, setManualProjectId] = useState<string | null>(null);

   Derive name for display:
     const effectiveProjectId = manualProjectId
       || projects.find(p => p.name === parsed.projectName)?.id
       || projects[0]?.id;
     const effectiveProjectName = projects.find(p => p.id === effectiveProjectId)?.name || '';

4. Update AppContextType interface to reflect new signature.

5. Run: cd expo-app && npx tsc --noEmit
   Fix all TypeScript errors.

DO NOT change any other behavior.
DO NOT change file organization.
Commit message: "fix(mobile): resolve projectId from project list in createTask()"
```

---

### PROMPT 1-B: Fix Project Statistics (Derive, Don't Store)

```
Repository: https://github.com/Abhiix0/felis
Working directory: expo-app/

CONTEXT:
Current Project interface stores derived stats:
  interface Project {
    totalTasks: number;       ← stale if tasks change
    activeTasks: number;      ← stale
    progressPercent: number;  ← stale
  }

These fields become wrong the moment a task is added or completed.
They should be COMPUTED from the tasks array, not stored.

TASK:

1. Remove totalTasks, activeTasks, progressPercent from the Project interface
   in expo-app/src/types.ts

2. Create a selector function in expo-app/src/domain/projectSelectors.ts:
   import type { Project, Task } from '../types';

   export interface ProjectStats {
     totalTasks: number;
     activeTasks: number;
     completedTasks: number;
     progressPercent: number;
   }

   export function getProjectStats(projectId: string, tasks: Task[]): ProjectStats {
     const projectTasks = tasks.filter(t => t.projectId === projectId);
     const completedTasks = projectTasks.filter(t => t.completed).length;
     const totalTasks = projectTasks.length;
     const activeTasks = totalTasks - completedTasks;
     const progressPercent = totalTasks === 0
       ? 0
       : Math.round((completedTasks / totalTasks) * 100);
     return { totalTasks, activeTasks, completedTasks, progressPercent };
   }

3. Update INITIAL_PROJECTS in AppContext.tsx — remove the 3 stale fields:
   {
     id: 'proj-spawn',
     name: 'Spawn',
     iconType: 'terminal',
     description: 'Developer CLI',
     stack: ['Python', 'CLI', 'Backend'],
     // totalTasks, activeTasks, progressPercent REMOVED
   }

4. Update createProject() to no longer set those fields.

5. In expo-app/app/(tabs)/projects.tsx:
   - Import getProjectStats
   - Use tasks from useApp()
   - For each project card, compute stats on render:
     const stats = getProjectStats(project.id, tasks);

6. In expo-app/app/project/[id].tsx:
   - Same pattern — derive stats from tasks
   - Replace project.totalTasks with stats.totalTasks, etc.

7. Update ProgressBar usage everywhere to use computed stats.

8. Run: cd expo-app && npx tsc --noEmit
   Fix all TypeScript errors.

Commit message: "fix(mobile): derive project stats from tasks instead of storing them"
```

---

### PROMPT 1-C: Fix Focus Session Initialization + actualMinutes

```
Repository: https://github.com/Abhiix0/felis
Working directory: expo-app/

CONTEXT:
In expo-app/src/context/AppContext.tsx, focusSession is initialized with a
HARDCODED RUNNING SESSION instead of null:

  const [focusSession, setFocusSession] = useState<FocusSessionState | null>({
    taskId: 'task-auth-tests',
    taskTitle: 'Finish authentication tests',
    projectName: 'Spawn',
    totalSeconds: 27 * 60 + 42,
    remainingSeconds: 27 * 60 + 42,
    isRunning: true,              ← hardcoded running
    isFinished: false,
    subtasks: [                   ← fake subtasks injected here
      { id: 'sub-1', title: 'Login tests', completed: false },
      { id: 'sub-2', title: 'Token validation', completed: false },
      { id: 'sub-3', title: 'Error cases', completed: false },
    ],
    estimatedMinutes: 35,
    actualMinutes: 41,            ← hardcoded, not calculated
  });

Also in startFocus(), actualMinutes is hardcoded AND fake subtasks are injected:
  subtasks: target.subtasks || [
    { id: 'sub-1', title: 'Login tests', completed: false },  ← wrong
    { id: 'sub-2', title: 'Token validation', completed: false },
    { id: 'sub-3', title: 'Error cases', completed: false },
  ],
  actualMinutes: 41,   ← wrong

TASK:

1. Change focusSession initial state to null:
   const [focusSession, setFocusSession] = useState<FocusSessionState | null>(null);

2. Add startedAt: number (Unix timestamp ms) to FocusSessionState:
   interface FocusSessionState {
     taskId: string;
     taskTitle: string;
     projectName: string;
     totalSeconds: number;
     remainingSeconds: number;
     isRunning: boolean;
     isFinished: boolean;
     subtasks: { id: string; title: string; completed: boolean }[];
     estimatedMinutes: number;
     startedAt: number;           ← ADD THIS
     pausedTotalSeconds: number;  ← ADD THIS (track cumulative paused time)
   }
   Remove actualMinutes from the interface (derive it on read).

3. Add a pure helper to compute actual duration:
   export function computeActualMinutes(session: FocusSessionState): number {
     const elapsedMs = Date.now() - session.startedAt;
     const elapsedSeconds = Math.floor(elapsedMs / 1000);
     const activeSeconds = elapsedSeconds - session.pausedTotalSeconds;
     return Math.max(1, Math.round(activeSeconds / 60));
   }

4. Update startFocus() to:
   - Set startedAt: Date.now()
   - Set pausedTotalSeconds: 0
   - Use target.subtasks || [] (empty array, NOT fake subtasks)
   - Remove actualMinutes field

5. Update pauseFocus() to record pause start time:
   - Add pauseStartedAt?: number to the session state
   - On pause: set pauseStartedAt: Date.now()

6. Update resumeFocus() to accumulate paused duration:
   - Add elapsed pause time to pausedTotalSeconds
   - Clear pauseStartedAt

7. Update finishFocus() to call computeActualMinutes() before clearing session,
   and log it (will be persisted in a later phase).

8. In expo-app/app/focus/[taskId].tsx, remove any reference to actualMinutes;
   display computed duration when session ends using computeActualMinutes().

9. Run: cd expo-app && npx tsc --noEmit — fix all errors.

Commit message: "fix(mobile): initialize focusSession to null, compute actual duration"
```

---

### PROMPT 1-D: Fix Hardcoded Date, User, and Today Tasks

```
Repository: https://github.com/Abhiix0/felis
Working directory: expo-app/

CONTEXT:
In expo-app/app/(tabs)/index.tsx:

  <Text style={styles.dateText}>THURSDAY, 17 SEPTEMBER</Text>   ← hardcoded

  <Text style={styles.greetingBold}>Abhi</Text>                 ← hardcoded user

  const todayTasks = tasks.slice(0, 4);   ← wrong: slicing ≠ "today's tasks"

Also, tasks have dueDate as a string label like:
  'Due tomorrow', 'Today', 'Due Friday', etc.
These are display strings — not real Date objects — so "today" filtering must
match these strings, not real calendar dates.

NOTE ON AUTH: There is no auth system yet. In this phase, display a neutral
fallback ("Developer" or just omit the name) until auth is implemented.

TASK:

1. Fix the date display in index.tsx:
   Create a utility: expo-app/src/utils/dateUtils.ts

   export function getTodayLabel(): string {
     const now = new Date();
     const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY',
                   'THURSDAY', 'FRIDAY', 'SATURDAY'];
     const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY',
                     'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER',
                     'NOVEMBER', 'DECEMBER'];
     return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
   }

   Replace the hardcoded date string with:
   import { getTodayLabel } from '../../src/utils/dateUtils';
   <Text style={styles.dateText}>{getTodayLabel()}</Text>

2. Remove hardcoded "Abhi" greeting:
   Replace:
     <Text style={styles.greetingBold}>Abhi</Text>
   With a neutral display while auth doesn't exist:
     <Text style={styles.greetingBold}>Developer</Text>
   Add a TODO comment: // TODO: Replace with authenticated user display name (Phase 5)

3. Fix today task filtering:
   Create a selector: expo-app/src/domain/taskSelectors.ts

   import type { Task } from '../types';

   /**
    * Returns tasks that are "today" — matches dueDate label strings
    * until real ISO date fields are implemented in Phase 5.
    * Returns all incomplete tasks + any completed today-labeled tasks.
    */
   export function getTodayTasks(tasks: Task[]): Task[] {
     const NOW_LABELS = ['today', 'due today', 'overdue'];
     return tasks.filter(t => {
       if (!t.dueDate) return false;
       const lower = t.dueDate.toLowerCase();
       return NOW_LABELS.some(label => lower.includes(label));
     });
   }

   /**
    * Returns incomplete tasks due today or overdue. Used for task count display.
    */
   export function getActiveTodayTasks(tasks: Task[]): Task[] {
     return getTodayTasks(tasks).filter(t => !t.completed);
   }

   In index.tsx:
   - Import getTodayTasks
   - Replace tasks.slice(0, 4) with getTodayTasks(tasks)
   - Update the count: "You have {getActiveTodayTasks(tasks).length} things to work on today."
   - If no today tasks: show all incomplete tasks (reasonable fallback)

4. Remove "Based on your focus history" from any recommendation reasonBullets.
   In domain/recommendation.ts, change:
     reasonBullets.push(`Matches your ~${estMin}m focus window`);
   To:
     reasonBullets.push(`Estimated ${estMin} min`);

5. In expo-app/app/add-task.tsx, find any "AI understands it." text and replace with:
   "FELIS parsed this."

6. Run: cd expo-app && npx tsc --noEmit — fix all errors.

Commit message: "fix(mobile): real date display, neutral user, correct today filtering"
```

---

### PROMPT 1-E: Fix Documentation

```
Repository: https://github.com/Abhiix0/felis
Working directory: repo root + expo-app/

TASK:

1. Rewrite expo-app/README.md to accurately reflect the current state:

---
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
cd expo-app
npm install
npx expo start

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
---

2. Rewrite the root README.md:

---
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
cd expo-app
npm install
npx expo start

## Documentation
- docs/architecture.md — System architecture
- docs/implementation-status.md — Feature status
- docs/local-development.md — Full dev setup guide (coming in Phase 2)
---

3. Create docs/architecture.md with the target architecture diagram and explanation.

4. Update docs/implementation-status.md — mark Phase 1 bugs as fixed:
   ✅ project/task ID mismatch (Phase 1-A)
   ✅ project stats derived (Phase 1-B)
   ✅ focus session initialization (Phase 1-C)
   ✅ hardcoded user / date / today filtering (Phase 1-D)
   ✅ misleading "AI" wording (Phase 1-D)
   ✅ documentation updated (Phase 1-E)

Commit message: "docs: update READMEs and implementation status after Phase 1 fixes"
```

---

---

# PHASE 2 — MONOREPO MIGRATION
## Both Engineers | Coordinate before starting

**SYNCHRONIZATION POINT: Agree on final folder names before either engineer runs git mv.**

Engineer A: Moves mobile app, creates packages scaffold.
Engineer B: Creates backend scaffold, desktop scaffold, CI workflow.

---

### PROMPT 2-A (Engineer A): Create npm Workspaces + Move Mobile App

```
Repository: https://github.com/Abhiix0/felis

CONTEXT:
- expo-app/ = mobile source of truth
- root package.json currently has bun.lock — must be converted to npm workspaces
- Root Vite app is a design prototype — leave it in place for now (Engineer B will handle)

PRE-REQUISITES: Phase 1 bugs must be fixed first.

TASK:

1. Delete bun.lock from the repo root.

2. Replace the root package.json with an npm workspaces configuration:
{
  "name": "felis",
  "private": true,
  "version": "0.0.0",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:mobile": "npm run start --workspace=apps/mobile",
    "dev:desktop": "npm run dev --workspace=apps/desktop",
    "dev:backend": "cd backend && uvicorn app.main:app --reload --port 8000",
    "test": "npm run test --workspaces --if-present",
    "typecheck": "npm run typecheck --workspaces --if-present",
    "lint": "npm run lint --workspaces --if-present",
    "build": "npm run build --workspaces --if-present"
  },
  "devDependencies": {
    "typescript": "~5.5.0"
  }
}

3. Create the apps/ directory structure:
mkdir -p apps/mobile
mkdir -p apps/desktop

4. Move the expo-app/ contents to apps/mobile/ using git mv:
   git mv expo-app/app apps/mobile/app
   git mv expo-app/src apps/mobile/src
   git mv expo-app/assets apps/mobile/assets
   git mv expo-app/babel.config.js apps/mobile/babel.config.js
   git mv expo-app/tsconfig.json apps/mobile/tsconfig.json
   git mv expo-app/app.json apps/mobile/app.json
   git mv expo-app/package.json apps/mobile/package.json
   git mv expo-app/package-lock.json apps/mobile/package-lock.json
   git mv expo-app/README.md apps/mobile/README.md

5. Update apps/mobile/package.json — add "name": "@felis/mobile"

6. Create the packages/ directory scaffold:
   mkdir -p packages/types/src
   mkdir -p packages/core/src
   mkdir -p packages/validation/src
   mkdir -p packages/api-client/src
   mkdir -p packages/design-tokens/src

   Create a minimal package.json in each:

   packages/types/package.json:
   {
     "name": "@felis/types",
     "version": "0.0.1",
     "private": true,
     "main": "src/index.ts",
     "types": "src/index.ts"
   }

   (repeat pattern for core, validation, api-client, design-tokens)

   Create an empty src/index.ts in each package:
   // @felis/types — domain models (populated in Phase 3)
   export {};

7. Verify mobile still works:
   cd apps/mobile && npm install && npx expo start --no-dev --non-interactive
   (or just run npx tsc --noEmit to check TypeScript)

8. Update apps/mobile internal imports if any paths broke during git mv.
   Common issue: relative imports like '../../src/context/AppContext' may need
   checking after the move. Run npx tsc --noEmit and fix any path errors.

9. Update docs/implementation-status.md:
   ✅ npm workspaces root
   ✅ apps/mobile (moved from expo-app/)
   🟡 apps/desktop (scaffold, not yet functional)
   🟡 packages (scaffolded, empty)

Commit message: "feat(monorepo): npm workspaces, move expo-app to apps/mobile"
```

---

### PROMPT 2-B (Engineer B): Backend Scaffold + Desktop Scaffold + CI

```
Repository: https://github.com/Abhiix0/felis

CONTEXT:
- Engineer A is creating the npm workspace and moving the mobile app
- You are setting up the backend and desktop scaffolds in parallel
- Both will be committed together after coordination

TASK — PART 1: Backend Scaffold

1. Create the backend directory structure:
backend/
├── app/
│   ├── __init__.py
│   ├── main.py          ← FastAPI app entry
│   ├── config.py        ← settings from environment
│   └── middleware.py    ← request ID injection, CORS
├── domain/
│   └── __init__.py
├── api/
│   ├── __init__.py
│   └── health.py        ← GET /health
├── db/
│   ├── __init__.py
│   └── session.py       ← SQLAlchemy session factory
├── migrations/          ← Alembic will live here
├── tests/
│   ├── __init__.py
│   └── test_health.py
├── requirements.txt
├── requirements-dev.txt
├── alembic.ini
├── .env.example
└── README.md

2. requirements.txt:
fastapi==0.115.0
uvicorn[standard]==0.34.0
sqlalchemy==2.0.36
alembic==1.14.0
pydantic==2.10.0
pydantic-settings==2.7.0
psycopg2-binary==2.9.10
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.20
httpx==0.28.0

requirements-dev.txt:
pytest==8.3.4
pytest-asyncio==0.24.0
httpx==0.28.0
black==24.10.0
ruff==0.8.0

3. backend/app/main.py:
import uuid
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.health import router as health_router
from app.config import settings

app = FastAPI(
    title="FELIS API",
    version="0.1.0",
    description="FELIS — Personal Execution OS API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response

app.include_router(health_router)

4. backend/app/config.py:
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://felis:felis_dev@localhost:5432/felis"
    SECRET_KEY: str = "change-me-in-production"
    AUTH_PROVIDER: str = "dev_jwt"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "tauri://localhost"]
    DEBUG: bool = False

    class Config:
        env_file = ".env"

settings = Settings()

5. backend/api/health.py:
from fastapi import APIRouter, Request
from pydantic import BaseModel

router = APIRouter()

class HealthResponse(BaseModel):
    status: str
    version: str
    request_id: str

@router.get("/health", response_model=HealthResponse)
async def health(request: Request):
    return HealthResponse(
        status="ok",
        version="0.1.0",
        request_id=getattr(request.state, "request_id", "unknown")
    )

6. backend/db/session.py:
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.config import settings

DATABASE_URL = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(DATABASE_URL, echo=settings.DEBUG)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session

7. backend/tests/test_health.py:
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "request_id" in data

8. Create docker-compose.yml at repo root:
version: '3.9'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: felis
      POSTGRES_USER: felis
      POSTGRES_PASSWORD: felis_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:

TASK — PART 2: Desktop Scaffold

9. Create apps/desktop/ by copying useful parts of the root Vite app:
   - Copy src/theme/tokens.ts → apps/desktop/src/theme/tokens.ts
   - Copy src/components/cat/CatIllustration.tsx → apps/desktop/src/components/
   - Create a new apps/desktop/package.json:
{
  "name": "@felis/desktop",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --port 5173",
    "build": "vite build",
    "typecheck": "tsc --noEmit",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.383.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "~5.5.0",
    "vite": "^5.0.0"
  }
}

10. Create apps/desktop/src/App.tsx (minimal placeholder):
import React from 'react';

export default function App() {
  return (
    <div style={{ background: '#0D0D0C', color: '#F1EFE8', minHeight: '100vh',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'monospace' }}>
      <div>
        <h1 style={{ color: '#F06A3A', fontSize: 24 }}>FELIS Desktop</h1>
        <p style={{ color: '#A09E97' }}>Coming in Phase 8</p>
      </div>
    </div>
  );
}

11. Create apps/desktop/index.html, vite.config.ts, tsconfig.json.

TASK — PART 3: GitHub Actions CI

12. Create .github/workflows/ci.yml:
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  mobile-checks:
    name: Mobile TypeScript Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: apps/mobile/package-lock.json
      - run: cd apps/mobile && npm ci
      - run: cd apps/mobile && npx tsc --noEmit

  backend-tests:
    name: Backend Tests
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: felis_test
          POSTGRES_USER: felis
          POSTGRES_PASSWORD: felis_dev
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: cd backend && pip install -r requirements.txt -r requirements-dev.txt
      - run: cd backend && pytest tests/ -v
        env:
          DATABASE_URL: postgresql://felis:felis_dev@localhost:5432/felis_test

  desktop-build:
    name: Desktop TypeScript Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd apps/desktop && npm install && npm run typecheck

13. Update docs/implementation-status.md:
   ✅ backend/ scaffold (FastAPI, health endpoint, config, request IDs)
   ✅ apps/desktop scaffold (Vite placeholder)
   ✅ CI (GitHub Actions)
   ✅ docker-compose.yml

Commit message: "feat(infra): backend FastAPI scaffold, desktop placeholder, CI pipeline"
```

---

---

# PHASE 3 — SHARED PACKAGES
## Engineer A owns packages/types + packages/core + packages/design-tokens
## Engineer B owns packages/validation + packages/api-client

---

### PROMPT 3-A (Engineer A): packages/types — Domain Models

```
Repository: https://github.com/Abhiix0/felis
Working directory: packages/types/

CONTEXT:
The current mobile app has types in apps/mobile/src/types.ts.
These need to be extracted into a shared package that works in:
- apps/mobile (React Native / Expo)
- apps/desktop (Vite / browser)
- backend (Python — we generate matching Pydantic models separately)

The shared types package must have ZERO dependencies on:
- React Native
- Expo
- Browser-only APIs
- Node-only APIs

CURRENT MOBILE TYPES (from apps/mobile/src/types.ts):
  interface Project {
    id: string;
    name: string;
    iconType: 'terminal' | 'database' | 'cloud' | 'file';
    description: string;
    stack: string[];
    // totalTasks, activeTasks, progressPercent REMOVED in Phase 1-B
  }

  interface Task {
    id: string;
    title: string;
    projectId: string;
    projectName: string;
    completed: boolean;
    scheduledTime?: string;
    dueDate?: string;
    estimatedMinutes?: number;
    priority?: 'low' | 'medium' | 'high';
    completedAt?: string;
    subtasks?: { id: string; title: string; completed: boolean }[];
  }

  interface Recommendation {
    taskId: string;
    title: string;
    projectId: string;
    projectName: string;
    dueDateLabel: string;
    estimatedMinutes: number;
    priority: 'low' | 'medium' | 'high';
    reasonBullets: string[];
  }

TASK:

Create packages/types/src/index.ts with these models.
Upgrade them to be production-quality as described below.

1. Core enums:
export type Priority = 'low' | 'medium' | 'high';
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type FocusSessionStatus = 'running' | 'paused' | 'finished' | 'abandoned';
export type SyncStatus = 'synced' | 'pending' | 'failed' | 'conflict';
export type MemoryType = 'explicit' | 'inferred';
export type MemoryStatus = 'active' | 'deleted';
export type IconType = 'terminal' | 'database' | 'cloud' | 'file';

2. User:
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: string; // ISO 8601
  updatedAt: string;
}

export interface Profile {
  userId: string;
  timezone: string;
  preferredFocusMinutes: number; // default: 25
  workStartHour: number;         // 0-23, default: 9
  workEndHour: number;           // 0-23, default: 18
}

3. Project:
export interface Project {
  id: string;
  userId: string;
  name: string;
  goal?: string;
  description?: string;
  techStack: string[];
  iconType: IconType;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

4. Subtask:
export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  position: number;
}

5. TaskRecurrence:
export interface TaskRecurrence {
  id: string;
  taskId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number; // every N days/weeks/months
  endsAt?: string;
}

6. Task:
export interface Task {
  id: string;
  userId: string;
  projectId?: string;   // nullable — standalone tasks allowed
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string;     // ISO 8601 date YYYY-MM-DD
  dueTime?: string;     // HH:MM (24h)
  estimateMinutes?: number;
  recurrenceId?: string;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  // Display helpers (client-only, derived from projectId lookup)
  projectName?: string;
}

7. FocusSession:
export interface FocusSession {
  id: string;
  userId: string;
  taskId: string;
  plannedMinutes: number;
  startedAt: string;    // ISO 8601
  endedAt?: string;
  actualMinutes?: number;
  status: FocusSessionStatus;
  pausedTotalSeconds: number;
}

8. RecommendationSignal:
export interface RecommendationSignal {
  type: 'urgency' | 'priority' | 'project_importance' | 'blocking_impact'
       | 'time_fit' | 'recency_context' | 'preference_fit';
  value: number;     // contribution to total score
  reason: string;    // human-readable explanation (deterministic, grounded)
}

export interface Recommendation {
  id: string;
  taskId: string;
  score: number;
  signals: RecommendationSignal[];
  createdAt: string;
  stateSnapshotVersion: string; // hash or timestamp of state used to compute
}

export interface RecommendationOutcome {
  recommendationId: string;
  event: 'shown' | 'accepted' | 'started' | 'dismissed' | 'completed' | 'corrected';
  recordedAt: string;
  correctedTaskId?: string; // if user chose a different task
}

9. Memory:
export interface Memory {
  id: string;
  userId: string;
  type: MemoryType;
  key: string;
  value: string;
  provenance: string;  // how this was created
  confidence: number;  // 0.0–1.0 (explicit=1.0, inferred starts lower)
  status: MemoryStatus;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
}

10. ActivityEvent:
export type ActivityEventType =
  | 'task_created' | 'task_completed' | 'task_reopened' | 'task_started'
  | 'focus_started' | 'focus_finished'
  | 'recommendation_shown' | 'recommendation_accepted' | 'recommendation_dismissed'
  | 'project_created';

export interface ActivityEvent {
  id: string;
  userId: string;
  type: ActivityEventType;
  entityId: string;       // task ID, project ID, etc.
  entityType: 'task' | 'project' | 'focus_session' | 'recommendation';
  metadata?: Record<string, unknown>;
  occurredAt: string;
}

11. SyncMutation:
export interface SyncMutation {
  clientMutationId: string;  // UUID, client-generated
  type: string;              // 'CREATE_TASK' | 'COMPLETE_TASK' | etc.
  payload: unknown;
  createdAt: string;
  status: SyncStatus;
  retryCount: number;
  lastAttemptAt?: string;
  error?: string;
}

12. Notification:
export interface Notification {
  id: string;
  userId: string;
  category: 'critical_deadline' | 'planned_work' | 'daily_briefing'
           | 'daily_review' | 'agent_suggestion';
  title: string;
  body: string;
  entityId?: string;
  scheduledFor?: string;
  sentAt?: string;
  dedupeKey: string;
}

export interface NotificationPreferences {
  userId: string;
  criticalDeadlinesEnabled: boolean;
  plannedWorkEnabled: boolean;
  dailyBriefingEnabled: boolean;
  dailyBriefingTime: string;  // HH:MM
  dailyReviewEnabled: boolean;
  dailyReviewTime: string;
  quietHoursStart?: string;   // HH:MM
  quietHoursEnd?: string;
}

13. AgentConversation:
export interface AgentMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: AgentToolCall[];
  createdAt: string;
}

export interface AgentToolCall {
  id: string;
  messageId: string;
  toolName: string;
  arguments: Record<string, unknown>;
  result?: unknown;
  status: 'pending' | 'success' | 'failed';
  executedAt?: string;
}

export interface AgentConversation {
  id: string;
  userId: string;
  messages: AgentMessage[];
  context?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

14. DailyReview:
export interface DailyReview {
  id: string;
  userId: string;
  date: string;           // YYYY-MM-DD
  tasksCompleted: number;
  tasksCarriedForward: number;
  plannedMinutes: number;
  actualMinutes: number;
  topCompletions: string[];  // task IDs
  tomorrowCandidates: string[]; // task IDs
  generatedAt: string;
}

15. TechRadarItem:
export interface TechRadarItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary?: string;
  topics: string[];
  relevanceScore?: number;
}

16. Update packages/types/package.json to be properly typed.

17. Update apps/mobile/src/types.ts to re-export from @felis/types:
    // Transitional: re-export shared types during monorepo migration
    export type { Project, Task, Recommendation, Priority } from '@felis/types';

    This is a TRANSITIONAL step. Apps will import directly from @felis/types in Phase 6.

Commit message: "feat(types): production domain models in packages/types"
```

---

### PROMPT 3-B (Engineer A): packages/core — Recommendation Engine + Parser

```
Repository: https://github.com/Abhiix0/felis
Working directory: packages/core/

CONTEXT:
The current mobile domain logic lives in:
  apps/mobile/src/domain/recommendation.ts
  apps/mobile/src/domain/taskParsing.ts
  apps/mobile/src/domain/projectSelectors.ts  (created in Phase 1-B)
  apps/mobile/src/domain/taskSelectors.ts     (created in Phase 1-D)

These must be moved to packages/core/ so that mobile, desktop, and backend
tests can all use the same deterministic logic.

CURRENT RECOMMENDATION SCORING (to preserve and upgrade):
  - getPriorityScore(): high=3, medium=2, low=1
  - getDueDateScore(): returns 0-10, lower = more urgent
  - Sort: priority desc → dueDate asc → estimatedMinutes asc → stable index
  - Returns Recommendation with reasonBullets

NEW SCORING MODEL (from PRD Section 14):
  Urgency: 25 points max
  Priority: 20 points max
  Project importance: 15 points max
  Blocking impact: 15 points max
  Time fit: 10 points max
  Recency/context: 10 points max
  Preference fit: 5 points max
  Total: 100 points

TASK:

1. Create packages/core/src/recommendation/weights.ts:
export const SCORING_WEIGHTS = {
  urgency: 25,
  priority: 20,
  projectImportance: 15,
  blockingImpact: 15,
  timeFit: 10,
  recencyContext: 10,
  preferenceFit: 5,
} as const;
// Note: weights are configuration, not scientific constants. Adjust over time.

2. Create packages/core/src/recommendation/signals.ts:
   Implement each signal scorer as a pure function.

   import type { Task, Project } from '@felis/types';
   import { SCORING_WEIGHTS } from './weights';

   export interface ScoringContext {
     tasks: Task[];
     projects: Project[];
     nowMs: number;           // Date.now() — inject for testability
     userPreferredMinutes?: number; // from Profile
   }

   export function scoreUrgency(task: Task, ctx: ScoringContext): number {
     // Returns 0 to SCORING_WEIGHTS.urgency
     // Based on dueDate ISO string proximity to ctx.nowMs
     if (!task.dueDate) return SCORING_WEIGHTS.urgency * 0.3;
     const dueMs = new Date(task.dueDate).getTime();
     const daysUntilDue = (dueMs - ctx.nowMs) / (1000 * 60 * 60 * 24);
     if (daysUntilDue < 0) return SCORING_WEIGHTS.urgency;      // overdue
     if (daysUntilDue < 1) return SCORING_WEIGHTS.urgency * 0.9; // today
     if (daysUntilDue < 2) return SCORING_WEIGHTS.urgency * 0.75; // tomorrow
     if (daysUntilDue < 4) return SCORING_WEIGHTS.urgency * 0.5;
     if (daysUntilDue < 7) return SCORING_WEIGHTS.urgency * 0.3;
     return SCORING_WEIGHTS.urgency * 0.1;
   }

   export function scorePriority(task: Task): number {
     // Returns 0 to SCORING_WEIGHTS.priority
     switch (task.priority) {
       case 'high':   return SCORING_WEIGHTS.priority;
       case 'medium': return SCORING_WEIGHTS.priority * 0.6;
       case 'low':    return SCORING_WEIGHTS.priority * 0.2;
       default:       return SCORING_WEIGHTS.priority * 0.4;
     }
   }

   export function scoreProjectImportance(task: Task, ctx: ScoringContext): number {
     // V1: active projects score higher than paused/completed
     // Future: use explicit project priority/goal weight
     if (!task.projectId) return SCORING_WEIGHTS.projectImportance * 0.3;
     const project = ctx.projects.find(p => p.id === task.projectId);
     if (!project) return SCORING_WEIGHTS.projectImportance * 0.2;
     if (project.status === 'active') return SCORING_WEIGHTS.projectImportance;
     if (project.status === 'paused') return SCORING_WEIGHTS.projectImportance * 0.3;
     return 0;
   }

   export function scoreBlockingImpact(task: Task, ctx: ScoringContext): number {
     // V1: stub — no blocking graph implemented yet
     // Returns 0 (will be upgraded when blocking relationships exist)
     return 0;
   }

   export function scoreTimeFit(task: Task, ctx: ScoringContext): number {
     // Returns higher score when task estimate fits user's preferred focus window
     const est = task.estimateMinutes ?? 30;
     const preferred = ctx.userPreferredMinutes ?? 25;
     const diff = Math.abs(est - preferred);
     if (diff <= 5)  return SCORING_WEIGHTS.timeFit;
     if (diff <= 15) return SCORING_WEIGHTS.timeFit * 0.7;
     if (diff <= 30) return SCORING_WEIGHTS.timeFit * 0.4;
     return SCORING_WEIGHTS.timeFit * 0.1;
   }

   export function scoreRecencyContext(task: Task, ctx: ScoringContext): number {
     // V1: tasks created recently get slight boost
     // Future: use activity events for "what was I working on?"
     const ageMs = ctx.nowMs - new Date(task.createdAt).getTime();
     const ageDays = ageMs / (1000 * 60 * 60 * 24);
     if (ageDays < 1)  return SCORING_WEIGHTS.recencyContext;
     if (ageDays < 3)  return SCORING_WEIGHTS.recencyContext * 0.6;
     if (ageDays < 7)  return SCORING_WEIGHTS.recencyContext * 0.3;
     return SCORING_WEIGHTS.recencyContext * 0.1;
   }

   export function scorePreferenceFit(task: Task, ctx: ScoringContext): number {
     // V1: stub — no memory/preference data yet
     return 0;
   }

3. Create packages/core/src/recommendation/engine.ts:
   import type { Task, Project, Recommendation, RecommendationSignal } from '@felis/types';
   import {
     scoreUrgency, scorePriority, scoreProjectImportance,
     scoreBlockingImpact, scoreTimeFit, scoreRecencyContext, scorePreferenceFit,
     ScoringContext
   } from './signals';

   export function computeNextAction(
     tasks: Task[],
     projects: Project[],
     ctx: Partial<ScoringContext> = {}
   ): Recommendation | null {
     const fullCtx: ScoringContext = {
       tasks,
       projects,
       nowMs: ctx.nowMs ?? Date.now(),
       userPreferredMinutes: ctx.userPreferredMinutes ?? 25,
     };

     const eligible = tasks.filter(t =>
       t.status !== 'completed' && t.status !== 'cancelled'
     );

     if (eligible.length === 0) return null;

     const scored = eligible.map(task => {
       const signals: RecommendationSignal[] = [
         {
           type: 'urgency',
           value: Math.round(scoreUrgency(task, fullCtx)),
           reason: buildUrgencyReason(task, fullCtx),
         },
         {
           type: 'priority',
           value: Math.round(scorePriority(task)),
           reason: buildPriorityReason(task),
         },
         {
           type: 'project_importance',
           value: Math.round(scoreProjectImportance(task, fullCtx)),
           reason: 'Active project',
         },
         {
           type: 'time_fit',
           value: Math.round(scoreTimeFit(task, fullCtx)),
           reason: `Estimated ${task.estimateMinutes ?? 30} min`,
         },
       ].filter(s => s.value > 0); // only include signals with nonzero contribution

       const totalScore = signals.reduce((sum, s) => sum + s.value, 0);
       return { task, signals, totalScore };
     });

     scored.sort((a, b) => b.totalScore - a.totalScore);

     const best = scored[0];
     const snapshotVersion = String(fullCtx.nowMs);

     return {
       id: `rec-${Date.now()}`,
       taskId: best.task.id,
       score: best.totalScore,
       signals: best.signals,
       createdAt: new Date(fullCtx.nowMs).toISOString(),
       stateSnapshotVersion: snapshotVersion,
     };
   }

   function buildUrgencyReason(task: Task, ctx: ScoringContext): string {
     if (!task.dueDate) return 'No due date set';
     const dueMs = new Date(task.dueDate).getTime();
     const daysUntilDue = (dueMs - ctx.nowMs) / (1000 * 60 * 60 * 24);
     if (daysUntilDue < 0) return 'Overdue';
     if (daysUntilDue < 1) return 'Due today';
     if (daysUntilDue < 2) return 'Due tomorrow';
     return `Due in ${Math.ceil(daysUntilDue)} days`;
   }

   function buildPriorityReason(task: Task): string {
     switch (task.priority) {
       case 'high':   return 'High priority';
       case 'medium': return 'Medium priority';
       case 'low':    return 'Low priority';
       default:       return 'Priority not set';
     }
   }

4. Move task parsing to packages/core/src/taskParsing/parser.ts:
   - Copy current content from apps/mobile/src/domain/taskParsing.ts
   - Upgrade: instead of matching project.name strings, accept an array of
     { id: string, name: string } and return projectId in the result
   - Update ParsedTaskInput:
     export interface ParsedTaskInput {
       title: string;
       projectId?: string;    // ← now returns ID not name
       projectName?: string;  // display only
       priority?: Priority;
       dueDate?: string;      // ISO YYYY-MM-DD when parseable, else undefined
       dueLabel?: string;     // human label: 'Today', 'Tomorrow', 'Friday'
       estimatedMinutes?: number;
       isUncertain?: boolean; // true if parser had to guess
     }

5. Create packages/core/src/dateUtils/index.ts:
   export function getTodayISO(): string {
     return new Date().toISOString().split('T')[0];
   }
   export function getTomorrowISO(): string {
     const d = new Date();
     d.setDate(d.getDate() + 1);
     return d.toISOString().split('T')[0];
   }
   export function isOverdue(dueDateISO: string, nowMs = Date.now()): boolean {
     return new Date(dueDateISO).getTime() < nowMs;
   }
   export function isDueToday(dueDateISO: string, nowMs = Date.now()): boolean {
     return dueDateISO === getTodayISO();
   }
   export function getDueDateLabel(dueDateISO: string, nowMs = Date.now()): string {
     const today = getTodayISO();
     const tomorrow = getTomorrowISO();
     if (dueDateISO < today) return 'Overdue';
     if (dueDateISO === today) return 'Today';
     if (dueDateISO === tomorrow) return 'Tomorrow';
     const d = new Date(dueDateISO);
     const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
     const diffDays = Math.ceil((d.getTime() - nowMs) / (1000 * 60 * 60 * 24));
     if (diffDays <= 7) return days[d.getDay()];
     return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
   }

6. Create packages/core/src/projectSelectors.ts (moved from mobile):
   (same content as created in Phase 1-B, but importing from @felis/types)

7. Create packages/core/src/taskSelectors.ts (moved from mobile):
   (same content as created in Phase 1-D, updated to use ISO dates)

8. Create packages/core/src/index.ts barrel:
   export { computeNextAction } from './recommendation/engine';
   export { parseQuickAddInput } from './taskParsing/parser';
   export { getProjectStats } from './projectSelectors';
   export { getTodayTasks, getActiveTodayTasks } from './taskSelectors';
   export * from './dateUtils';

9. Write tests in packages/core/src/__tests__/recommendation.test.ts:
   Test at minimum:
   - Empty tasks → null
   - One task → returned
   - High priority beats low priority
   - Overdue beats far-future due date
   - Equal scores → stable (first task wins)
   - Score components are grounded (no zero-division, all scores 0–100)

10. Update packages/core/package.json:
{
  "name": "@felis/core",
  "version": "0.0.1",
  "private": true,
  "main": "src/index.ts",
  "types": "src/index.ts",
  "dependencies": {
    "@felis/types": "*"
  },
  "devDependencies": {
    "vitest": "^2.0.0",
    "typescript": "~5.5.0"
  },
  "scripts": {
    "test": "vitest run",
    "typecheck": "tsc --noEmit"
  }
}

11. After completing packages/core:
    Update apps/mobile/src/domain/* to import from @felis/core instead of local files.
    This is a transitional step — mobile imports will be fully migrated in Phase 6.

Commit message: "feat(core): production recommendation engine + parser in packages/core"
```

---

### PROMPT 3-C (Engineer B): packages/validation + packages/api-client

```
Repository: https://github.com/Abhiix0/felis
Working directory: packages/validation/ and packages/api-client/

CONTEXT:
- packages/types is being built by Engineer A (import @felis/types when available)
- These two packages are consumed by both mobile and desktop clients
- The backend separately uses Pydantic for server-side validation

TASK — PART 1: packages/validation

1. Install Zod in packages/validation:
   packages/validation/package.json:
   {
     "name": "@felis/validation",
     "version": "0.0.1",
     "private": true,
     "main": "src/index.ts",
     "dependencies": {
       "zod": "^3.23.0",
       "@felis/types": "*"
     },
     "devDependencies": {
       "typescript": "~5.5.0"
     }
   }

2. Create packages/validation/src/project.ts:
   import { z } from 'zod';

   export const CreateProjectSchema = z.object({
     name: z.string().min(1).max(100),
     goal: z.string().max(500).optional(),
     description: z.string().max(1000).optional(),
     techStack: z.array(z.string().max(50)).max(20).default([]),
     iconType: z.enum(['terminal', 'database', 'cloud', 'file']).default('terminal'),
   });

   export const UpdateProjectSchema = CreateProjectSchema.partial();

   export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
   export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

3. Create packages/validation/src/task.ts:
   import { z } from 'zod';

   export const CreateTaskSchema = z.object({
     projectId: z.string().uuid().optional(),
     title: z.string().min(1).max(500),
     description: z.string().max(2000).optional(),
     priority: z.enum(['low', 'medium', 'high']).default('medium'),
     dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // YYYY-MM-DD
     dueTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),         // HH:MM
     estimateMinutes: z.number().int().min(1).max(480).optional(),
   });

   export const UpdateTaskSchema = CreateTaskSchema.partial();

   export const CompleteTaskSchema = z.object({
     completedAt: z.string().datetime().optional(),
   });

   export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
   export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

4. Create packages/validation/src/focusSession.ts:
   import { z } from 'zod';

   export const StartFocusSessionSchema = z.object({
     taskId: z.string().uuid(),
     plannedMinutes: z.number().int().min(1).max(480),
   });

   export const EndFocusSessionSchema = z.object({
     endedAt: z.string().datetime(),
     actualMinutes: z.number().int().min(1),
     status: z.enum(['finished', 'abandoned']),
   });

5. Create packages/validation/src/syncMutation.ts:
   import { z } from 'zod';

   export const SyncMutationSchema = z.object({
     clientMutationId: z.string().uuid(),
     type: z.enum([
       'CREATE_TASK', 'UPDATE_TASK', 'COMPLETE_TASK', 'DELETE_TASK',
       'CREATE_PROJECT', 'UPDATE_PROJECT', 'ARCHIVE_PROJECT',
       'START_FOCUS', 'END_FOCUS',
     ]),
     payload: z.unknown(),
     createdAt: z.string().datetime(),
   });

6. Create packages/validation/src/recommendation.ts:
   import { z } from 'zod';

   export const RecordOutcomeSchema = z.object({
     event: z.enum(['shown', 'accepted', 'started', 'dismissed', 'completed', 'corrected']),
     correctedTaskId: z.string().uuid().optional(),
     recordedAt: z.string().datetime(),
   });

7. Create packages/validation/src/index.ts barrel exporting all schemas.

TASK — PART 2: packages/api-client

8. packages/api-client/package.json:
   {
     "name": "@felis/api-client",
     "version": "0.0.1",
     "private": true,
     "main": "src/index.ts",
     "dependencies": {
       "@felis/types": "*",
       "@felis/validation": "*"
     },
     "devDependencies": {
       "typescript": "~5.5.0"
     }
   }

9. Create packages/api-client/src/client.ts:
   The API client must handle:
   - Base URL configuration
   - Auth token injection (Bearer)
   - Request IDs (X-Request-ID header, UUID)
   - Error normalization
   - Retry on network error (NOT on 4xx)
   - Auth refresh hook
   - Response parsing

   import { v4 as uuidv4 } from 'uuid';

   export interface FelisApiConfig {
     baseUrl: string;
     getAccessToken: () => string | null;
     onAuthError: () => void;  // called on 401, should trigger re-auth
     onTokenRefresh?: () => Promise<string | null>; // optional refresh
   }

   export interface ApiError {
     code: string;
     message: string;
     requestId: string;
   }

   export class FelisApiError extends Error {
     constructor(
       public readonly error: ApiError,
       public readonly statusCode: number
     ) {
       super(error.message);
       this.name = 'FelisApiError';
     }
   }

   export class FelisApiClient {
     constructor(private config: FelisApiConfig) {}

     async request<T>(
       method: string,
       path: string,
       options: {
         body?: unknown;
         clientMutationId?: string;
         retries?: number;
       } = {}
     ): Promise<T> {
       const requestId = uuidv4();
       const { retries = 2 } = options;

       const headers: Record<string, string> = {
         'Content-Type': 'application/json',
         'X-Request-ID': requestId,
       };

       const token = this.config.getAccessToken();
       if (token) {
         headers['Authorization'] = `Bearer ${token}`;
       }
       if (options.clientMutationId) {
         headers['X-Client-Mutation-ID'] = options.clientMutationId;
       }

       let lastError: Error | null = null;
       for (let attempt = 0; attempt <= retries; attempt++) {
         try {
           const response = await fetch(`${this.config.baseUrl}${path}`, {
             method,
             headers,
             body: options.body ? JSON.stringify(options.body) : undefined,
           });

           if (response.status === 401) {
             this.config.onAuthError();
             throw new FelisApiError(
               { code: 'UNAUTHORIZED', message: 'Session expired', requestId },
               401
             );
           }

           if (!response.ok) {
             const errorBody = await response.json().catch(() => ({}));
             throw new FelisApiError(
               {
                 code: errorBody?.error?.code || 'API_ERROR',
                 message: errorBody?.error?.message || 'Request failed',
                 requestId: errorBody?.error?.request_id || requestId,
               },
               response.status
             );
           }

           return response.json() as Promise<T>;
         } catch (err) {
           lastError = err as Error;
           // Only retry on network errors, not API errors
           if (err instanceof FelisApiError) throw err;
           if (attempt < retries) {
             await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 500));
           }
         }
       }
       throw lastError;
     }

     // Convenience methods
     get<T>(path: string) { return this.request<T>('GET', path); }
     post<T>(path: string, body: unknown, mutationId?: string) {
       return this.request<T>('POST', path, { body, clientMutationId: mutationId });
     }
     patch<T>(path: string, body: unknown) { return this.request<T>('PATCH', path, { body }); }
     delete<T>(path: string) { return this.request<T>('DELETE', path); }
   }

10. Create packages/api-client/src/endpoints.ts:
    Typed endpoint wrappers using the client. At minimum implement:

    import type { Project, Task, Recommendation, FocusSession } from '@felis/types';
    import type { CreateProjectInput, UpdateProjectInput } from '@felis/validation';
    import type { CreateTaskInput, UpdateTaskInput } from '@felis/validation';
    import { FelisApiClient } from './client';

    export class ProjectsApi {
      constructor(private client: FelisApiClient) {}
      list() { return this.client.get<Project[]>('/projects'); }
      create(input: CreateProjectInput) { return this.client.post<Project>('/projects', input); }
      get(id: string) { return this.client.get<Project>(`/projects/${id}`); }
      update(id: string, input: UpdateProjectInput) {
        return this.client.patch<Project>(`/projects/${id}`, input);
      }
      delete(id: string) { return this.client.delete<void>(`/projects/${id}`); }
    }

    export class TasksApi {
      constructor(private client: FelisApiClient) {}
      list(projectId?: string) {
        const query = projectId ? `?projectId=${projectId}` : '';
        return this.client.get<Task[]>(`/tasks${query}`);
      }
      create(input: CreateTaskInput, mutationId: string) {
        return this.client.post<Task>('/tasks', input, mutationId);
      }
      complete(id: string, mutationId: string) {
        return this.client.post<Task>(`/tasks/${id}/complete`, {}, mutationId);
      }
      update(id: string, input: UpdateTaskInput) {
        return this.client.patch<Task>(`/tasks/${id}`, input);
      }
    }

    export class RecommendationsApi {
      constructor(private client: FelisApiClient) {}
      getNextAction() {
        return this.client.get<Recommendation>('/recommendations/next-action');
      }
      recordOutcome(id: string, event: string, correctedTaskId?: string) {
        return this.client.post<void>(`/recommendations/${id}/outcome`, {
          event,
          correctedTaskId,
          recordedAt: new Date().toISOString(),
        });
      }
    }

    export class FocusApi {
      constructor(private client: FelisApiClient) {}
      start(taskId: string, plannedMinutes: number, mutationId: string) {
        return this.client.post<FocusSession>('/focus-sessions', { taskId, plannedMinutes }, mutationId);
      }
      end(id: string, endedAt: string, actualMinutes: number, status: string) {
        return this.client.patch<FocusSession>(`/focus-sessions/${id}`, { endedAt, actualMinutes, status });
      }
    }

11. Create packages/api-client/src/index.ts:
    export { FelisApiClient, FelisApiError } from './client';
    export { ProjectsApi, TasksApi, RecommendationsApi, FocusApi } from './endpoints';

Commit message: "feat(validation,api-client): shared schemas and typed API client"
```

---

### PROMPT 3-D (Engineer A): packages/design-tokens

```
Repository: https://github.com/Abhiix0/felis
Working directory: packages/design-tokens/

CONTEXT:
The FELIS color palette and spacing are currently duplicated in:
  apps/mobile/src/theme/tokens.ts
  root Vite: src/theme/tokens.ts  (same values, different format)

Colors (from mobile tokens.ts):
  bg: '#0D0D0C'
  surface: '#141413'
  surfaceRaised: '#181817'
  surfaceHighlight: '#1D1D1A'
  surfaceTrack: '#1F1F1C'
  border: '#292925'
  borderSubtle: '#383832'
  borderDivider: '#1D1D1A'
  text: '#F1EFE8'
  textSecondary: '#A09E97'
  textMuted: '#6F6D67'
  accent: '#F06A3A'
  accentGreen: '#B7D96B'
  overlay: 'rgba(0,0,0,0.75)'

TASK:

1. Create packages/design-tokens/src/colors.ts:
   export const colors = { ...as above... } as const;
   export type ColorKey = keyof typeof colors;

2. Create packages/design-tokens/src/spacing.ts:
   (same spacing scale from mobile tokens.ts)

3. Create packages/design-tokens/src/typography.ts:
   (same typography constants from mobile tokens.ts)

4. Create packages/design-tokens/src/radius.ts:
   (same radius values from mobile tokens.ts)

5. Create packages/design-tokens/src/semantic.ts:
   // Semantic color mappings by state
   export const semanticColors = {
     danger: '#EF4444',
     warning: '#F59E0B',
     success: '#10B981',
     info: '#3B82F6',
     // Priority
     priorityHigh: '#F06A3A',        // accent
     priorityMedium: '#F59E0B',
     priorityLow: '#6F6D67',         // textMuted
     // Status
     syncPending: '#F59E0B',
     syncFailed: '#EF4444',
     syncConflict: '#8B5CF6',
     syncSynced: '#B7D96B',          // accentGreen
   } as const;

6. Create packages/design-tokens/src/index.ts:
   export { colors, type ColorKey } from './colors';
   export { spacing } from './spacing';
   export { typography } from './typography';
   export { radius } from './radius';
   export { semanticColors } from './semantic';

7. Update apps/mobile/src/theme/tokens.ts to re-export from @felis/design-tokens:
   export { colors, spacing, typography, radius } from '@felis/design-tokens';

IMPORTANT: The design tokens must NOT depend on React Native or browser APIs.
They are plain TypeScript objects.
React Native components use them via StyleSheet.create().
Desktop components use them via CSS variables or inline styles.

Commit message: "feat(design-tokens): extract shared color/spacing/typography tokens"
```

---

---

# PHASE 4 — BACKEND FOUNDATION
## Engineer B owns Phase 4 entirely
## Engineer A: Write packages/core tests while waiting for Phase 5 API contracts

---

### PROMPT 4-A (Engineer B): Database Models + Alembic Migrations

```
Repository: https://github.com/Abhiix0/felis
Working directory: backend/

CONTEXT:
FastAPI + PostgreSQL backend.
SQLAlchemy 2.x with async support.
Alembic for migrations.
The database must support ALL entities from packages/types.

TASK:

1. Create backend/db/models.py with SQLAlchemy ORM models for ALL entities.
   Use UUID primary keys everywhere.
   Add proper indexes as specified in PRD Section 8.

   Minimum models to implement now (Phase 4):
   - User
   - Profile
   - Project
   - Task
   - Subtask
   - FocusSession
   - Recommendation
   - RecommendationOutcome
   - ActivityEvent
   - SyncMutation (for idempotency)

   Key rules:
   - Every user-owned table has user_id FK → users.id
   - Add CASCADE deletes where appropriate (delete user → delete all their data)
   - Use server_default=func.now() for created_at
   - Add onupdate=func.now() for updated_at

   Example model structure:
   from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, Enum
   from sqlalchemy.dialects.postgresql import UUID
   from sqlalchemy.sql import func
   import uuid
   from db.session import Base

   class User(Base):
     __tablename__ = 'users'
     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
     email = Column(String(255), unique=True, nullable=False, index=True)
     display_name = Column(String(100), nullable=False)
     avatar_url = Column(String(500), nullable=True)
     created_at = Column(DateTime(timezone=True), server_default=func.now())
     updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

   class Project(Base):
     __tablename__ = 'projects'
     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
     user_id = Column(UUID(as_uuid=True), ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
     name = Column(String(100), nullable=False)
     goal = Column(Text, nullable=True)
     description = Column(Text, nullable=True)
     tech_stack = Column(ARRAY(String), nullable=False, default=[])
     icon_type = Column(String(20), nullable=False, default='terminal')
     status = Column(String(20), nullable=False, default='active')
     created_at = Column(DateTime(timezone=True), server_default=func.now())
     updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

     __table_args__ = (
       Index('ix_projects_user_id', 'user_id'),
       Index('ix_projects_status', 'status'),
     )

   [Implement all other models following this pattern]

2. Initialize Alembic:
   cd backend && alembic init migrations

   Update alembic.ini to use the DATABASE_URL from config.
   Update migrations/env.py to import Base from db.models and use async.

3. Create the initial migration:
   alembic revision --autogenerate -m "initial schema"
   Review the generated migration file — ensure all tables and indexes are correct.

4. Add a make target or npm script to run migrations:
   In docs/local-development.md document:
   cd backend && alembic upgrade head

5. Create backend/db/repositories/ with repository classes for each entity:
   Each repository:
   - Takes AsyncSession as dependency
   - Scopes ALL queries by user_id (never trust client-supplied user_id)
   - Returns domain objects (or SQLAlchemy models that map cleanly)

   backend/db/repositories/project.py:
   from sqlalchemy.ext.asyncio import AsyncSession
   from sqlalchemy import select, and_
   from db.models import Project as ProjectModel
   from uuid import UUID

   class ProjectRepository:
     def __init__(self, db: AsyncSession):
       self.db = db

     async def get_by_user(self, user_id: UUID) -> list[ProjectModel]:
       result = await self.db.execute(
         select(ProjectModel).where(ProjectModel.user_id == user_id)
       )
       return result.scalars().all()

     async def get_by_id(self, project_id: UUID, user_id: UUID) -> ProjectModel | None:
       result = await self.db.execute(
         select(ProjectModel).where(
           and_(ProjectModel.id == project_id, ProjectModel.user_id == user_id)
         )
       )
       return result.scalar_one_or_none()

     async def create(self, user_id: UUID, data: dict) -> ProjectModel:
       project = ProjectModel(user_id=user_id, **data)
       self.db.add(project)
       await self.db.commit()
       await self.db.refresh(project)
       return project

     async def update(self, project: ProjectModel, data: dict) -> ProjectModel:
       for key, value in data.items():
         setattr(project, key, value)
       await self.db.commit()
       await self.db.refresh(project)
       return project

     [implement delete, archive similarly]

   Implement repositories for: Project, Task, FocusSession, Recommendation, ActivityEvent.

6. Create backend/tests/test_db.py:
   Test that migrations run cleanly against a test database.
   Test that creating a User and Project works via repositories.
   Use a test database (separate from dev) configured via TEST_DATABASE_URL env var.

Commit message: "feat(backend): SQLAlchemy models, Alembic migrations, repositories"
```

---

### PROMPT 4-B (Engineer B): Auth Layer + Error Contract + Middleware

```
Repository: https://github.com/Abhiix0/felis
Working directory: backend/

CONTEXT:
Auth must be abstracted. In Phase 4 implement a DevJWT adapter.
In Phase 5 the same interface connects to real auth.

Error format (from PRD Section 29):
  {
    "error": {
      "code": "TASK_NOT_FOUND",
      "message": "Task was not found.",
      "request_id": "..."
    }
  }

TASK:

1. Create backend/auth/adapter.py:
   from abc import ABC, abstractmethod
   from typing import Optional
   from uuid import UUID
   from pydantic import BaseModel

   class AuthenticatedUser(BaseModel):
     id: UUID
     email: str
     display_name: str

   class AuthAdapter(ABC):
     @abstractmethod
     async def verify_token(self, token: str) -> Optional[AuthenticatedUser]:
       """Verify a Bearer token and return the authenticated user, or None."""
       pass

     @abstractmethod
     async def create_dev_token(self, email: str, display_name: str) -> str:
       """Development only: create a signed token for an email."""
       pass

2. Create backend/auth/dev_jwt.py:
   Implements AuthAdapter using python-jose for JWT signing.
   On verify_token: decode JWT, check expiry, return AuthenticatedUser.
   On create_dev_token: create/find user in DB by email, sign JWT with SECRET_KEY.
   Claims: { sub: user_id, email, display_name, exp }

   This adapter is ONLY for development. A comment must note:
   # DEV ADAPTER — Not for production use.
   # Replace with Supabase/Clerk/Auth0 adapter in production.

3. Create backend/auth/dependencies.py:
   FastAPI dependency that extracts and verifies the Bearer token:

   from fastapi import Depends, HTTPException, status
   from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
   from auth.adapter import AuthenticatedUser, AuthAdapter
   from app.config import settings

   security = HTTPBearer()

   def get_auth_adapter() -> AuthAdapter:
     if settings.AUTH_PROVIDER == 'dev_jwt':
       from auth.dev_jwt import DevJWTAdapter
       return DevJWTAdapter()
     raise NotImplementedError(f"Auth provider {settings.AUTH_PROVIDER} not implemented")

   async def get_current_user(
     credentials: HTTPAuthorizationCredentials = Depends(security),
     adapter: AuthAdapter = Depends(get_auth_adapter)
   ) -> AuthenticatedUser:
     user = await adapter.verify_token(credentials.credentials)
     if not user:
       raise HTTPException(
         status_code=status.HTTP_401_UNAUTHORIZED,
         detail="Invalid or expired token"
       )
     return user

4. Create backend/app/errors.py:
   Standard error response model and exception handlers.

   from fastapi import Request
   from fastapi.responses import JSONResponse
   from pydantic import BaseModel

   class ErrorDetail(BaseModel):
     code: str
     message: str
     request_id: str

   class ErrorResponse(BaseModel):
     error: ErrorDetail

   class FelisException(Exception):
     def __init__(self, code: str, message: str, status_code: int = 400):
       self.code = code
       self.message = message
       self.status_code = status_code

   class NotFoundError(FelisException):
     def __init__(self, resource: str):
       super().__init__(f"{resource.upper()}_NOT_FOUND", f"{resource} not found.", 404)

   class ForbiddenError(FelisException):
     def __init__(self):
       super().__init__("FORBIDDEN", "Access denied.", 403)

   async def felis_exception_handler(request: Request, exc: FelisException) -> JSONResponse:
     request_id = getattr(request.state, "request_id", "unknown")
     return JSONResponse(
       status_code=exc.status_code,
       content={
         "error": {
           "code": exc.code,
           "message": exc.message,
           "request_id": request_id
         }
       }
     )

5. Register the error handler in app/main.py:
   app.add_exception_handler(FelisException, felis_exception_handler)

6. Add a POST /auth/token endpoint (dev only) that creates a token:
   POST /auth/token { "email": "dev@felis.app", "display_name": "Dev User" }
   Returns: { "access_token": "...", "token_type": "bearer" }
   This MUST be gated by AUTH_PROVIDER=dev_jwt in config.

7. Write tests in backend/tests/test_auth.py:
   - GET /health returns 200 without auth (no token required)
   - Authenticated route without token returns 401
   - Authenticated route with invalid token returns 401
   - POST /auth/token in dev mode returns a valid token
   - Token can be used to access authenticated routes

Commit message: "feat(backend): auth abstraction, DevJWT adapter, error contract"
```

---

---

# PHASE 5 — AUTH + DOMAIN CRUD
## Engineer B owns backend routes | Engineer A prepares mobile service layer

**SYNCHRONIZATION POINT: After Phase 5, API contracts are frozen. Mobile Phase 6 consumes them.**

---

### PROMPT 5-A (Engineer B): Project + Task CRUD Routes

```
Repository: https://github.com/Abhiix0/felis
Working directory: backend/

CONTEXT:
- Auth dependency is working (Phase 4-B)
- Repositories exist (Phase 4-A)
- Error contract defined (Phase 4-B)
- All routes must scope queries by authenticated user_id
- NEVER trust user_id from request body — always use get_current_user() dependency

TASK:

1. Create backend/api/projects.py with these routes:
   GET    /projects            → list user's projects
   POST   /projects            → create project
   GET    /projects/{id}       → get project (with derived stats)
   PATCH  /projects/{id}       → update project
   DELETE /projects/{id}       → archive/delete project (confirm required in client)

   Response for project must include derived task stats computed server-side:
   {
     "id": "...",
     "name": "Felis",
     "techStack": [...],
     ...
     "stats": {
       "totalTasks": 5,
       "activeTasks": 3,
       "completedTasks": 2,
       "progressPercent": 40
     }
   }

   Use Pydantic response models. Keep HTTP handlers thin:
   @router.get("/projects", response_model=list[ProjectResponse])
   async def list_projects(
     current_user: AuthenticatedUser = Depends(get_current_user),
     db: AsyncSession = Depends(get_db),
   ):
     repo = ProjectRepository(db)
     projects = await repo.get_by_user(current_user.id)
     return projects

2. Create backend/domain/project_service.py:
   Application-level logic that sits between routes and repositories.
   - create_project(user_id, input) → validates, creates, logs ActivityEvent
   - archive_project(user_id, project_id) → changes status to 'archived'
   - delete_project(user_id, project_id) → hard delete with confirmation flag

3. Create backend/api/tasks.py with these routes:
   GET    /tasks               → list tasks (optional ?projectId, ?status, ?dueDate)
   POST   /tasks               → create task (reads X-Client-Mutation-ID header)
   GET    /tasks/{id}          → get task
   PATCH  /tasks/{id}          → update task
   POST   /tasks/{id}/complete → mark complete (idempotent)
   DELETE /tasks/{id}          → delete task

   Idempotency for POST /tasks:
   - Read X-Client-Mutation-ID header
   - Check sync_mutations table for existing record with this mutation_id
   - If found and status='completed': return existing task (don't create duplicate)
   - If not found: create task, insert sync_mutation record

4. Create backend/domain/task_service.py:
   - create_task(user_id, input, client_mutation_id) → idempotent create
   - complete_task(user_id, task_id, client_mutation_id) → idempotent complete
   - Emit ActivityEvent on create and complete

5. Create backend/api/home.py:
   GET /home → returns:
   {
     "greeting": "Good morning",
     "dateLabel": "Thursday, 18 September",
     "todayTasks": [...],  // tasks due today
     "recommendation": { taskId, score, signals },
     "recentlyCompleted": [...]
   }
   Run computeNextAction in Python (or call the TypeScript core via subprocess — no,
   just port the scoring logic to Python for the backend).
   The deterministic recommendation algorithm is simple enough to reimplement in Python.

6. Write backend/tests/test_projects.py:
   - Create project returns 201 with correct data
   - List projects only returns current user's projects
   - Get project by ID owned by another user returns 403
   - Update project works
   - Delete project removes it

7. Write backend/tests/test_tasks.py:
   - Create task with client_mutation_id is idempotent (second call returns same task)
   - Complete task is idempotent
   - Task is scoped to authenticated user
   - Task with invalid projectId returns 400

Commit message: "feat(backend): Project + Task CRUD with auth, idempotency, ownership"
```

---

### PROMPT 5-B (Engineer A): Mobile Service Layer Preparation

```
Repository: https://github.com/Abhiix0/felis
Working directory: apps/mobile/

CONTEXT:
The backend CRUD API is being built in parallel (Phase 5-A).
Your job is to create the service/repository architecture in mobile so that
when the backend is ready, you only need to plug in the API client.

The current mobile app uses a single AppContext with all state inline.
This needs to be refactored into a layered architecture without breaking the app.

CURRENT STATE:
  apps/mobile/src/context/AppContext.tsx  ← everything is here
  apps/mobile/src/storage/persistence.ts  ← AsyncStorage blob

TARGET STATE:
  apps/mobile/src/
    services/
      ProjectService.ts   ← create/list/update projects
      TaskService.ts      ← create/complete/list tasks
      FocusService.ts     ← start/end focus sessions
    storage/
      persistence.ts      ← remains, wrap in repository
      LocalProjectRepository.ts
      LocalTaskRepository.ts
    context/
      AppContext.tsx       ← SLIMMED DOWN: just wires services together
      AuthContext.tsx      ← NEW: manages auth state

TASK:

1. Create apps/mobile/src/context/AuthContext.tsx:
   Manages: { user: User | null, isLoading: boolean, signIn, signOut }
   For now (no real auth yet): user is null, signIn is a stub that sets a dev user.

   interface AuthContextType {
     user: User | null;
     isLoading: boolean;
     signIn: (email: string, displayName: string) => Promise<void>;
     signOut: () => Promise<void>;
   }

   Dev implementation: persist a simple user object in AsyncStorage.
   DisplayName stored as 'felis:user' key.

2. Update apps/mobile/src/context/AppContext.tsx:
   - Remove the hardcoded INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_RECOMMENDATION
   - Keep these as fallback data only for first-launch before real data loads
   - Connect to AuthContext to get the current user

3. Create apps/mobile/src/storage/LocalProjectRepository.ts:
   Wraps AsyncStorage project operations.
   import AsyncStorage from '@react-native-async-storage/async-storage';
   import type { Project } from '@felis/types';

   const PROJECTS_KEY = 'felis:v2:projects';

   export class LocalProjectRepository {
     async getAll(): Promise<Project[]> { ... }
     async save(projects: Project[]): Promise<void> { ... }
     async upsert(project: Project): Promise<void> { ... }
   }

4. Create apps/mobile/src/storage/LocalTaskRepository.ts:
   Same pattern for tasks.
   const TASKS_KEY = 'felis:v2:tasks';

5. Create apps/mobile/src/services/ProjectService.ts:
   import { LocalProjectRepository } from '../storage/LocalProjectRepository';

   export class ProjectService {
     constructor(
       private local: LocalProjectRepository,
       // private api: ProjectsApi  ← will be injected in Phase 6
     ) {}

     async getAll(): Promise<Project[]> {
       return this.local.getAll();
     }

     async create(input: CreateProjectInput): Promise<Project> {
       const project: Project = {
         id: `local-${Date.now()}`,  // temporary local ID until synced
         userId: 'local',
         name: input.name,
         goal: input.goal,
         description: input.description,
         techStack: input.techStack ?? [],
         iconType: input.iconType ?? 'terminal',
         status: 'active',
         createdAt: new Date().toISOString(),
         updatedAt: new Date().toISOString(),
       };
       await this.local.upsert(project);
       return project;
       // In Phase 6: also queue a SyncMutation
     }
   }

6. Create apps/mobile/src/services/TaskService.ts:
   Similar pattern. Key methods:
   - getAll(): Promise<Task[]>
   - getByProject(projectId: string): Promise<Task[]>
   - create(input: CreateTaskInput): Promise<Task>
   - complete(taskId: string): Promise<Task>
   - update(taskId: string, changes: Partial<Task>): Promise<Task>

   createTask must correctly resolve projectId using project lookup:
   async create(input: CreateTaskInput, projects: Project[]): Promise<Task> {
     const project = input.projectId
       ? projects.find(p => p.id === input.projectId)
       : undefined;
     const task: Task = {
       id: `local-${Date.now()}`,
       userId: 'local',
       projectId: project?.id,
       projectName: project?.name,  // display helper
       title: input.title,
       priority: input.priority ?? 'medium',
       status: 'pending',
       subtasks: [],
       createdAt: new Date().toISOString(),
       updatedAt: new Date().toISOString(),
       estimateMinutes: input.estimateMinutes,
       dueDate: input.dueDate,
     };
     await this.local.upsert(task);
     return task;
   }

7. Update AppContext to use the service layer:
   - Instantiate services in AppProvider
   - Replace direct state mutations with service calls
   - Keep existing API surface (useApp() hook) unchanged so screens don't break

8. Update apps/mobile/app/(tabs)/index.tsx:
   - Use AuthContext for user display name (fallback to "Developer" if null)
   - Replace hardcoded greeting with: user?.displayName || 'Developer'

9. Run: cd apps/mobile && npx tsc --noEmit — fix all errors.

Commit message: "refactor(mobile): service layer, auth context, local repositories"
```

---

---

# PHASE 6 — MOBILE REAL DATA
## Engineer A owns Phase 6 | Engineer B builds recommendation + focus endpoints

---

### PROMPT 6-A (Engineer A): SQLite Local Storage + Sync Queue

```
Repository: https://github.com/Abhiix0/felis
Working directory: apps/mobile/

CONTEXT:
Current local storage: AsyncStorage JSON blob (single key for all state).
Target: Expo SQLite for structured local storage + mutation queue.

WHY SQLite over AsyncStorage:
- Structured queries (filter tasks by project, by date)
- Indexing for performance
- Mutation queue as a proper table
- Better offline support

PACKAGES TO INSTALL (in apps/mobile):
  expo-sqlite

TASK:

1. Create apps/mobile/src/storage/db.ts:
   Initialize SQLite database with tables.

   import * as SQLite from 'expo-sqlite';

   let db: SQLite.SQLiteDatabase;

   export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
     if (db) return db;
     db = await SQLite.openDatabaseAsync('felis.db');
     await runMigrations(db);
     return db;
   }

   async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
     await db.execAsync(`
       CREATE TABLE IF NOT EXISTS schema_version (
         version INTEGER PRIMARY KEY
       );

       CREATE TABLE IF NOT EXISTS projects (
         id TEXT PRIMARY KEY,
         user_id TEXT NOT NULL,
         name TEXT NOT NULL,
         goal TEXT,
         description TEXT,
         tech_stack TEXT NOT NULL DEFAULT '[]',  -- JSON array
         icon_type TEXT NOT NULL DEFAULT 'terminal',
         status TEXT NOT NULL DEFAULT 'active',
         created_at TEXT NOT NULL,
         updated_at TEXT NOT NULL,
         sync_status TEXT NOT NULL DEFAULT 'pending'
       );

       CREATE TABLE IF NOT EXISTS tasks (
         id TEXT PRIMARY KEY,
         user_id TEXT NOT NULL,
         project_id TEXT,
         title TEXT NOT NULL,
         description TEXT,
         priority TEXT NOT NULL DEFAULT 'medium',
         status TEXT NOT NULL DEFAULT 'pending',
         due_date TEXT,
         due_time TEXT,
         estimate_minutes INTEGER,
         created_at TEXT NOT NULL,
         updated_at TEXT NOT NULL,
         completed_at TEXT,
         sync_status TEXT NOT NULL DEFAULT 'pending',
         FOREIGN KEY (project_id) REFERENCES projects(id)
       );

       CREATE TABLE IF NOT EXISTS subtasks (
         id TEXT PRIMARY KEY,
         task_id TEXT NOT NULL,
         title TEXT NOT NULL,
         completed INTEGER NOT NULL DEFAULT 0,
         completed_at TEXT,
         position INTEGER NOT NULL DEFAULT 0,
         FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
       );

       CREATE TABLE IF NOT EXISTS sync_mutations (
         id TEXT PRIMARY KEY,         -- clientMutationId (UUID)
         type TEXT NOT NULL,
         payload TEXT NOT NULL,       -- JSON
         created_at TEXT NOT NULL,
         status TEXT NOT NULL DEFAULT 'pending',
         retry_count INTEGER NOT NULL DEFAULT 0,
         last_attempt_at TEXT,
         error TEXT
       );

       CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
       CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
       CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
       CREATE INDEX IF NOT EXISTS idx_sync_status ON sync_mutations(status);
     `);
   }

2. Update LocalProjectRepository to use SQLite:
   import { openDatabase } from './db';
   import type { Project } from '@felis/types';

   export class LocalProjectRepository {
     async getAll(userId: string): Promise<Project[]> {
       const db = await openDatabase();
       const rows = await db.getAllAsync<any>(
         'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC',
         [userId]
       );
       return rows.map(mapRowToProject);
     }

     async upsert(project: Project): Promise<void> {
       const db = await openDatabase();
       await db.runAsync(
         `INSERT INTO projects (id, user_id, name, goal, description, tech_stack,
           icon_type, status, created_at, updated_at, sync_status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            name=excluded.name, goal=excluded.goal, description=excluded.description,
            tech_stack=excluded.tech_stack, status=excluded.status,
            updated_at=excluded.updated_at, sync_status=excluded.sync_status`,
         [
           project.id, project.userId, project.name, project.goal ?? null,
           project.description ?? null, JSON.stringify(project.techStack),
           project.iconType, project.status, project.createdAt, project.updatedAt,
           'pending'
         ]
       );
     }
   }

   function mapRowToProject(row: any): Project {
     return {
       id: row.id,
       userId: row.user_id,
       name: row.name,
       goal: row.goal ?? undefined,
       description: row.description ?? undefined,
       techStack: JSON.parse(row.tech_stack || '[]'),
       iconType: row.icon_type,
       status: row.status,
       createdAt: row.created_at,
       updatedAt: row.updated_at,
     };
   }

3. Update LocalTaskRepository similarly for SQLite.

4. Create apps/mobile/src/storage/SyncQueue.ts:
   import { openDatabase } from './db';
   import { v4 as uuidv4 } from 'uuid';

   export interface MutationRecord {
     id: string;
     type: string;
     payload: unknown;
     createdAt: string;
     status: 'pending' | 'synced' | 'failed' | 'conflict';
     retryCount: number;
   }

   export class SyncQueue {
     async enqueue(type: string, payload: unknown): Promise<string> {
       const db = await openDatabase();
       const id = uuidv4();
       await db.runAsync(
         `INSERT INTO sync_mutations (id, type, payload, created_at, status, retry_count)
          VALUES (?, ?, ?, ?, 'pending', 0)`,
         [id, type, JSON.stringify(payload), new Date().toISOString()]
       );
       return id;
     }

     async getPending(): Promise<MutationRecord[]> {
       const db = await openDatabase();
       const rows = await db.getAllAsync<any>(
         `SELECT * FROM sync_mutations WHERE status = 'pending'
          ORDER BY created_at ASC LIMIT 50`
       );
       return rows.map(r => ({
         id: r.id,
         type: r.type,
         payload: JSON.parse(r.payload),
         createdAt: r.created_at,
         status: r.status,
         retryCount: r.retry_count,
       }));
     }

     async markSynced(id: string): Promise<void> {
       const db = await openDatabase();
       await db.runAsync(
         `UPDATE sync_mutations SET status='synced' WHERE id=?`, [id]
       );
     }

     async markFailed(id: string, error: string): Promise<void> {
       const db = await openDatabase();
       await db.runAsync(
         `UPDATE sync_mutations SET status='failed', error=?,
          retry_count=retry_count+1, last_attempt_at=? WHERE id=?`,
         [error, new Date().toISOString(), id]
       );
     }
   }

5. Update TaskService.create() to:
   - Write to local SQLite
   - Enqueue a CREATE_TASK mutation in SyncQueue
   - Return the local task immediately (optimistic)

6. Update TaskService.complete() to:
   - Update local SQLite immediately
   - Enqueue a COMPLETE_TASK mutation in SyncQueue

7. Verify the app still works with:
   cd apps/mobile && npx tsc --noEmit

Commit message: "feat(mobile): SQLite local storage, sync queue, optimistic writes"
```

---

### PROMPT 6-B (Engineer A): Connect Mobile to Backend API

```
Repository: https://github.com/Abhiix0/felis
Working directory: apps/mobile/

CONTEXT:
- Backend API is running at http://localhost:8000 (from Phase 4-5)
- @felis/api-client exists (from Phase 3-C)
- Local SQLite is set up (from Phase 6-A)
- SyncQueue is ready

TASK:

1. Install uuid in apps/mobile:
   npm install uuid
   npm install --save-dev @types/uuid

2. Create apps/mobile/src/api/felisClient.ts:
   import { FelisApiClient } from '@felis/api-client';
   import AsyncStorage from '@react-native-async-storage/async-storage';

   const TOKEN_KEY = 'felis:auth:token';

   export const apiClient = new FelisApiClient({
     baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000',
     getAccessToken: () => {
       // Synchronous access — token is loaded at startup
       return globalThis.__felisAccessToken || null;
     },
     onAuthError: () => {
       // Clear token and redirect to login
       globalThis.__felisAccessToken = null;
       AsyncStorage.removeItem(TOKEN_KEY);
       // TODO: emit auth error event to AuthContext
     },
   });

   export async function loadStoredToken(): Promise<string | null> {
     const token = await AsyncStorage.getItem(TOKEN_KEY);
     if (token) globalThis.__felisAccessToken = token;
     return token;
   }

   export async function storeToken(token: string): Promise<void> {
     globalThis.__felisAccessToken = token;
     await AsyncStorage.setItem(TOKEN_KEY, token);
   }

3. Update AuthContext.tsx:
   - signIn() calls POST /auth/token (dev mode) → stores token → loads user
   - signOut() clears token from AsyncStorage
   - On app start, call loadStoredToken() to restore session

4. Create apps/mobile/src/sync/SyncManager.ts:
   Background sync manager. Processes the queue when online.

   import { SyncQueue } from '../storage/SyncQueue';
   import { FelisApiClient } from '@felis/api-client';
   import { LocalProjectRepository } from '../storage/LocalProjectRepository';
   import { LocalTaskRepository } from '../storage/LocalTaskRepository';

   export class SyncManager {
     private queue: SyncQueue;
     private isRunning: boolean = false;

     constructor(
       private apiClient: FelisApiClient,
       private localProjects: LocalProjectRepository,
       private localTasks: LocalTaskRepository,
     ) {
       this.queue = new SyncQueue();
     }

     async sync(): Promise<void> {
       if (this.isRunning) return;
       this.isRunning = true;
       try {
         const pending = await this.queue.getPending();
         for (const mutation of pending) {
           await this.processMutation(mutation);
         }
       } finally {
         this.isRunning = false;
       }
     }

     private async processMutation(mutation: any): Promise<void> {
       try {
         switch (mutation.type) {
           case 'CREATE_TASK': {
             const task = await this.apiClient.post('/tasks', mutation.payload, mutation.id);
             // Update local record with server-assigned ID
             await this.localTasks.upsert({ ...mutation.payload, ...task, syncStatus: 'synced' });
             await this.queue.markSynced(mutation.id);
             break;
           }
           case 'COMPLETE_TASK': {
             await this.apiClient.post(`/tasks/${mutation.payload.taskId}/complete`, {}, mutation.id);
             await this.queue.markSynced(mutation.id);
             break;
           }
           case 'CREATE_PROJECT': {
             const project = await this.apiClient.post('/projects', mutation.payload, mutation.id);
             await this.localProjects.upsert({ ...mutation.payload, ...project, syncStatus: 'synced' });
             await this.queue.markSynced(mutation.id);
             break;
           }
           default:
             console.warn('[SyncManager] Unknown mutation type:', mutation.type);
         }
       } catch (err: any) {
         if (err?.statusCode >= 400 && err?.statusCode < 500) {
           // Client error — don't retry
           await this.queue.markFailed(mutation.id, err.message);
         } else {
           // Network/server error — will retry next sync run
           await this.queue.markFailed(mutation.id, err.message);
         }
       }
     }
   }

5. Create apps/mobile/src/sync/useSyncManager.ts:
   React hook that triggers sync on:
   - App foreground (AppState change)
   - Network reconnection (NetInfo)
   - After a local mutation

6. Update AppContext to:
   - Initialize SyncManager
   - Call sync() after creating tasks/projects
   - Call sync() when app comes to foreground

7. Add a subtle sync status indicator to the Home screen:
   - Show a small dot: green=synced, amber=pending, red=failed
   - Do not block UI for sync status
   - Do not show sync UI if everything is synced

8. Run: cd apps/mobile && npx tsc --noEmit — fix all errors.

Commit message: "feat(mobile): backend API integration, sync manager, auth session"
```

---

---

# PHASE 7 — CORE FELIS LOOP END-TO-END
## Both Engineers | Vertical feature implementation

---

### PROMPT 7-A (Engineer B): Recommendation + Focus Session Endpoints

```
Repository: https://github.com/Abhiix0/felis
Working directory: backend/

CONTEXT:
The core FELIS loop requires these backend endpoints to work end-to-end:
- GET /recommendations/next-action
- POST /recommendations/{id}/outcome
- POST /focus-sessions
- PATCH /focus-sessions/{id}

The recommendation engine runs on the server using the same deterministic logic
as packages/core (re-implemented in Python for the backend).

TASK:

1. Create backend/domain/recommendation_engine.py:
   Pure Python port of the TypeScript recommendation engine from packages/core.
   Same weights:
     URGENCY = 25
     PRIORITY = 20
     PROJECT_IMPORTANCE = 15
     BLOCKING_IMPACT = 15  # stub = 0 in V1
     TIME_FIT = 10
     RECENCY_CONTEXT = 10
     PREFERENCE_FIT = 5    # stub = 0 in V1

   def score_urgency(task: TaskModel, now: datetime) -> float: ...
   def score_priority(task: TaskModel) -> float: ...
   def score_project_importance(task: TaskModel, projects: list[ProjectModel]) -> float: ...
   def score_time_fit(task: TaskModel, preferred_minutes: int = 25) -> float: ...
   def score_recency_context(task: TaskModel, now: datetime) -> float: ...

   def compute_next_action(
     tasks: list[TaskModel],
     projects: list[ProjectModel],
     now: datetime = None,
     preferred_minutes: int = 25,
   ) -> dict | None:
     ...returns recommendation dict with signals...

2. Create backend/api/recommendations.py:
   GET /recommendations/next-action:
   - Load user's incomplete tasks from DB
   - Load user's projects from DB
   - Run compute_next_action()
   - Save recommendation record to DB
   - Return structured recommendation with signals

   POST /recommendations/{id}/outcome:
   - Validate event type
   - Save RecommendationOutcome record
   - Return 200

3. Create backend/domain/focus_service.py:
   - start_session(user_id, task_id, planned_minutes, client_mutation_id) → FocusSession
     Idempotent: check sync_mutations table first
   - end_session(user_id, session_id, ended_at, actual_minutes, status) → FocusSession
     Calculate actual_minutes if not supplied: (ended_at - started_at in minutes)
     Emit 'focus_finished' ActivityEvent

4. Create backend/api/focus_sessions.py:
   POST /focus-sessions  → start session (idempotent via X-Client-Mutation-ID)
   PATCH /focus-sessions/{id} → end/update session

5. Write backend/tests/test_recommendation.py:
   - Returns null when no incomplete tasks
   - High priority task beats low priority
   - Overdue task gets max urgency score
   - Signals are present and grounded
   - Outcome recording works

6. Write backend/tests/test_focus.py:
   - Start session creates record
   - Start session is idempotent (same mutation_id → same session returned)
   - End session calculates actual_minutes correctly
   - End session records ActivityEvent

Commit message: "feat(backend): recommendation engine, focus session endpoints"
```

---

### PROMPT 7-B (Engineer A): End-to-End Core Loop Integration (Mobile)

```
Repository: https://github.com/Abhiix0/felis
Working directory: apps/mobile/

CONTEXT:
Backend endpoints are now live:
  POST /auth/token
  GET  /projects
  POST /projects
  GET  /tasks
  POST /tasks
  POST /tasks/{id}/complete
  GET  /recommendations/next-action
  POST /recommendations/{id}/outcome
  POST /focus-sessions
  PATCH /focus-sessions/{id}

The end-to-end flow to verify:
  1. User signs in
  2. Creates a project
  3. Creates a task with a due date and priority
  4. Home screen shows recommendation (computed server-side or locally)
  5. User starts Focus Mode
  6. Timer counts down correctly
  7. User marks focus complete
  8. Task marked complete in local DB and backend
  9. Recommendation recalculates (no pending tasks → "No pending tasks")

TASK:

1. Wire AuthContext.signIn() to POST /auth/token:
   const token = await apiClient.post('/auth/token', { email, displayName });
   await storeToken(token.access_token);

2. Wire ProjectService.create() to:
   - Write local SQLite immediately (optimistic)
   - Enqueue CREATE_PROJECT mutation in SyncQueue
   - Trigger sync if online

3. Wire TaskService.create() to:
   - Write local SQLite immediately (optimistic)
   - Enqueue CREATE_TASK mutation
   - Trigger sync

4. Wire recommendation to backend:
   Update AppContext to:
   - On load: call GET /recommendations/next-action from backend
   - Cache result locally (1 recommendation at a time)
   - Fall back to local computeNextAction() if offline
   - Re-fetch after task completion

5. Wire Focus Mode to backend:
   Update startFocus() to:
   - Call POST /focus-sessions with taskId, plannedMinutes
   - Store session ID locally
   - Begin timer

   Update finishFocus() to:
   - Calculate actual minutes using computeActualMinutes()
   - Call PATCH /focus-sessions/{id} with endedAt, actualMinutes, status='finished'
   - Optionally call POST /tasks/{id}/complete if user confirms
   - Record recommendation outcome 'completed' if from recommendation

6. Show the recommendation on the Home screen from backend response.
   While loading: show LoadingState.
   On error: fall back to local recommendation silently.

7. After task completion, re-fetch recommendation:
   - Clear current recommendation
   - Show LoadingState momentarily
   - Fetch new recommendation
   - Update UI

8. Test the full flow manually:
   - Start backend: cd backend && uvicorn app.main:app --reload
   - Start mobile: cd apps/mobile && npx expo start
   - Sign in
   - Create project "FELIS"
   - Create task "Implement API tests" due tomorrow, high priority, 35 min
   - Verify recommendation shows "Implement API tests"
   - Start focus, complete it
   - Verify task is completed in backend (GET /tasks)
   - Verify recommendation recalculates

9. Run: cd apps/mobile && npx tsc --noEmit — fix all errors.

Commit message: "feat(mobile): end-to-end core loop connected to backend"
```

---

---

# PHASE 8 — DESKTOP FOUNDATION
## Engineer B owns Phase 8 | Engineer A: mobile polish + tests

---

### PROMPT 8-A (Engineer B): Desktop App — Login + Home + Projects + Tasks

```
Repository: https://github.com/Abhiix0/felis
Working directory: apps/desktop/

CONTEXT:
The desktop app is a Vite React app targeting eventual Tauri wrapping.
It must NOT be a stretched mobile layout. Use desktop-native information density.

Design reference — target layout:
┌──────────────┬──────────────────────────────────────┐
│ FELIS        │                                      │
│              │ Good morning, Developer              │
│ Home         │                                      │
│ Projects     │ DO THIS NOW                          │
│ Tasks        │ Implement API tests                  │
│ Radar        │ Due tomorrow · 35 min · High         │
│              │                                      │
│ ─────────    │ [ Start Focus ]                      │
│              │                                      │
│ PROJECTS     │ Today            Upcoming            │
│ FELIS        │ • Review DB...   • Update config     │
│ UCDP         │ • Write tests    ...                 │
│              │                                      │
└──────────────┴──────────────────────────────────────┘

COLORS: Same as mobile tokens (import from @felis/design-tokens)
  bg: #0D0D0C, accent: #F06A3A, text: #F1EFE8, etc.

TASK:

1. Install dependencies in apps/desktop:
   npm install @felis/design-tokens @felis/types @felis/api-client
   npm install lucide-react

2. Create apps/desktop/src/theme/css-variables.ts:
   Inject CSS variables from @felis/design-tokens into the document root.
   import { colors, spacing } from '@felis/design-tokens';
   export function injectCssVariables() {
     const root = document.documentElement;
     Object.entries(colors).forEach(([key, value]) => {
       root.style.setProperty(`--color-${key}`, value);
     });
   }

3. Create apps/desktop/src/layout/AppLayout.tsx:
   Two-column layout:
   Left: fixed sidebar (240px)
     - FELIS logo/title
     - Nav links: Home, Projects, Tasks, Radar
     - Project list (from context)
     - Sync status indicator
   Right: main content area (flex-grow)
     - Router outlet

4. Create apps/desktop/src/pages/HomePage.tsx:
   Left side shows the sidebar.
   Main area shows:
   - Greeting with real date (using dateUtils from @felis/core)
   - "DO THIS NOW" recommendation card (dominant, high contrast)
   - [Start Focus] button
   - Today section: tasks due today
   - Upcoming section: tasks due this week

5. Create apps/desktop/src/pages/ProjectsPage.tsx:
   Two-column within main:
   - Left: project list with stats (derived from tasks)
   - Right: selected project detail with task list

6. Create apps/desktop/src/pages/TasksPage.tsx:
   Full task list with filtering: All / Today / Project / Priority
   Inline task completion toggle.
   Quick-add bar at top (uses parseQuickAddInput from @felis/core)

7. Create apps/desktop/src/context/DesktopAppContext.tsx:
   Same pattern as mobile AppContext but for desktop.
   Uses @felis/api-client to fetch from backend.
   Local state (no SQLite on desktop in Phase 8 — that's Phase 9+).

8. Add React Router to apps/desktop:
   npm install react-router-dom

   Routes:
   /       → HomePage
   /projects → ProjectsPage
   /projects/:id → ProjectDetailPage
   /tasks  → TasksPage

9. Desktop Focus Mode (apps/desktop/src/pages/FocusPage.tsx):
   Simpler than mobile — no full-screen takeover.
   Modal or right panel showing:
   - Task name
   - Countdown timer (same logic as mobile, using computeActualMinutes)
   - Subtask list
   - Complete / Abandon buttons

10. Desktop quick-add (Command K pattern):
    Keyboard shortcut: Ctrl/Cmd+K
    Opens a modal with text input
    Uses parseQuickAddInput from @felis/core
    Shows parsed preview
    Saves task via API

11. Connect to backend API using @felis/api-client:
    Same auth flow as mobile (POST /auth/token in dev mode)
    Store token in localStorage (desktop doesn't need AsyncStorage)

12. Run: cd apps/desktop && npm run typecheck — fix all errors.
    Run: cd apps/desktop && npm run build — must succeed.

Commit message: "feat(desktop): login, home, projects, tasks, focus, command-k"
```

---

### PROMPT 8-B (Engineer A): Mobile Polish + Tests

```
Repository: https://github.com/Abhiix0/felis
Working directory: apps/mobile/

CONTEXT:
Phase 7 completed the core loop. Now add:
- Correct empty states throughout
- Tests for domain logic
- Fix any remaining UX issues from Phase 1-7

TASK:

1. Ensure all screens handle empty states correctly:
   - Home with no tasks: CatIllustration pose="empty" + "No pending tasks"
   - Projects: EmptyState component
   - Tasks: EmptyState component
   - Recommendation: null → "No pending tasks" (NO fabricated recommendation)

2. Add tests for domain logic using jest or vitest:
   apps/mobile/src/__tests__/recommendation.test.ts:
   - Import computeNextAction from @felis/core
   - Empty tasks → null
   - One high priority task → returned
   - High priority beats low regardless of due date
   - Overdue beats tomorrow beats next week
   - Score is between 0 and 100

   apps/mobile/src/__tests__/taskParsing.test.ts:
   - Import parseQuickAddInput from @felis/core
   - "Fix auth bug tomorrow 30m !high" → title='Fix auth bug', dueLabel='Tomorrow', priority='high', estimate=30
   - "#felis" → projectId resolved from projects list
   - "Do something" → title='Do something', no other fields set
   - Empty string → empty title

3. Fix the Radar tab:
   Current: placeholder text.
   After Phase 8: Show "Coming soon" with a properly styled empty state.
   Do NOT show fake news. Do NOT fabricate tech content.

4. Fix Profile tab:
   Show user display name from AuthContext.
   Show sign-out button (calls signOut() → clears token → returns to auth screen).
   Show app version from app.json.
   Show sync status summary.
   Show "Reset to demo data" only in dev mode.

5. Add a simple auth gate:
   In apps/mobile/app/_layout.tsx:
   - Check AuthContext.user
   - If null → show LoginScreen (simple form: display name field, sign-in button)
   - If loaded → show main app
   - While loading → show LoadingState

   LoginScreen: simple, no registration flow yet.
   DEV MODE: auto-sign-in as "Developer" if EXPO_PUBLIC_DEV_MODE=true.

6. Update docs/implementation-status.md after Phase 7-8 is complete:
   ✅ End-to-end core loop (mobile)
   ✅ SQLite local storage
   ✅ Sync queue + manager
   ✅ Backend API integration
   ✅ Recommendation from backend
   ✅ Focus session persistence
   ✅ Auth gate (mobile)
   ✅ Desktop foundation (home, projects, tasks, focus)
   🟡 Desktop sync (Phase 9)
   🟡 Memory (Phase 10)
   🟡 Daily Review (Phase 10)
   ❌ Notifications (Phase 10)
   ❌ Radar (Phase 10)

Commit message: "feat(mobile): polish, auth gate, domain tests, empty states"
```

---

---

# DIVISION SUMMARY

| Phase | Engineer A (Mobile + Core) | Engineer B (Backend + Desktop) |
|-------|---------------------------|-------------------------------|
| 0 | Mobile audit | Infrastructure audit |
| 1 | ALL bug fixes (1-A through 1-E) | Plan backend, write docs |
| 2 | npm workspaces + mobile move | Backend scaffold + CI |
| 3 | packages/types + core + tokens | packages/validation + api-client |
| 4 | Write core tests | DB models + auth layer |
| 5 | Mobile service layer prep | Project + Task CRUD routes |
| 6 | SQLite + sync + backend connect | Recommendation + focus endpoints |
| 7 | End-to-end loop integration | Recommendation + focus backend |
| 8 | Mobile polish + tests | Desktop app |

---

# SYNCHRONIZATION CHECKPOINTS

## Checkpoint 1 (End of Phase 2)
Both engineers verify:
- `npm run dev:mobile` works from repo root
- `npm run dev:backend` works from repo root
- CI pipeline passes on GitHub Actions
- No broken imports from the monorepo migration

## Checkpoint 2 (End of Phase 3)
Both engineers verify:
- `@felis/types` exports all domain models
- `@felis/core` exports recommendation engine, parser, selectors
- `@felis/validation` schemas validated
- `@felis/api-client` compiles clean
- `npm run typecheck` passes across all packages

## Checkpoint 3 (End of Phase 5)
Both engineers verify:
- Backend API responds at http://localhost:8000/health
- `POST /auth/token` works and returns a valid JWT
- `GET /projects` requires auth and returns empty list for new user
- `POST /tasks` is idempotent
- API contract matches what api-client expects

## Checkpoint 4 (End of Phase 7)
Both engineers perform the full milestone test:
1. Sign in on mobile
2. Create Project "FELIS"
3. Create Task "Implement API tests" — due tomorrow, high priority, 35 min
4. Verify recommendation shows the task
5. Start Focus, run ~2 minutes, complete
6. Verify task is completed server-side (GET /tasks)
7. Verify recommendation recalculates
8. Open desktop app — see same project and task
9. Create a task on desktop — verify it appears on mobile after sync
10. Go offline on mobile, create a task, reconnect — verify it syncs

---

# IMPORTANT: DO NOT BUILD THESE IN THIS PLAN

The following are explicitly deferred to Phase 10+:
- GitHub / IDE integration
- Radar (RSS feed, summarization)
- Notifications (just stub the UI)
- Memory (explicit and inferred)
- Daily Review
- Multi-agent orchestration
- Social / gamification features
- Autonomous coding

Build these ONLY after the core loop from Checkpoint 4 works reliably.

---

# ERROR CONTRACT REMINDER

Every backend error must return:
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Human-readable message.",
    "request_id": "uuid"
  }
}
```

Every route handler must catch `FelisException` and return this format.
Unhandled exceptions return 500 with generic message (no stack traces in production).

---

# FELIS PRODUCT RULES (never violate)

1. Do not fabricate recommendations. If no eligible tasks: show "No pending tasks."
2. Do not call the parser "AI". It is deterministic. Use "FELIS parsed this."
3. Do not show hardcoded dates. Always use device timezone.
4. Do not store derived project stats. Always compute from task data.
5. Do not initialize focusSession with a running state. Always null at startup.
6. Do not inject fake subtasks into any task.
7. Do not claim sync succeeded if it failed. Show pending state.
8. Require explicit confirmation before any destructive action (delete, archive).
9. Agent (LLM) must never modify state directly — always goes through domain services.
10. User ID must always come from verified auth token, never from client payload.
