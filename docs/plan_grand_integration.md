# Plan 3 — Grand Integration Plan
## Learning Platform + ERP Simulation + AI Task Verification

> This is the master plan that combines the improved V2 platform (Plan 1)
> with the Odoo-like ERP system (Plan 2) into a unified, AI-powered learning experience.
> After a user finishes lesson slides, they must complete a real task inside the ERP
> to mark the lesson as complete.

---

## Core Concept

```
Lesson Slides  →  ERP Task  →  AI Verification  →  Lesson Complete
    (learn)        (practice)      (grade)             (unlock next)
```

The learning loop has three stages:

1. **Learn**: User reads through lesson slides (existing V2 behavior)
2. **Practice**: After the last slide, a task is presented. The user must perform
   the task inside the embedded ERP window — clicking, typing, and navigating exactly
   as they would in a real Odoo instance
3. **Pass**: The AI reads the action log from the ERP and determines if the task was
   done correctly. On pass → lesson complete. On fail → retry with hints available.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Innovation Odoo AI Platform                   │
│                                                                 │
│  ┌──────────────┐   ┌────────────────────────────────────────┐  │
│  │  Lesson      │   │         Task + ERP Screen              │  │
│  │  Slides      │   │                                        │  │
│  │  (existing)  │   │  ┌──────────────┐  ┌────────────────┐ │  │
│  │              │──▶│  │  Task Panel  │  │  ERP Simulator │ │  │
│  │  slide 1     │   │  │  (left)      │  │  (right)       │ │  │
│  │  slide 2     │   │  │              │  │                │ │  │
│  │  ...         │   │  │  • Task desc │  │  Embedded ERP  │ │  │
│  │  slide N     │   │  │  • Steps     │  │  (full Odoo-   │ │  │
│  │              │   │  │  • AI chat   │  │   like UI)     │ │  │
│  └──────────────┘   │  │  • Hint btn  │  │                │ │  │
│                      │  └──────────────┘  └────────────────┘ │  │
│                      └────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                   Action Log (IndexedDB)
                              │
                    ┌─────────▼─────────┐
                    │  AI Verification   │
                    │  (Claude API)      │
                    │                   │
                    │  Reads action log  │
                    │  Compares to task  │
                    │  criteria          │
                    │  Returns: pass /   │
                    │  fail / partial    │
                    └───────────────────┘
```

---

## Screen Layout: Task + ERP View

When a user reaches the end of a lesson's slides and a task is assigned,
the screen transitions to a **split-screen Task+ERP view**:

```
┌──────────────────────────────────────────────────────────────────────┐
│  ← Back to Slides    Lesson: CRM    Task 1 of 1        [Submit Task]  │
│──────────────────────────────────────────────────────────────────────│
│  ┌─────────────────────┐  ┌────────────────────────────────────────┐  │
│  │   TASK PANEL (30%)  │  │        ERP WINDOW (70%)                │  │
│  │                     │  │                                        │  │
│  │  📋 Your Task       │  │  ┌─────────────────────────────────┐  │  │
│  │  ─────────────────  │  │  │  🟣 Innovation ERP              │  │  │
│  │  Create a new CRM   │  │  │  ──────────────────────────────  │  │  │
│  │  lead for a company │  │  │  CRM  >  Pipeline               │  │  │
│  │  called "TechCorp"  │  │  │                                 │  │  │
│  │  with €5,000        │  │  │  [Kanban cards...]              │  │  │
│  │  expected revenue   │  │  │                                 │  │  │
│  │  and assign it to   │  │  │                                 │  │  │
│  │  yourself.          │  │  │                                 │  │  │
│  │                     │  │  │                                 │  │  │
│  │  📝 Steps           │  │  └─────────────────────────────────┘  │  │
│  │  ─────────────────  │  │                                        │  │
│  │  1. Go to CRM app   │  │                                        │  │
│  │  2. Click New       │  └────────────────────────────────────────┘  │
│  │  3. Fill the form   │                                              │
│  │  4. Save            │                                              │
│  │                     │                                              │
│  │  💬 Ask AI for help │                                              │
│  │  ─────────────────  │                                              │
│  │  [Type a question]  │                                              │
│  │  [Send]             │                                              │
│  │                     │                                              │
│  │  💡 [Get a Hint]    │                                              │
│  └─────────────────────┘                                              │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Task Panel Specification

### Task Panel — Left Side (30% width)

The task panel has four sections, always visible:

#### 1. Task Description
- Short, plain-language task brief (2–4 sentences)
- The exact goal the user must achieve
- Example: *"Your sales manager has asked you to log a new opportunity for TechCorp.
  Create the lead in the CRM pipeline with the following details..."*

