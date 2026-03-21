# Innovation Odoo AI — Plan V3
**Client:** Ahmad Al Zoubi | **Programmer:** Obadah Abuodeh | **Version:** 3.0  
**Domain:** innovation-odoo-ai.com | **Stack:** Django 4 + DRF + PostgreSQL | React 18 + Vite + Tailwind

---

## What Changed from V2

| V2 | V3 |
|---|---|
| Simulation panel built by us (pre-programmed screens, pulsing highlights, JSON steps) | Real Odoo UI embedded via iframe inside the course page |
| Simulation code connected to GitHub repo | Simulation code archived locally — preserved for the future **Innovation ERP** project |
| Simulated clicks tracked via `sim-el-*` CSS selectors | User interacts with the real Odoo instance; describes what they did; AI assesses |
| `VITE_ODOO_*` env vars not used | `VITE_ODOO_BASE_URL` controls which Odoo instance is loaded (test vs. production) |

**Testing Odoo URL:** `https://mtab.odoo.com/odoo`  
**Production Odoo URL:** TBD — a dedicated instance with a seed DB that allows iframe embedding

---

## ⚠️ Critical Technical Note — iframe Embedding

Odoo SaaS instances (including `*.odoo.com`) set the HTTP header `X-Frame-Options: SAMEORIGIN`, which **blocks iframe embedding** in any other origin. This is enforced by the browser and cannot be bypassed from the frontend.

**For testing (`mtab.odoo.com`):** The iframe will likely be blocked. The panel will detect this and fall back to a side-by-side mode — a clearly styled link button that opens Odoo in a new tab, while the task instructions and AI chat remain on the platform.

**For production:** The Odoo instance must be self-hosted or configured to remove/relax the `X-Frame-Options` header. This is done in the Odoo server's reverse-proxy (nginx) config:
```nginx
# Remove the blocking header and allow your domain
add_header X-Frame-Options "ALLOW-FROM https://innovation-odoo-ai.com";
# Or, for modern browsers, use CSP:
add_header Content-Security-Policy "frame-ancestors 'self' https://innovation-odoo-ai.com;";
```
**This configuration must be done by whoever sets up the production Odoo instance before deployment.**

---

## Step 1 — Archive the Simulation Code

**Goal:** Preserve all simulation work as source for the future Innovation ERP project. Remove it from active use in this project.

**What to do:**
1. Create a new folder at the repo root: `_archive/erp-simulation/`
2. Move the following into it — do **not** delete them from Git history:

**Files/folders to move to `_archive/erp-simulation/`:**

| Original Location | Description |
|---|---|
| `frontend/src/components/simulation/` | All SimLesson components, SimController, simulation CSS |
| `frontend/src/styles/simulation.css` (if separate) | Simulation highlight styles (`sim-el-*`) |
| `lesson_1.json` → `lesson_81.json` | All 81 lesson simulation JSON files |
| `all_steps.json` | Master steps file |
| Any `sim_*.py` backend files (if they exist) | Backend simulation helpers |

3. Add a `README.md` inside `_archive/erp-simulation/` explaining:
   - What this code is
   - That it is the starting point for the **Innovation ERP** project
   - The JSON format for lesson steps (`screen_key`, `elements`, `related_steps`)

**Files to create:**
- `_archive/erp-simulation/README.md`

**Files to edit:**
- None yet — just moves. No active code touched in this step.

---

## Step 2 — Remove Simulation Imports from the Frontend

**Goal:** Clean up `CoursePage.jsx` and any other active files that still reference simulation components.

**Files to edit:**

### `frontend/src/pages/course/CoursePage.jsx`
- Remove any `import SimController from ...` or `import SimLesson from ...` lines
- Remove any JSX blocks that render `<SimController />` or `<SimLesson />` (the practical task section placeholder from V2)
- Keep the rest of the slide viewer, AI panel, completion screen intact
- The slot where the simulation was shown will be replaced by the `OdooPanel` component in Step 5

### `frontend/src/App.jsx`
- Remove any routes that pointed to simulation pages (if any exist)
- No other changes needed here

