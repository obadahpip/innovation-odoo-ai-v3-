# Plan 2 — Innovation ERP System (Odoo-Like, 57 Apps)

> A fully custom ERP system built to mirror Odoo's UI, UX, and functional behaviour.
> This system is embedded inside the learning platform as the simulation environment.
> The frontend will replicate Odoo's visual language exactly using provided screen scores.

---

## Architecture Philosophy

This ERP is **not a real ERP** — it is a **high-fidelity functional simulation** designed to:
1. Look and behave exactly like real Odoo so learners practice on something authentic
2. Expose a JavaScript API that the AI task engine can read and write
3. Track every user action for task verification by the AI
4. Be modular — each of the 57 apps is an independent module that can be activated/deactivated

The ERP runs **entirely in the browser** (React, no backend calls for simulation state).
The AI verification layer calls the backend, which calls Claude API.

---

## Tech Stack

| Layer              | Technology                                             |
|--------------------|--------------------------------------------------------|
| ERP Frontend       | React 19, Vite, Tailwind CSS                           |
| State Management   | Zustand (one store per app module)                     |
| Routing            | React Router v7 (nested routes mirroring Odoo URLs)    |
| Data Persistence   | IndexedDB via `idb` library (survives page refresh)    |
| AI Verification    | Anthropic Claude API via learning platform backend     |
| UI Components      | Custom components replicating Odoo's design system     |

---

## Odoo Visual Language to Replicate

Based on the provided screen scores, the ERP must replicate:

### Layout System
- **Top navbar**: App switcher (grid icon), breadcrumb trail, search bar, settings gear, debug icon, user avatar
- **Left sidebar**: App-specific menu items with expandable sub-menus
- **Main area**: List view / Kanban view / Form view / Calendar view tabs
- **Status bar**: Breadcrumb inside forms, stage pipeline bar at the top of forms
- **Action buttons**: "New", "Save", "Discard", "Action" dropdown, "⚙ Cog" button
- **Chatter**: Message thread + log note + activity panel at the bottom of every form

### Color System (must match Odoo exactly)
```css
--odoo-purple:       #714B67;   /* primary brand */
--odoo-purple-light: #a26b94;
--odoo-success:      #28a745;
--odoo-warning:      #f0ad4e;
--odoo-danger:       #dc3545;
--odoo-info:         #17a2b8;
--odoo-sidebar-bg:   #f8f5f5;   /* light pink-gray sidebar */
--odoo-navbar-bg:    #714B67;   /* purple top bar */
--odoo-form-bg:      #ffffff;
--odoo-list-hover:   #f5f0f5;
--odoo-border:       #dee2e6;
--odoo-text:         #495057;
--odoo-muted:        #6c757d;
```

### View Types (must implement all four)
1. **List View**: sortable columns, checkbox multi-select, inline edit on click, group-by headers
2. **Kanban View**: draggable cards between columns/stages, card customization, color dots
3. **Form View**: tab panels, many2one dropdowns, many2many tags, one2many inline tables, binary fields (file/image upload)
4. **Calendar View**: month/week/day toggle, drag-to-reschedule events

---

## Module Architecture

Each of the 57 apps is a **module** with this structure:

```
/erp/modules/
  {module_name}/
    index.jsx          ← module entry, exports routes + store
    store.js           ← Zustand store with initial seed data
    routes.jsx         ← React Router routes for this module
    views/
      ListView.jsx
      KanbanView.jsx
      FormView.jsx
    components/        ← module-specific components
    seed.js            ← realistic fake data for this module
```

---

## Module List & Specification

### Section 1 — Essentials & Settings (Platform-level, always active)

| Module              | Key Records / Views                                        |
|---------------------|------------------------------------------------------------|
| **Settings**        | Company config, user preferences, technical settings menu  |
| **Contacts**        | List + form, partner types (company/individual), tags      |
| **Users**           | List, form, access rights matrix, groups                   |
| **Companies**       | Multi-company setup, switch company                        |
| **Apps & Modules**  | App store grid, installed indicator, search                |
| **Developer Mode**  | Toggle in settings, debug icon in navbar                   |
| **Studio**          | Field editor overlay, view editor, model creator           |
| **IoT**             | IoT boxes list, device pairing form                        |

### Section 2 — Finance (6 modules)

| Module                   | Key Records / Views                                             |
|--------------------------|-----------------------------------------------------------------|
| **Accounting**           | Journal entries, invoices (customer+vendor), chart of accounts, bank reconciliation, P&L report |
| **Expenses**             | Expense form, expense report, submit/approve/refuse workflow   |
| **Payment Providers**    | Provider config cards (Stripe, PayPal placeholders)            |
| **Fiscal Localizations** | Country localization selector, tax templates                   |
| **ESG**                  | Sustainability goals list, KPI tracking form                   |
| **In-App Purchase**      | IAP service credits display                                    |

### Section 3 — Sales (5 modules)