#### 2. Step-by-Step Instructions
- A numbered list of steps, each 1 sentence
- Steps are shown collapsed by default, expandable on click
- Each step has a checkbox that auto-checks when the action log shows the step was performed
- Completed steps are struck through with a green checkmark
- Example:
  ```
  ✅ 1. Navigate to the CRM app
  ✅ 2. Click "New" to create a lead
  ☐  3. Enter "TechCorp" in the Company Name field
  ☐  4. Set Expected Revenue to €5,000
  ☐  5. Assign yourself as Salesperson
  ☐  6. Click Save
  ```

#### 3. AI Help Chat
- A small chat window at the bottom of the task panel
- Context-aware: the AI knows the current lesson topic and task description
- The AI will NOT give away the answer directly — it guides and nudges
- Example AI responses:
  - User: "Where do I find CRM?" → AI: "Look at the top navigation bar. You should see an app grid icon — click it to see all available apps."
  - User: "I created the lead but how do I save?" → AI: "Great progress! Look for the save button in the top-left of the form. It looks like a floppy disk icon or a cloud save button."

#### 4. Hint Button
- "💡 Get a Hint" button, available at any time
- Each hint highlights a specific element in the ERP window:
  - A pulsing purple ring appears around the target element
  - A tooltip appears with a short instruction
- Hints are graduated (first hint = broad area, second = specific element, third = exact field)
- Hint usage is tracked; using hints reduces the "score" for gamification (does not block completion)
- After 3 hints, a "Show me" button appears that auto-navigates the ERP to the right screen

---

## ERP Window Specification

### ERP Window — Right Side (70% width)

The ERP window is a full React app mounted in the right panel.
It is the same ERP built in Plan 2, but with these additions when in task mode:

#### Hint Overlay System
When a hint is triggered from the task panel, the ERP overlay system activates:

```js
// ERP exposes a global hint API
window.erpHighlight({
  selector: '[data-erp="new-button"]',  // CSS selector or data attribute
  message: "Click this button to create a new lead",
  duration: 5000   // ms, then auto-dismiss
});
```

Implementation:
- Every interactive element in the ERP has a `data-erp="..."` attribute
- e.g. `data-erp="new-button"`, `data-erp="crm-pipeline"`, `data-erp="field-name"`
- The hint overlay draws an animated purple ring around the target element using
  `getBoundingClientRect()` and an absolutely positioned `<div>` overlay

#### Task Mode Flag
When mounted inside the task view, the ERP receives a `taskMode={true}` prop:
- Disables the "Exit" / "Go to another app" shortcuts that would break the task
- Shows a subtle "🎯 Task Mode" badge in the top-right corner of the ERP navbar
- The app switcher shows only apps relevant to the current lesson section

#### Navigation Lock (optional, configurable per task)
For beginner tasks: navigation is locked to the relevant module
For advanced tasks: all modules are unlocked (user must find the right place themselves)

---

## Task Assignment System

### Where Tasks Live

Each lesson in the learning platform has an associated task definition stored in the backend:

```python
class LessonTask(models.Model):
    lesson_file       = OneToOneField(LearningFile, on_delete=CASCADE)
    task_title        = CharField(max_length=200)
    task_description  = TextField()   # shown to user
    steps             = JSONField()   # list of {step_number, text, erp_action_key}
    verification_criteria = JSONField()  # list of criteria for AI to check
    hint_1            = TextField()
    hint_2            = TextField()
    hint_3            = TextField()
    hint_1_selector   = CharField()   # data-erp="" selector for highlight
    hint_2_selector   = CharField()
    hint_3_selector   = CharField()
    erp_module        = CharField()   # which ERP module to open first
    erp_start_url     = CharField()   # e.g. "/erp/crm/pipeline/"
    nav_locked        = BooleanField(default=False)
    difficulty        = CharField(choices=['easy','medium','hard'])
```

### Example Task Definitions

**Lesson: CRM** → Task:
```json
{
  "task_title": "Create your first CRM lead",
  "task_description": "A prospective client called TechCorp has expressed interest. Create a new lead in the CRM pipeline with €5,000 expected revenue and assign it to yourself.",
  "steps": [
    { "step": 1, "text": "Navigate to the CRM app", "erp_action_key": "navigate:crm" },
    { "step": 2, "text": "Click 'New' to create a lead", "erp_action_key": "click:new-button:crm.lead" },
    { "step": 3, "text": "Enter 'TechCorp' in the Company Name field", "erp_action_key": "edit:field-partner_name:TechCorp" },
    { "step": 4, "text": "Set Expected Revenue to 5000", "erp_action_key": "edit:field-expected_revenue:5000" },
    { "step": 5, "text": "Assign yourself as Salesperson", "erp_action_key": "edit:field-user_id:self" },
    { "step": 6, "text": "Save the record", "erp_action_key": "click:save-button" }
  ],
  "verification_criteria": [
    "A new CRM lead record was created",
    "The partner_name field contains 'TechCorp' (case-insensitive)",
    "The expected_revenue field is set to 5000",
    "The user_id is set to the current user"
  ],
  "hint_1": "Start by finding the CRM app in the app menu",
  "hint_1_selector": "[data-erp='app-switcher']",
  "hint_2": "You are now in CRM. Look for the button to create something new",
  "hint_2_selector": "[data-erp='new-button']",
  "hint_3": "Fill in the Company Name field with the customer's name",
  "hint_3_selector": "[data-erp='field-partner_name']",
  "erp_module": "crm",
  "erp_start_url": "/erp/crm/pipeline/"
}
```