### `frontend/src/styles/` or any global CSS file
- Remove any `sim-el-*` CSS selectors (pulsing orange highlight rules)
- If these are in a standalone `simulation.css` file, just remove the import — the file itself moves to the archive

---

## Step 3 — Add Odoo URL Configuration (Environment Variables)

**Goal:** Make the Odoo instance URL configurable so switching between test and production is a single env-var change.

**Files to edit:**

### `frontend/.env.development`
```env
VITE_ODOO_BASE_URL=https://mtab.odoo.com/odoo
```

### `frontend/.env.production`
```env
VITE_ODOO_BASE_URL=https://<production-odoo-domain>/odoo
```
*(Replace with the real production URL when the seeded Odoo instance is ready)*

### `frontend/src/config.js` (create if it doesn't exist, or add to existing)
```js
export const ODOO_BASE_URL = import.meta.env.VITE_ODOO_BASE_URL || 'https://mtab.odoo.com/odoo';
```

**Files to create:**
- `frontend/.env.development` (if it doesn't exist)
- `frontend/.env.production` (if it doesn't exist)

---

## Step 4 — Backend: Add Odoo Path and Task Fields to LearningFile

**Goal:** Each lesson needs to know (a) which Odoo screen to open, and (b) what task to give the user.

**Files to edit:**

### `backend/content/models.py`
Add two new fields to the `LearningFile` model:

```python
class LearningFile(models.Model):
    # ... existing fields ...

    # V3 additions
    odoo_path = models.CharField(
        max_length=255,
        blank=True,
        default='',
        help_text="Odoo URL path for this lesson's practical task. e.g. /odoo/crm, /odoo/accounting/invoices"
    )
    odoo_task = models.TextField(
        blank=True,
        default='',
        help_text="Plain-text description of the practical task the user must complete in Odoo."
    )
```

### `backend/content/migrations/` — New migration file
Run `python manage.py makemigrations content` after editing the model.  
This will auto-generate a migration file like `0005_learningfile_odoo_path_odoo_task.py`.

### `backend/content/admin.py`
Add `odoo_path` and `odoo_task` to the `LearningFileAdmin` class so they can be filled in from the Django admin panel:

```python
class LearningFileAdmin(admin.ModelAdmin):
    list_display = ['title', 'section', 'lesson_type', 'odoo_path']
    search_fields = ['title', 'odoo_path']
    fieldsets = (
        (None, {'fields': ('section', 'title', 'file_path', 'lesson_type', 'order')}),
        ('V3 — Odoo Practical Task', {'fields': ('odoo_path', 'odoo_task'), 'classes': ('wide',)}),
    )
```

### `backend/content/serializers.py`
Add `odoo_path` and `odoo_task` to the `LearningFileSerializer` (or whichever serializer is used in the slides endpoint):

```python
class LearningFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningFile
        fields = [..., 'odoo_path', 'odoo_task']
```

---

## Step 5 — Backend: Update the Slides Endpoint to Return Task Data

**Goal:** The frontend needs to receive `odoo_path` and `odoo_task` in the same call it uses to load the lesson, so no extra API round trip is needed.

**Files to edit:**

### `backend/content/views.py` — `LessonSlidesView`
The `GET /api/content/files/<id>/slides/` response should include the file-level `odoo_path` and `odoo_task`.  

Update the response to wrap slides in a richer envelope:

```python
# Before (simplified):
return Response({'slides': slides_data})

# After:
return Response({
    'slides': slides_data,
    'odoo_path': file_obj.odoo_path,
    'odoo_task': file_obj.odoo_task,
})
```

No new endpoint is needed — the existing slides endpoint is extended.

---

## Step 6 — Backend: AI Task Assessment Endpoint

**Goal:** After the user completes the Odoo task, they write a short description of what they did. GPT-4o reviews it against the expected task and gives feedback.

**Files to edit:**

### `backend/content/views.py`
Add a new view `TaskAssessView`:

```python
class TaskAssessView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file_id = request.data.get('file_id')
        user_description = request.data.get('user_description', '')
        
        file_obj = get_object_or_404(LearningFile, id=file_id)
        expected_task = file_obj.odoo_task

        system_prompt = (
            "You are an Odoo training evaluator. "
            "The student was asked to complete a practical task in Odoo. "
            "Evaluate their description, tell them what they did correctly, "
            "what was missing, and give them the exact steps to complete the task properly. "
            "Be encouraging and specific. Keep your response under 200 words."
        )
        user_prompt = (
            f"Expected task:\n{expected_task}\n\n"
            f"Student's description of what they did:\n{user_description}"
        )

        # Call GPT-4o (same pattern as existing tutor/simplify views)
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=400,
        )
        feedback = response.choices[0].message.content
        return Response({'feedback': feedback})
```

### `backend/core/urls.py`
Add the new route:
```python
path('api/content/task/assess/', TaskAssessView.as_view(), name='task-assess'),
```

---

## Step 7 — Frontend: Build the OdooPanel Component

**Goal:** A self-contained component that shows the task instructions, embeds the Odoo iframe, detects if the iframe is blocked, and provides the AI assessment chat.

**Files to create:**

### `frontend/src/components/course/OdooPanel.jsx`

This component handles three states:
1. **Loading** — trying to load the iframe
2. **Embedded** — iframe loaded successfully; full Odoo UI visible
3. **Blocked** — iframe was blocked (X-Frame-Options); show a styled fallback with an "Open Odoo" button and the task instructions

```jsx
import { useState, useRef, useEffect } from 'react';
import { ODOO_BASE_URL } from '../../config';
import axios from '../api/client'; // existing Axios instance

export default function OdooPanel({ fileId, odooPath, odooTask }) {
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [userDescription, setUserDescription] = useState('');
  const [feedback, setFeedback] = useState('');
  const [assessing, setAssessing] = useState(false);
  const iframeRef = useRef(null);

  const odooUrl = odooPath ? `${ODOO_BASE_URL}${odooPath}` : ODOO_BASE_URL;

  // Detect iframe block: if onLoad fires but contentDocument is null, it was blocked
  const handleIframeLoad = () => {
    try {
      // Accessing contentDocument will throw if cross-origin blocked
      const doc = iframeRef.current?.contentDocument;
      if (!doc) setIframeBlocked(true);
      else setIframeLoaded(true);
    } catch {
      setIframeBlocked(true);
    }
  };

  const handleAssess = async () => {
    if (!userDescription.trim()) return;
    setAssessing(true);
    try {
      const res = await axios.post('/api/content/task/assess/', {
        file_id: fileId,
        user_description: userDescription,
      });
      setFeedback(res.data.feedback);
    } catch {
      setFeedback('Could not get feedback. Please try again.');
    } finally {
      setAssessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Task Instructions */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <h3 className="font-semibold text-purple-800 mb-1 text-sm">🎯 Your Task</h3>
        <p className="text-sm text-gray-700 whitespace-pre-line">{odooTask || 'Explore this module in Odoo.'}</p>
      </div>

      {/* Odoo Embed or Fallback */}
      {!iframeBlocked ? (
        <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 min-h-[400px]">
          <iframe
            ref={iframeRef}
            src={odooUrl}
            className="w-full h-full"
            title="Odoo"
            onLoad={handleIframeLoad}
            onError={() => setIframeBlocked(true)}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center min-h-[200px]">
          <p className="text-sm text-gray-500 mb-3">
            Odoo can't be embedded here due to browser security restrictions.
            <br />Open it in a new tab to complete your task.
          </p>
          <a
            href={odooUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#714B67] text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-[#5a3a52] transition"
          >
            Open Odoo ↗
          </a>
        </div>
      )}

      {/* AI Task Assessment */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <h3 className="font-semibold text-gray-700 mb-2 text-sm">🤖 Task Check</h3>
        <p className="text-xs text-gray-400 mb-2">Describe what you did in Odoo and get AI feedback.</p>
        <textarea
          value={userDescription}
          onChange={(e) => setUserDescription(e.target.value)}
          rows={3}
          placeholder="e.g. I opened CRM, clicked on a lead, then scheduled a call activity with a due date..."
          className="w-full border border-gray-200 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
        <button
          onClick={handleAssess}
          disabled={assessing || !userDescription.trim()}
          className="mt-2 w-full bg-[#714B67] text-white text-sm py-2 rounded-lg hover:bg-[#5a3a52] disabled:opacity-50 transition"
        >
          {assessing ? 'Checking…' : 'Check my work'}
        </button>
        {feedback && (
          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-line">
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## Step 8 — Frontend: Wire OdooPanel into CoursePage

**Goal:** After the user reaches the last slide and sees the completion screen, show the OdooPanel for the practical task.

**Files to edit:**

### `frontend/src/pages/course/CoursePage.jsx`

1. **Import OdooPanel** at the top:
   ```jsx
   import OdooPanel from '../../components/course/OdooPanel';
   ```

2. **Store `odoo_path` and `odoo_task` from the slides API response:**
   ```js
   // In the useEffect that fetches slides:
   const data = await axios.get(`/api/content/files/${fileId}/slides/`);
   setSlides(data.data.slides);
   setOdooPath(data.data.odoo_path);   // new state
   setOdooTask(data.data.odoo_task);   // new state
   ```
   Add the two state variables:
   ```js
   const [odooPath, setOdooPath] = useState('');
   const [odooTask, setOdooTask] = useState('');
   ```

3. **Show OdooPanel after the last slide.** In the JSX, after the completion screen section (or alongside it), add:
   ```jsx
   {isOnLastSlide && (
     <div className="mt-6">
       <OdooPanel
         fileId={fileId}
         odooPath={odooPath}
         odooTask={odooTask}
       />
     </div>
   )}
   ```
   *(Replace `isOnLastSlide` with whatever boolean the component already uses to detect the last slide — e.g. `currentIndex === slides.length - 1`)*

4. **Layout note:** The OdooPanel is wide and needs space. If the course page uses a split layout (slides left / AI panel right), consider showing OdooPanel below the slides in full width on the last slide, so the Odoo iframe has enough room.

---

## Step 9 — Populate Odoo Paths and Tasks for Each Lesson (Admin / Data Entry)

**Goal:** Fill in `odoo_path` and `odoo_task` for all 91 lessons via the Django admin panel.

**No new code needed.** This is a data-entry task done in the admin after Step 4 is deployed.

**Reference path mapping** (from the archived JSON files):

| Lesson Topic | `odoo_path` value |
|---|---|
| CRM / Activities | `/odoo/crm` |
| Contacts | `/odoo/contacts` |
| Accounting / Invoices | `/odoo/accounting/invoices` |
| Inventory | `/odoo/inventory` |
| Purchase | `/odoo/purchase` |
| Manufacturing | `/odoo/manufacturing` |
| Payroll | `/odoo/payroll` |
| Recruitment | `/odoo/recruitment` |
| Project | `/odoo/project` |
| Helpdesk | `/odoo/helpdesk` |
| Website | `/odoo/website` |
| *(and so on for all 91 lessons)* | |

**Workflow:**
1. Deploy backend changes (Steps 4–6)
2. Go to `<backend-url>/admin/content/learningfile/`
3. For each lesson: set `odoo_path` and write a 2–4 sentence `odoo_task` describing what the student must do

**The `odoo_task` field replaces what the old simulation JSON `instruction_text` fields described.** Use the archived `lesson_*.json` files as a reference for what each task should ask the user to do.

---

## Step 10 — Frontend: Update API Helper (if applicable)

**Goal:** Make sure the Axios call for slides correctly reads the new envelope shape.

**Files to edit:**

### `frontend/src/api/content.js` (or wherever the slides fetch lives)
If there's a dedicated API helper function for fetching slides, update it to return both slides and task info:

```js
export const fetchLessonSlides = async (fileId) => {
  const res = await apiClient.get(`/api/content/files/${fileId}/slides/`);
  return {
    slides: res.data.slides,
    odooPath: res.data.odoo_path,
    odooTask: res.data.odoo_task,
  };
};
```

---

## Step 11 — Deployment Configuration

**Goal:** Make sure the production environment points to the correct Odoo instance with iframe embedding enabled.

### `frontend/.env.production`
```env
VITE_ODOO_BASE_URL=https://<production-odoo-domain>/odoo
```

### Render (or hosting provider) — Backend env vars
No new backend env vars needed for Odoo. The Odoo URL is frontend-only.

### Production Odoo Server — nginx config (handled by Odoo server admin)
The production Odoo instance **must** have the following in its nginx config for the iframe to work:

```nginx
server {
    # ... existing config ...

    # Remove Odoo's default X-Frame-Options and replace with CSP
    proxy_hide_header X-Frame-Options;
    add_header Content-Security-Policy "frame-ancestors 'self' https://innovation-odoo-ai.com;";
}
```

Without this, the iframe fallback (open-in-new-tab mode) will be used even in production.

---

## Step 12 — QA Checklist

Before marking V3 complete, verify the following:

| Check | Expected Result |
|---|---|
| Simulation components are absent from the running app | No SimController, no sim-el-* highlights appear |
| Archive folder exists with all simulation files + README | `_archive/erp-simulation/` is intact |
| `LearningFile` model has `odoo_path` and `odoo_task` fields | Visible in Django admin |
| Slides API returns `odoo_path` and `odoo_task` | Confirmed via `/api/content/files/1/slides/` response |
| OdooPanel renders on the last slide of a lesson | Panel visible after clicking through all slides |
| Iframe loads when embedding is allowed | Odoo UI appears inside the panel |
| Fallback activates when iframe is blocked | "Open Odoo ↗" button appears, task instructions still shown |
| AI task assessment works | Submitting a description returns GPT-4o feedback |
| `VITE_ODOO_BASE_URL` switch works | Changing the env var changes which Odoo instance loads |
| All 91 lessons have `odoo_path` and `odoo_task` populated | No empty task panels in production |

---

## Summary of All Files Touched

### New Files Created
| File | Purpose |
|---|---|
| `_archive/erp-simulation/README.md` | Documents the archived simulation code for future Innovation ERP |
| `frontend/src/components/course/OdooPanel.jsx` | The Odoo embed + task instructions + AI assessment component |
| `frontend/src/config.js` | Exports `ODOO_BASE_URL` from env vars |
| `frontend/.env.development` | Dev env vars including `VITE_ODOO_BASE_URL` |
| `frontend/.env.production` | Prod env vars including `VITE_ODOO_BASE_URL` |
| `backend/content/migrations/0005_learningfile_odoo_path_odoo_task.py` | Auto-generated migration |

### Existing Files Edited
| File | Change |
|---|---|
| `frontend/src/pages/course/CoursePage.jsx` | Remove sim imports; add OdooPanel on last slide; read odoo_path/odoo_task from API |
| `frontend/src/App.jsx` | Remove any simulation routes |
| `frontend/src/api/content.js` | Update slides fetch helper to return task fields |
| `backend/content/models.py` | Add `odoo_path` and `odoo_task` to `LearningFile` |
| `backend/content/serializers.py` | Expose new fields in the serializer |
| `backend/content/views.py` | Return task fields from slides endpoint; add `TaskAssessView` |
| `backend/content/admin.py` | Add new fields to `LearningFileAdmin` |
| `backend/core/urls.py` | Add `/api/content/task/assess/` route |

### Files Moved to Archive (not deleted)
| File | Archive Destination |
|---|---|
| `frontend/src/components/simulation/` (all) | `_archive/erp-simulation/frontend/components/simulation/` |
| `lesson_1.json` – `lesson_81.json` | `_archive/erp-simulation/json/` |
| `all_steps.json` | `_archive/erp-simulation/json/` |
| Any `simulation.css` | `_archive/erp-simulation/frontend/styles/` |

---

*innovation-odoo-ai.com | Plan V3 | Confidential*
