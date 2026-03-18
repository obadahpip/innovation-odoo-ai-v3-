import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import './index.css';

import TopNavbar   from './shell/TopNavbar';
import Breadcrumb  from './shell/Breadcrumb';
import ComingSoon  from './shell/ComingSoon';

// ── Built modules ──────────────────────────────────────────────────────────
// These components already exist from Phase 3.
// If a file doesn't exist yet, swap it to ComingSoon temporarily.

import ERPHome     from './modules/home/ERPHome';
import CRMApp      from './modules/crm/CRMApp';
import SalesApp    from './modules/sales/SalesApp';
import ContactsApp from './modules/contacts/ContactsApp';
import InvoicingApp from './modules/invoicing/InvoicingApp';
import EmployeesApp from './modules/employees/EmployeesApp';
import ProjectApp  from './modules/project/ProjectApp';
import SettingsApp from './modules/settings/SettingsApp';
import InventoryApp from './modules/inventory/InventoryApp';  // stub
import TimeOffApp  from './modules/time_off/TimeOffApp';       // stub
import PayrollApp  from './modules/payroll/PayrollApp';         // stub
import RecruitmentApp from './modules/recruitment/RecruitmentApp'; // stub

// ── Coming-soon factory ────────────────────────────────────────────────────
// Creates a ComingSoon component bound to a specific moduleId
const cs = (moduleId) => () => <ComingSoon moduleId={moduleId} />;

// ── ERP Shell wrapper ──────────────────────────────────────────────────────
function ERPShell({ children }) {
  const location = useLocation();
  const isHome   = location.pathname === '/erp' || location.pathname === '/erp/home';

  return (
    <div id="erp-root">
      <TopNavbar userName="Admin" userEmail="admin@company.com" />
      {!isHome && <Breadcrumb />}
      <div className="erp-body">
        <div className="erp-content erp-animate">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Root component ─────────────────────────────────────────────────────────
export default function ERPApp() {
  return (
    <ERPShell>
      <Routes>
        {/* ── Default redirect ────────────────────────────────────── */}
        <Route index element={<Navigate to="/erp/home" replace />} />
        <Route path="home" element={<ERPHome />} />

        {/* ── Section 1 — General / Studio ────────────────────────── */}
        <Route path="settings/*"  element={<SettingsApp />} />

        {/* ── Section 2 — Finance ─────────────────────────────────── */}
        <Route path="invoicing/*" element={<InvoicingApp />} />
        <Route path="expenses/*"  element={cs('expenses')()} />

        {/* ── Section 3 — Sales ───────────────────────────────────── */}
        <Route path="crm/*"           element={<CRMApp />} />
        <Route path="sales/*"         element={<SalesApp />} />
        <Route path="pos/*"           element={cs('point_of_sale')()} />
        <Route path="subscriptions/*" element={cs('subscriptions')()} />
        <Route path="rental/*"        element={cs('rental')()} />

        {/* ── Section 4 — Websites ────────────────────────────────── */}
        <Route path="website/*"  element={cs('website_builder')()} />

        {/* ── Section 5 — Inventory & MFG ─────────────────────────── */}
        <Route path="inventory/*"     element={<InventoryApp />} />
        <Route path="purchase/*"      element={cs('purchase')()} />
        <Route path="manufacturing/*" element={cs('manufacturing')()} />
        <Route path="maintenance/*"   element={cs('maintenance')()} />

        {/* ── Section 6 — HR ──────────────────────────────────────── */}
        <Route path="employees/*"   element={<EmployeesApp />} />
        <Route path="payroll/*"     element={<PayrollApp />} />
        <Route path="time-off/*"    element={<TimeOffApp />} />
        <Route path="recruitment/*" element={<RecruitmentApp />} />
        <Route path="attendances/*" element={cs('attendances')()} />
        <Route path="fleet/*"       element={cs('fleet')()} />

        {/* ── Section 7 — Marketing ───────────────────────────────── */}
        <Route path="email-marketing/*" element={cs('email_marketing')()} />
        <Route path="events/*"          element={cs('events')()} />
        <Route path="surveys/*"         element={cs('surveys')()} />

        {/* ── Section 8 — Services ────────────────────────────────── */}
        <Route path="project/*"   element={<ProjectApp />} />
        <Route path="helpdesk/*"  element={cs('helpdesk')()} />
        <Route path="planning/*"  element={cs('planning')()} />

        {/* ── Section 9 — Productivity ────────────────────────────── */}
        <Route path="contacts/*"      element={<ContactsApp />} />
        <Route path="discuss/*"       element={cs('discuss')()} />
        <Route path="calendar/*"      element={cs('calendar')()} />
        <Route path="appointments/*"  element={cs('appointments')()} />
        <Route path="data-cleaning/*" element={cs('data_cleaning')()} />

        {/* ── Catch-all → home ────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/erp/home" replace />} />
      </Routes>
    </ERPShell>
  );
}