---

## AI Verification Engine

### Endpoint

```
POST /api/tasks/verify/
Body: {
  lesson_id:    int,
  action_log:   [ ...action entries from ERP IndexedDB... ],
  hint_count:   int
}
Response: {
  passed:       bool,
  score:        int,        // 0-100
  feedback:     string,     // AI explanation of what was done right/wrong
  missing:      [ string ]  // list of criteria that weren't met
}
```

### Verification Logic

The backend sends the action log + task criteria to Claude API with this prompt structure:

```python
VERIFY_PROMPT = """
You are an Odoo task verification engine.

TASK: {task_description}

VERIFICATION CRITERIA (ALL must be met to pass):
{criteria_list}

USER ACTION LOG (everything the user did in the ERP):
{action_log_json}

CURRENT ERP STATE (snapshot of relevant records):
{erp_state_json}

Evaluate whether the user completed the task correctly.

Respond ONLY with this JSON (no markdown, no extra text):
{
  "passed": true|false,
  "score": 0-100,
  "feedback": "1-2 sentences explaining the result",
  "missing": ["criterion that was not met", ...]
}

Rules:
- "passed" is true ONLY if ALL verification criteria are met
- "score" is 100 if passed with no hints, reduce by 10 per hint used
- "feedback" should be encouraging even on failure — mention what they did right
- "missing" lists only the unmet criteria, empty array if passed
"""
```

### Step Auto-Check Logic
While the user is working (before submission), the frontend periodically reads the
action log and auto-checks steps:

```js
// Every 2 seconds, compare action log against step erp_action_keys
useEffect(() => {
  const interval = setInterval(() => {
    const log = readActionLog();
    const checkedSteps = steps.map(step => ({
      ...step,
      completed: isStepCompleted(step.erp_action_key, log)
    }));
    setSteps(checkedSteps);
  }, 2000);
  return () => clearInterval(interval);
}, []);
```

---

## Task Completion Flow

```
User finishes last slide
        │
        ▼
Task screen loads
ERP opens to erp_start_url
        │
        ▼
User performs task in ERP
Steps auto-check as user works
        │
        ▼
User clicks "Submit Task"
        │
        ▼
Action log + ERP state sent to backend
Claude API verifies
        │
     ┌──┴──┐
   Pass   Fail
     │      │
     ▼      ▼
Lesson  Show feedback
Complete  + retry button
     │      │
     ▼      ▼
Confetti  User can retry
animation  (unlimited)
     │      │
  "Next    "Try Again"
  Lesson"  button
```

### On Pass
- Mark lesson as `completed` in progress model
- Show animated success screen:
  - Green checkmark animation
  - Score displayed (e.g. 90/100 — deducted for hints)
  - AI feedback message ("Great job! You correctly created the CRM lead...")
  - "Next Lesson →" button

### On Fail
- Show which criteria were missed
- AI writes a specific, encouraging feedback message
- "Try Again" button resets the ERP to seed state for this task
- User can also click "Skip Task (no score)" to proceed without completing

---

## Backend Changes Required

### New Models

```python
class LessonTask(models.Model):
    """One task per lesson file"""
    lesson_file          = OneToOneField(LearningFile)
    task_title           = CharField(max_length=200)
    task_description     = TextField()
    steps                = JSONField()
    verification_criteria = JSONField()
    hints                = JSONField()    # [{text, selector}, ...]
    erp_module           = CharField()
    erp_start_url        = CharField()
    nav_locked           = BooleanField(default=False)
    difficulty           = CharField()

class TaskAttempt(models.Model):
    """Each time a user tries a task"""
    user         = ForeignKey(User)
    lesson_task  = ForeignKey(LessonTask)
    attempt_num  = IntegerField(default=1)
    passed       = BooleanField(default=False)
    score        = IntegerField(default=0)
    hint_count   = IntegerField(default=0)
    action_log   = JSONField()
    feedback     = TextField()
    attempted_at = DateTimeField(auto_now_add=True)
    passed_at    = DateTimeField(null=True)
```

### New API Endpoints

```
GET  /api/tasks/:lesson_id/           → get task for a lesson
POST /api/tasks/verify/               → submit action log for AI verification
GET  /api/tasks/:lesson_id/attempts/  → get user's attempt history
```

