# Batch 8 — Task Engine

## Files

```
erp/src/
  engine/
    allSteps.json               ← 799 steps for 81 lessons (data file)
    taskRoutes.js               ← screen_target → route mapping
    useTaskEngine.js            ← Zustand store, lesson state machine
    taskVerifier.js             ← DOM event watcher (auto-advances steps)
    StepHighlighter.jsx         ← spotlight ring around target element
    TaskOverlay.jsx             ← floating HUD with instruction + controls
    TaskEngineProvider.jsx      ← wrapper that connects all pieces
    LessonSelector.jsx          ← lesson library UI (all 81 lessons)
    AppHomeLessonWidget.jsx     ← banner widget for AppHome

  App.jsx                       ← REPLACE (wraps with TaskEngineProvider,
                                   adds /erp/lessons route)
```

---

## Step 1 — Copy engine folder
Copy `erp/src/engine/` into your project.

## Step 2 — Replace App.jsx
Replace `erp/src/App.jsx` with the one in this zip.

## Step 3 — Add Lesson Widget to AppHome (optional but recommended)
In `erp/src/modules/home/AppHome.jsx`, add near the top of the JSX:

```jsx
import AppHomeLessonWidget from '../../engine/AppHomeLessonWidget.jsx'

// Inside the return, before the module tile grid:
<AppHomeLessonWidget />
```

## Step 4 — Add Lessons link to TopNavbar (optional)
In `erp/src/shell/TopNavbar.jsx`, in the user menu items array, add:
```js
{ icon: '📋', label: 'Lesson Library', action: () => navigate('/erp/lessons') },
```

---

## How it works

### Starting a lesson
```js
import { useTaskEngine } from '../engine/useTaskEngine.js'
const { startLesson } = useTaskEngine()

// Start lesson 1 (Activities)
startLesson(1)
```

### The engine loop
1. `startLesson(id)` → loads lesson, navigates to first step screen
2. `TaskEngineProvider` calls `watchStep(step, completeStep)` on every step change
3. `taskVerifier` listens for matching DOM events:
   - `navigate` → auto-advances after 400ms
   - `click` → advances when `[data-erp="<selector>"]` is clicked
   - `type` → advances when `[data-erp="<selector>"]` receives input
   - `observe` → auto-advances after 1800ms
4. `completeStep()` → increments step index, highlights next selector
5. `StepHighlighter` renders a spotlight ring via `[data-erp]` query
6. `TaskOverlay` shows instruction text, progress bar, Skip/Stop buttons

### Manual advance
Users can always click "Mark Done →" in the TaskOverlay to manually advance.

### data-erp attributes
All module files from batches 1–7 already have `data-erp` attributes on the correct elements. The verifier uses `document.querySelector('[data-erp="<selector>"]')` to find them.

---

## Lesson Library route
Navigate to `/erp/lessons` to see all 81 lessons searchable and grouped by section.

## All 81 lessons are now functional.