| Module            | Key Records / Views                                              |
|-------------------|------------------------------------------------------------------|
| **CRM**           | Pipeline kanban (stages: New/Qualified/Proposition/Won/Lost), lead form, activities |
| **Sales**         | Quotations list, sales order form, confirm order → delivery flow |
| **Point of Sale** | POS session, product grid, payment screen, receipts             |
| **Subscriptions** | Subscription list, recurring billing form, churn tracking       |
| **Rental**        | Rental orders, availability calendar, return flow               |

### Section 4 — Websites (6 modules)

| Module            | Key Records / Views                                              |
|-------------------|------------------------------------------------------------------|
| **Website**       | Page list, SEO config form, menu editor                         |
| **eCommerce**     | Product catalog, shop config, order management                  |
| **Live Chat**     | Channel list, chat widget config, operator assignment           |
| **eLearning**     | Course list, slide deck form, enrollment tracking               |
| **Forum**         | Post list, tag management, moderation queue                     |
| **Blog**          | Blog list, post editor (rich text), tag and category management |

### Section 5 — Supply Chain (8 modules)

| Module              | Key Records / Views                                              |
|---------------------|------------------------------------------------------------------|
| **Inventory**       | Product list, stock moves, receipts, delivery orders, warehouse config |
| **Purchase**        | RFQ list, purchase order form, vendor bill link, receipt        |
| **Manufacturing**   | MO list, BoM form, work orders, quality checks inside MO        |
| **Barcode**         | Barcode scanning simulation (input field), operation picker     |
| **Quality**         | Quality points list, quality check form, failure/pass workflow  |
| **Maintenance**     | Equipment list, maintenance request form, calendar              |
| **Repairs**         | Repair order form, parts list, diagnosis, invoice link          |
| **PLM**             | ECO list (Engineering Change Order), BOM version control        |

### Section 6 — Human Resources (10 modules)

| Module           | Key Records / Views                                              |
|------------------|------------------------------------------------------------------|
| **Employees**    | Employee directory, employee form (all tabs: work, private, HR settings), org chart |
| **Payroll**      | Payslip list, payslip form, salary rules, batch payslip run     |
| **Time Off**     | Leave types, leave request form, calendar, approve/refuse flow  |
| **Recruitment**  | Job positions, applications kanban, interview stages            |
| **Appraisals**   | Appraisal list, form (goals + feedback), scheduled appraisals   |
| **Attendances**  | Check-in/check-out log, overtime report                         |
| **Referrals**    | Referral program, points board                                  |
| **Fleet**        | Vehicles list, vehicle form, service log, contract tracking     |
| **Front Desk**   | Station setup, visitor check-in form, host notification         |
| **Lunch**        | Menu builder, order form, cash moves                            |

### Section 7 — Marketing (6 modules)

| Module                   | Key Records / Views                                              |
|--------------------------|------------------------------------------------------------------|
| **Email Marketing**      | Mailing list, campaign form, A/B test config, stats dashboard   |
| **SMS Marketing**        | SMS campaign list, contact list, delivery report                |
| **Social Marketing**     | Social accounts, post composer, scheduled posts calendar        |
| **Events**               | Event list, event form, registration, attendee list             |
| **Marketing Automation** | Workflow builder (trigger → condition → action), stats          |
| **Surveys**              | Survey builder (question types), share link, responses list     |

### Section 8 — Services (5 modules)

| Module           | Key Records / Views                                              |
|------------------|------------------------------------------------------------------|
| **Project**      | Project kanban, task kanban (stages), task form, sub-tasks      |
| **Timesheets**   | Timesheet grid (employee × week), timer button, invoice link    |
| **Helpdesk**     | Ticket list, ticket form, SLA config, customer portal link      |
| **Field Service**| Work order list, schedule assistant, time + material form       |
| **Planning**     | Shift gantt view, role assignment, publish shifts               |

### Section 9 — Productivity (13 modules)

| Module           | Key Records / Views                                              |
|------------------|------------------------------------------------------------------|
| **Discuss**      | DM inbox, channel list, message composer, emoji reactions       |
| **Calendar**     | Month/week/day calendar, event form, attendees                  |
| **Knowledge**    | Article tree, rich text editor, sharing permissions             |
| **Documents**    | Folder tree, document cards, PDF viewer, activity log           |
| **Sign**         | Template list, sign request form, signature pad                 |
| **Spreadsheet**  | Spreadsheet grid, formula bar, pivot table                      |
| **To-Do**        | Task list, deadline, priority stars                             |
| **Appointments** | Service types, availability config, booking calendar           |
| **Dashboards**   | Dashboard builder, widget picker, graph/KPI widgets             |
| **Data Cleaning**| Duplicate detection, merge wizard, deduplication rules          |
| **Odoo AI**      | AI assistant chat panel, suggested actions                      |
| **WhatsApp**     | WhatsApp template list, conversation view                       |
| **VoIP**         | Dial pad widget, call log, SIP config                           |

---

## Shared ERP Infrastructure

These components are shared across all 57 modules:

### ERP Shell (`/erp/shell/`)
```
TopNavbar.jsx          ← purple bar, app switcher, user menu
LeftSidebar.jsx        ← app-specific menu, collapsible
Breadcrumb.jsx         ← path trail at top of every view
ViewSwitcher.jsx       ← list/kanban/form/calendar toggle buttons
ActionBar.jsx          ← New, Save, Discard, Action, Cog buttons
Chatter.jsx            ← message thread + log note + schedule activity
StatusBar.jsx          ← stage pipeline bar (for CRM, Sales, etc.)
```

### ERP Field Components (`/erp/fields/`)
```
CharField.jsx          ← text input with inline edit
IntegerField.jsx       ← number input
FloatField.jsx         ← decimal input
DateField.jsx          ← date picker
DateTimeField.jsx      ← date + time picker
BooleanField.jsx       ← toggle switch
SelectionField.jsx     ← dropdown
Many2OneField.jsx      ← searchable dropdown linking to another model
Many2ManyField.jsx     ← tag selector with search
One2ManyField.jsx      ← inline editable table (lines)
TextField.jsx          ← multiline text area
HtmlField.jsx          ← rich text editor
BinaryField.jsx        ← file upload / image display
MonetaryField.jsx      ← currency-formatted number
StatusBarField.jsx     ← clickable stage pipeline
```

### ERP Data Layer (`/erp/data/`)
```
db.js                  ← IndexedDB wrapper (get, set, list, delete, query)
seed.js                ← loads all module seed data on first run
useRecord.js           ← hook: load/save one record
useRecordList.js       ← hook: list records with filter + sort + search
useActionLog.js        ← hook: writes every user action to action log
```

### Action Log (Critical for AI Verification)
Every interaction the user makes in the ERP is written to an action log stored in IndexedDB:

```js
{
  timestamp:   ISO string,
  module:      "crm",
  model:       "crm.lead",
  action:      "create" | "edit" | "delete" | "stage_change" | "click" | "navigate",
  record_id:   string | null,
  field:       string | null,        // which field was changed
  old_value:   any,
  new_value:   any,
  context:     {}                    // extra context (e.g. which stage moved to)
}
```

The AI verification engine reads this log when checking if a task was completed correctly.

---

## ERP Router Structure

```
/erp/                              ← ERP root (app switcher home)
/erp/settings/                     ← Settings
/erp/contacts/                     ← Contacts list
/erp/contacts/:id                  ← Contact form
/erp/accounting/journal-entries/   ← Accounting
/erp/accounting/invoices/
/erp/crm/pipeline/                 ← CRM kanban
/erp/crm/leads/                    ← CRM list
/erp/crm/leads/:id                 ← Lead form
/erp/sales/quotations/
/erp/sales/orders/
/erp/inventory/products/
/erp/inventory/receipts/
/erp/hr/employees/
/erp/hr/employees/:id
... (one URL pattern per view per module)
```

---

## Seed Data Strategy

Each module ships with realistic seed data so the ERP feels populated from first launch:

- **CRM**: 12 leads in various pipeline stages, 3 won, 2 lost
- **Contacts**: 25 contacts (mix of companies and individuals)
- **Employees**: 8 employees with full profiles, departments
- **Inventory**: 20 products, 3 warehouses, existing stock levels
- **Accounting**: 3 posted invoices, 1 vendor bill, basic chart of accounts
- **Projects**: 2 projects with 10+ tasks each
- All other modules: 3–5 representative records

Seed data is loaded once by `seed.js` into IndexedDB on first ERP mount. Users can reset to
seed data at any time via Settings → "Reset Demo Data".

---

## ERP Development Phases

### Phase A — Shell & Infrastructure (Week 1–2)
- Build `TopNavbar`, `LeftSidebar`, `Breadcrumb`, `ActionBar`, `Chatter`
- Build all field components
- Build `db.js` IndexedDB layer
- Build `useRecord`, `useRecordList`, `useActionLog` hooks
- Build generic `ListView`, `KanbanView`, `FormView`, `CalendarView` components
- Wire up ERP Router

### Phase B — Core Modules (Week 3–5)
Priority order (most used in lessons):
1. Settings, Contacts, Users (foundation)
2. CRM, Sales (Section 3 — first sales lessons)
3. Employees, Payroll, Time Off (Section 6 — HR heavy)
4. Inventory, Purchase (Section 5 — supply chain)
5. Accounting (Section 2 — finance)
6. Project, Timesheets, Helpdesk (Section 8)

### Phase C — All Remaining Modules (Week 6–9)
- Manufacturing, Quality, Maintenance, Repairs, PLM
- Marketing suite (Email, SMS, Social, Events, Automation, Surveys)
- Website suite (Website, eCommerce, Live Chat, eLearning, Forum, Blog)
- Productivity suite (Discuss, Calendar, Knowledge, Documents, Sign, Spreadsheet, etc.)

### Phase D — Polish & Parity (Week 10)
- Pixel-compare every view against real Odoo screenshots
- Fix color, spacing, typography mismatches
- Ensure all views work on 1280px, 1440px, 1920px screens
- Performance: virtual scrolling for lists > 100 records
- Full action log coverage (no interaction misses)