### Changed: Progress Update
When a task is passed:
```python
# /api/progress/update/ accepts a new field:
{ "file_id": 12, "slide_index": 5, "task_completed": true, "task_score": 90 }
```
Lesson is only marked `completed` if both slides are finished AND task is passed.

---

## Frontend Changes Required

### New Page: `TaskPage` (`/course/:fileId/task`)
This is the split-screen Task + ERP view described above.

File structure:
```
/src/pages/task/
  TaskPage.jsx          ← layout: TaskPanel (left) + ERPWindow (right)
  TaskPanel.jsx         ← task desc, steps, AI chat, hint button
  ERPWindow.jsx         ← mounts the ERP React app
  useTaskVerification.js ← hook: sends log to backend, handles response
  useStepAutoCheck.js   ← hook: auto-checks steps against action log
  useHintSystem.js      ← hook: triggers ERP highlight via postMessage
```

### Changed: `CoursePage.jsx`
- After last slide: instead of showing the "Lesson Complete" overlay immediately,
  check if a task exists for this lesson
- If task exists → navigate to `/course/:fileId/task`
- If no task → show existing "Lesson Complete" overlay

### ERP ↔ Task Panel Communication
The ERP iframe/window communicates with the task panel using `window.postMessage`:

```js
// ERP sends action log updates to the task panel
window.parent.postMessage({
  type: 'ERP_ACTION',
  payload: { ...actionEntry }
}, '*');

// Task panel sends hint commands to the ERP
erpWindow.contentWindow.postMessage({
  type: 'HINT_TRIGGER',
  payload: { selector: '[data-erp="new-button"]', message: '...' }
}, '*');
```

---

## Task Content — Generation Plan

Tasks need to be written for all 81 lessons. Strategy:

### Auto-generated using Claude API (offline, one-time)
Run a batch job that, for each lesson file:
1. Reads the lesson's RST content
2. Calls Claude API with prompt: *"Based on this Odoo lesson content, generate a realistic,
   practical task that a user can perform inside an Odoo-like ERP system.
   Return the task as JSON matching the LessonTask schema."*
3. Saves the generated task to the database
4. Human review pass to refine and approve

### Intro lessons (no task)
Intro lessons (lesson_type = "intro") do not require tasks — they auto-complete
when all slides are viewed.

### Task Difficulty Distribution
- Section 1 (Essentials): easy (navigating, basic config)
- Sections 2–4: easy to medium
- Sections 5–6: medium (multi-step workflows)
- Sections 7–9: medium to hard (multi-module tasks)

---

## Overall Progress & Scoring

The platform now tracks a richer progress model:

```
Lesson Status: not_started → in_progress → slides_done → completed
                                                 ↑
                                    (task must be passed)
```

Dashboard shows:
- Overall % completion (based on completed lessons only)
- Average task score across all passed lessons
- Hint usage rate (lower = better)
- "Tasks passed on first attempt: 14/20"

---

## Development Timeline

| Phase | Scope                                          | Duration  |
|-------|------------------------------------------------|-----------|
| P1    | V2 critical fixes (Plan 1, Phase 1)            | Week 1    |
| P2    | V2 UX improvements (Plan 1, Phases 2–4)        | Week 2–3  |
| P3    | ERP shell + infrastructure (Plan 2, Phase A)   | Week 4–5  |
| P4    | ERP core modules — CRM, Sales, HR, Inventory   | Week 6–7  |
| P5    | ERP remaining 35 modules                       | Week 8–10 |
| P6    | Task system backend (models, endpoints)        | Week 11   |
| P7    | Task UI (TaskPage, TaskPanel, ERPWindow)        | Week 12   |
| P8    | AI verification engine                         | Week 13   |
| P9    | Hint system + step auto-check                  | Week 14   |
| P10   | Task content generation (all 81 lessons)       | Week 15   |
| P11   | V2 remaining improvements (Plan 1, Phases 5–7) | Week 16   |
| P12   | QA, mobile testing, performance                | Week 17   |
| P13   | Beta launch, feedback, hotfixes                | Week 18   |

---

## Key Design Principles

1. **Never block progress** — users can always skip a task and continue. The platform
   teaches, it doesn't gate. Skipping reduces score but doesn't lock the next lesson.

2. **AI guides, doesn't give away** — the AI help chat always nudges toward discovery
   rather than telling the user exactly what to click. The hint system handles explicit guidance.

3. **ERP is realistic but forgiving** — seed data is clean, errors don't cascade,
   "Reset Demo Data" is always available. No stress from accidental deletions.

4. **Every action is logged** — the action log is the source of truth for verification.
   No magic flags or hidden state. If the user did it, it's in the log.

5. **Fast feedback loop** — verification happens in under 3 seconds. The user never
   waits more than 3 seconds to know if they passed.
