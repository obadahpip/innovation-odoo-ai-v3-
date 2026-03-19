/**
 * App.jsx — Route tree for all 57 modules
 * Updated: Batch 3 — Full Inventory, Purchase, Manufacturing
 */
import { Routes, Route, Navigate } from 'react-router-dom'
import TaskEngineProvider from './engine/TaskEngineProvider.jsx'
import LessonSelector from './engine/LessonSelector.jsx'
import ERPShell from './shell/ERPShell.jsx'
import AppHome from './modules/home/AppHome.jsx'
import ERPLauncher from './engine/ERPLauncher.jsx'

// ── Phase 3 core modules ─────────────────────────────────────────
import CRMPipeline        from './modules/crm/CRMPipeline.jsx'
import CRMLeads           from './modules/crm/CRMLeads.jsx'
import CRMLeadForm        from './modules/crm/CRMLeadForm.jsx'
import SalesList          from './modules/sales/SalesList.jsx'
import SaleForm           from './modules/sales/SaleForm.jsx'
import ContactsList       from './modules/contacts/ContactsList.jsx'
import ContactForm        from './modules/contacts/ContactForm.jsx'
import EmployeeKanban     from './modules/employees/EmployeeKanban.jsx'
import EmployeeForm       from './modules/employees/EmployeeForm.jsx'
import Departments        from './modules/employees/Departments.jsx'
import AccountingDashboard from './modules/accounting/AccountingDashboard.jsx'
import InvoiceList        from './modules/accounting/InvoiceList.jsx'
import InvoiceForm        from './modules/accounting/InvoiceForm.jsx'
import ProjectsList       from './modules/project/ProjectsList.jsx'
import TaskKanban         from './modules/project/TaskKanban.jsx'
import TaskForm           from './modules/project/TaskForm.jsx'
import { TimeOffPage, TimeOffForm } from './modules/timeoff/TimeOffPage.jsx'
import UsersList          from './modules/users/UsersList.jsx'
import Settings           from './modules/settings/Settings.jsx'

// ── Finance ──────────────────────────────────────────────────────
import { ExpensesPage, ExpensesForm } from './modules/expenses/ExpensesPage.jsx'
import { PaymentProvidersPage, PaymentProvidersForm } from './modules/payment_providers/PaymentProvidersPage.jsx'
import { ESGPage, ESGForm } from './modules/esg/ESGPage.jsx'

// ── Sales Ext ─────────────────────────────────────────────────────
import { POSPage, POSForm } from './modules/pos/POSPage.jsx'
import { SubscriptionsPage, SubscriptionsForm } from './modules/subscriptions/SubscriptionsPage.jsx'
import { RentalPage, RentalForm } from './modules/rental/RentalPage.jsx'

// ── Websites (Batch 2) ────────────────────────────────────────────
import { WebsitePage, WebsiteForm } from './modules/website/WebsitePage.jsx'
import { EcommercePage, EcommerceForm } from './modules/ecommerce/EcommercePage.jsx'
import { LiveChatPage, LiveChatForm } from './modules/livechat/LiveChatPage.jsx'
import { ElearningPage, ElearningForm } from './modules/elearning/ElearningPage.jsx'
import { ForumPage, ForumForm } from './modules/forum/ForumPage.jsx'
import { BlogPage, BlogForm } from './modules/blog/BlogPage.jsx'

// ── Studio (Batch 2) ──────────────────────────────────────────────
import {
  StudioModelsPage,
  StudioViewsPage,   StudioViewForm,
  StudioActionsPage, StudioActionForm,
  StudioRulesPage,   StudioRuleForm,
} from './modules/studio/StudioPage.jsx'

// ── Supply Chain (Batch 3 — full) ─────────────────────────────────
import { ProductsList, ProductForm, TransfersList, TransferForm } from './modules/inventory/InventoryPage.jsx'
import { PurchasePage, PurchaseForm } from './modules/purchase/PurchasePage.jsx'
import { ManufacturingPage, ManufacturingForm, BOMList, PLMPage, PLMForm } from './modules/manufacturing/ManufacturingPage.jsx'
import { BarcodePage, BarcodeForm } from './modules/barcode/BarcodePage.jsx'
import { QualityPage, QualityForm } from './modules/quality/QualityPage.jsx'
import { MaintenancePage, MaintenanceForm } from './modules/maintenance/MaintenancePage.jsx'
import { RepairsPage, RepairsForm } from './modules/repairs/RepairsPage.jsx'

// ── HR ────────────────────────────────────────────────────────────
import { PayrollPage, PayrollKanban, PayrollForm } from './modules/payroll/PayrollPage.jsx'
import { RecruitmentPage, RecruitmentForm, JobPositionsList } from './modules/recruitment/RecruitmentPage.jsx'
import { AppraisalsPage, AppraisalsForm } from './modules/appraisals/AppraisalsPage.jsx'
import { AttendancesPage, AttendancesForm } from './modules/attendances/AttendancesPage.jsx'
import { FleetPage, FleetForm } from './modules/fleet/FleetPage.jsx'
import { FrontDeskPage, FrontDeskForm } from './modules/frontdesk/FrontDeskPage.jsx'
import { LunchPage, LunchForm } from './modules/lunch/LunchPage.jsx'

// ── Marketing ─────────────────────────────────────────────────────
import { EmailMarketingPage, EmailMarketingForm, SMSPage, SMSForm, MarketingAutomationPage, MarketingAutomationForm, SignPage, SignForm } from './modules/email_marketing/EmailMarketingPage.jsx'
import { EventsPage, EventsForm } from './modules/events/EventsPage.jsx'
import { SurveysPage, SurveysForm } from './modules/surveys/SurveysPage.jsx'

// ── Services ──────────────────────────────────────────────────────
import { TimesheetsPage, TimesheetsForm } from './modules/timesheets/TimesheetsPage.jsx'
import { HelpdeskPage, HelpdeskForm, HelpdeskStagesPage } from './modules/helpdesk/HelpdeskPage.jsx'
import { FieldServicePage, FieldServiceForm } from './modules/field_service/FieldServicePage.jsx'
import { PlanningPage, PlanningForm } from './modules/planning/PlanningPage.jsx'

// ── Productivity ──────────────────────────────────────────────────
import { DiscussPage, DiscussForm } from './modules/discuss/DiscussPage.jsx'
import { CalendarPage, CalendarForm } from './modules/calendar/CalendarPage.jsx'
import { KnowledgePage, KnowledgeForm } from './modules/knowledge/KnowledgePage.jsx'
import { DocumentsPage, DocumentsForm } from './modules/documents/DocumentsPage.jsx'
import { SpreadsheetPage, SpreadsheetForm } from './modules/spreadsheet/SpreadsheetPage.jsx'
import { TodoPage, TodoForm } from './modules/todo/TodoPage.jsx'
import { VoIPPage, VoIPForm } from './modules/voip/VoIPPage.jsx'
import { WhatsAppPage, WhatsAppForm } from './modules/whatsapp/WhatsAppPage.jsx'

import { AppointmentsPage, AppointmentsForm, AppointmentTypesPage } from './modules/appointments/AppointmentsPage.jsx'
import { DataCleaningPage } from './modules/data_cleaning/DataCleaningPage.jsx'

export default function App() {
  return (
    <TaskEngineProvider>
    <Routes>
      <Route path="/" element={<Navigate to="/erp" replace />} />

      <Route path="/erp" element={<ERPShell />}>
        <Route index element={<Navigate to="/erp/home" replace />} />
        <Route path="home" element={<AppHome />} />

        {/* CRM */}
        <Route path="crm/pipeline"     element={<CRMPipeline />} />
        <Route path="crm/leads"        element={<CRMLeads />} />
        <Route path="crm/leads/new"    element={<CRMLeadForm />} />
        <Route path="crm/leads/:id"    element={<CRMLeadForm />} />

        {/* Sales */}
        <Route path="sales/quotations"     element={<SalesList stateFilter={['draft','sent']}         title="Quotations" />} />
        <Route path="sales/quotations/new" element={<SaleForm />} />
        <Route path="sales/quotations/:id" element={<SaleForm />} />
        <Route path="sales/orders"         element={<SalesList stateFilter={['sale','done','cancel']} title="Sales Orders" />} />
        <Route path="sales/orders/new"     element={<SaleForm />} />
        <Route path="sales/orders/:id"     element={<SaleForm />} />

        {/* Contacts */}
        <Route path="contacts"      element={<ContactsList />} />
        <Route path="contacts/new"  element={<ContactForm />} />
        <Route path="contacts/:id"  element={<ContactForm />} />

        {/* Employees */}
        <Route path="employees"             element={<EmployeeKanban />} />
        <Route path="employees/new"         element={<EmployeeForm />} />
        <Route path="employees/departments" element={<Departments />} />
        <Route path="employees/:id"         element={<EmployeeForm />} />

        {/* Accounting */}
        <Route path="accounting"              element={<AccountingDashboard />} />
        <Route path="accounting/invoices"     element={<InvoiceList moveType="out_invoice" title="Customer Invoices" />} />
        <Route path="accounting/invoices/new" element={<InvoiceForm moveType="out_invoice" />} />
        <Route path="accounting/invoices/:id" element={<InvoiceForm moveType="out_invoice" />} />
        <Route path="accounting/bills"        element={<InvoiceList moveType="in_invoice"  title="Vendor Bills" />} />
        <Route path="accounting/bills/new"    element={<InvoiceForm moveType="in_invoice" />} />
        <Route path="accounting/bills/:id"    element={<InvoiceForm moveType="in_invoice" />} />

        {/* Project */}
        <Route path="project"           element={<ProjectsList />} />
        <Route path="project/tasks"     element={<TaskKanban />} />
        <Route path="project/tasks/new" element={<TaskForm />} />
        <Route path="project/tasks/:id" element={<TaskForm />} />

        {/* Time Off / Users / Settings */}
        <Route path="time-off"                    element={<TimeOffPage />} />
        <Route path="time-off/new"               element={<TimeOffForm />} />
        <Route path="time-off/:id"               element={<TimeOffForm />} />
        <Route path="time-off/allocations"       element={<TimeOffPage />} />
        <Route path="time-off/all"               element={<TimeOffPage />} />
        <Route path="time-off/all-allocations"   element={<TimeOffPage />} />
        <Route path="time-off/types"             element={<TimeOffPage />} />
        <Route path="time-off/reporting"         element={<TimeOffPage />} />
        <Route path="time-off/analysis"          element={<TimeOffPage />} />
        <Route path="time-off/config"            element={<TimeOffPage />} />
        <Route path="users"    element={<UsersList />} />
        <Route path="settings" element={<Settings />} />

        {/* Finance */}
        <Route path="expenses"              element={<ExpensesPage />} />
        <Route path="expenses/new"          element={<ExpensesForm />} />
        <Route path="expenses/:id"          element={<ExpensesForm />} />
        <Route path="expenses/reports"      element={<ExpensesPage />} />
        <Route path="expenses/all"          element={<ExpensesPage />} />
        <Route path="expenses/all-reports"  element={<ExpensesPage />} />
        <Route path="payment-providers"     element={<PaymentProvidersPage />} />
        <Route path="payment-providers/new" element={<PaymentProvidersForm />} />
        <Route path="payment-providers/:id" element={<PaymentProvidersForm />} />
        <Route path="esg"                   element={<ESGPage />} />
        <Route path="esg/new"               element={<ESGForm />} />
        <Route path="esg/:id"               element={<ESGForm />} />

        {/* Sales Ext */}
        <Route path="pos"               element={<POSPage />} />
        <Route path="pos/new"           element={<POSForm />} />
        <Route path="pos/:id"           element={<POSForm />} />
        <Route path="subscriptions"     element={<SubscriptionsPage />} />
        <Route path="subscriptions/new" element={<SubscriptionsForm />} />
        <Route path="subscriptions/:id" element={<SubscriptionsForm />} />
        <Route path="rental"              element={<RentalPage />} />
        <Route path="rental/new"          element={<RentalForm />} />
        <Route path="rental/products"     element={<RentalPage />} />
        <Route path="rental/reporting"    element={<RentalPage />} />
        <Route path="rental/config"       element={<RentalPage />} />
        <Route path="rental/:id"          element={<RentalForm />} />

        {/* Websites — Batch 2 */}
        <Route path="website"           element={<WebsitePage />} />
        <Route path="website/new"       element={<WebsiteForm />} />
        <Route path="website/:id"       element={<WebsiteForm />} />
        <Route path="ecommerce"         element={<EcommercePage />} />
        <Route path="ecommerce/new"     element={<EcommerceForm />} />
        <Route path="ecommerce/:id"     element={<EcommerceForm />} />
        <Route path="livechat"          element={<LiveChatPage />} />
        <Route path="livechat/new"      element={<LiveChatForm />} />
        <Route path="livechat/:id"      element={<LiveChatForm />} />
        <Route path="elearning"         element={<ElearningPage />} />
        <Route path="elearning/new"     element={<ElearningForm />} />
        <Route path="elearning/:id"     element={<ElearningForm />} />
        <Route path="forum"             element={<ForumPage />} />
        <Route path="forum/new"         element={<ForumForm />} />
        <Route path="forum/:id"         element={<ForumForm />} />
        <Route path="blog"              element={<BlogPage />} />
        <Route path="blog/new"          element={<BlogForm />} />
        <Route path="blog/:id"          element={<BlogForm />} />

        {/* Studio — Batch 2 */}
        <Route path="studio"                element={<StudioModelsPage />} />
        <Route path="studio/model/:id"      element={<StudioModelsPage />} />
        <Route path="studio/views"          element={<StudioViewsPage />} />
        <Route path="studio/views/new"      element={<StudioViewForm />} />
        <Route path="studio/views/:id"      element={<StudioViewForm />} />
        <Route path="studio/actions"        element={<StudioActionsPage />} />
        <Route path="studio/actions/new"    element={<StudioActionForm />} />
        <Route path="studio/actions/:id"    element={<StudioActionForm />} />
        <Route path="studio/reports"        element={<StudioActionsPage />} />
        <Route path="studio/rules"          element={<StudioRulesPage />} />
        <Route path="studio/rules/new"      element={<StudioRuleForm />} />
        <Route path="studio/rules/:id"      element={<StudioRuleForm />} />

        {/* Inventory — Batch 3 full ─────────────────────────────── */}
        <Route path="inventory/products"          element={<ProductsList />} />
        <Route path="inventory/products/new"      element={<ProductForm />} />
        <Route path="inventory/products/:id"      element={<ProductForm />} />
        <Route path="inventory/transfers"         element={<TransfersList />} />
        <Route path="inventory/transfers/new"     element={<TransferForm />} />
        <Route path="inventory/transfers/:id"     element={<TransferForm />} />
        <Route path="inventory/lots"              element={<ProductsList />} />
        <Route path="inventory/physical"          element={<ProductsList />} />
        <Route path="inventory/scrap"             element={<ProductsList />} />
        <Route path="inventory/reporting"         element={<ProductsList />} />
        <Route path="inventory/warehouses"        element={<ProductsList />} />
        <Route path="inventory/config"            element={<ProductsList />} />

        {/* Purchase — Batch 3 full ──────────────────────────────── */}
        <Route path="purchase/rfq"            element={<PurchasePage stateFilter={['draft','sent']} title="Requests for Quotation" />} />
        <Route path="purchase/orders"         element={<PurchasePage />} />
        <Route path="purchase/orders/new"     element={<PurchaseForm />} />
        <Route path="purchase/orders/:id"     element={<PurchaseForm />} />
        <Route path="purchase/products"       element={<ProductsList />} />
        <Route path="purchase/pricelists"     element={<PurchasePage />} />
        <Route path="purchase/reporting"      element={<PurchasePage />} />
        <Route path="purchase/config"         element={<PurchasePage />} />

        {/* Manufacturing — Batch 3 full ────────────────────────── */}
        <Route path="manufacturing"           element={<ManufacturingPage />} />
        <Route path="manufacturing/new"       element={<ManufacturingForm />} />
        <Route path="manufacturing/:id"       element={<ManufacturingForm />} />
        <Route path="manufacturing/bom"       element={<BOMList />} />
        <Route path="manufacturing/bom/new"   element={<ManufacturingForm />} />
        <Route path="manufacturing/bom/:id"   element={<ManufacturingForm />} />
        <Route path="manufacturing/work"      element={<ManufacturingPage />} />
        <Route path="manufacturing/scrap"     element={<ManufacturingPage />} />
        <Route path="manufacturing/products"  element={<ProductsList />} />
        <Route path="manufacturing/operations"element={<ManufacturingPage />} />
        <Route path="manufacturing/reporting" element={<ManufacturingPage />} />
        <Route path="manufacturing/config"    element={<ManufacturingPage />} />

        {/* PLM — Batch 3 ───────────────────────────────────────── */}
        <Route path="plm"                 element={<PLMPage />} />
        <Route path="plm/new"             element={<PLMForm />} />
        <Route path="plm/:id"             element={<PLMForm />} />

        {/* Barcode / Quality / Maintenance / Repairs (existing stubs) */}
        <Route path="barcode"             element={<BarcodePage />} />
        <Route path="barcode/:id"         element={<BarcodeForm />} />
        <Route path="quality"             element={<QualityPage />} />
        <Route path="quality/new"         element={<QualityForm />} />
        <Route path="quality/:id"         element={<QualityForm />} />
        <Route path="maintenance"              element={<MaintenancePage />} />
        <Route path="maintenance/new"          element={<MaintenanceForm />} />
        <Route path="maintenance/equipment"    element={<MaintenancePage />} />
        <Route path="maintenance/stages"       element={<MaintenancePage />} />
        <Route path="maintenance/teams"        element={<MaintenancePage />} />
        <Route path="maintenance/reporting"    element={<MaintenancePage />} />
        <Route path="maintenance/config"       element={<MaintenancePage />} />
        <Route path="maintenance/:id"          element={<MaintenanceForm />} />
        <Route path="repairs"             element={<RepairsPage />} />
        <Route path="repairs/new"         element={<RepairsForm />} />
        <Route path="repairs/:id"         element={<RepairsForm />} />

        {/* HR Ext */}
        <Route path="payroll"              element={<PayrollPage />} />
        <Route path="payroll/new"          element={<PayrollForm />} />
        <Route path="payroll/:id"          element={<PayrollForm />} />
        <Route path="payroll/all"          element={<PayrollPage />} />
        <Route path="payroll/batches"      element={<PayrollPage />} />
        <Route path="payroll/reporting"    element={<PayrollPage />} />
        <Route path="payroll/structures"   element={<PayrollPage />} />
        <Route path="payroll/rules"        element={<PayrollPage />} />
        <Route path="recruitment"                element={<RecruitmentPage />} />
        <Route path="recruitment/new"            element={<RecruitmentForm />} />
        <Route path="recruitment/:id"            element={<RecruitmentForm />} />
        <Route path="recruitment/new-apps"       element={<RecruitmentPage />} />
        <Route path="recruitment/positions"      element={<JobPositionsList />} />
        <Route path="recruitment/positions/new"  element={<RecruitmentForm />} />
        <Route path="recruitment/positions/:id"  element={<RecruitmentForm />} />
        <Route path="recruitment/reporting"      element={<RecruitmentPage />} />
        <Route path="recruitment/stages"         element={<RecruitmentPage />} />
        <Route path="recruitment/config"         element={<RecruitmentPage />} />
        <Route path="appraisals"      element={<AppraisalsPage />} />
        <Route path="appraisals/new"  element={<AppraisalsForm />} />
        <Route path="appraisals/:id"  element={<AppraisalsForm />} />
        <Route path="attendances"     element={<AttendancesPage />} />
        <Route path="attendances/new" element={<AttendancesForm />} />
        <Route path="attendances/:id" element={<AttendancesForm />} />
        <Route path="fleet"              element={<FleetPage />} />
        <Route path="fleet/new"          element={<FleetForm />} />
        <Route path="fleet/contracts"    element={<FleetPage />} />
        <Route path="fleet/models"       element={<FleetPage />} />
        <Route path="fleet/reporting"    element={<FleetPage />} />
        <Route path="fleet/config"       element={<FleetPage />} />
        <Route path="fleet/:id"          element={<FleetForm />} />
        <Route path="frontdesk"       element={<FrontDeskPage />} />
        <Route path="frontdesk/new"   element={<FrontDeskForm />} />
        <Route path="frontdesk/:id"   element={<FrontDeskForm />} />
        <Route path="lunch"           element={<LunchPage />} />
        <Route path="lunch/new"       element={<LunchForm />} />
        <Route path="lunch/:id"       element={<LunchForm />} />

        {/* Marketing */}
        <Route path="email-marketing"            element={<EmailMarketingPage />} />
        <Route path="email-marketing/new"        element={<EmailMarketingForm />} />
        <Route path="email-marketing/:id"        element={<EmailMarketingForm />} />
        <Route path="sms"                        element={<SMSPage />} />
        <Route path="sms/new"                    element={<SMSForm />} />
        <Route path="sms/:id"                    element={<SMSForm />} />
        <Route path="social"                     element={<EmailMarketingPage />} />
        <Route path="social/new"                 element={<EmailMarketingForm />} />
        <Route path="social/:id"                 element={<EmailMarketingForm />} />
        <Route path="events"                     element={<EventsPage />} />
        <Route path="events/new"                 element={<EventsForm />} />
        <Route path="events/config"              element={<EventsPage />} />
        <Route path="events/:id"                 element={<EventsForm />} />
        <Route path="marketing-automation"       element={<MarketingAutomationPage />} />
        <Route path="marketing-automation/new"   element={<MarketingAutomationForm />} />
        <Route path="marketing-automation/:id"   element={<MarketingAutomationForm />} />
        <Route path="surveys"                    element={<SurveysPage />} />
        <Route path="surveys/new"               element={<SurveysForm />} />
        <Route path="surveys/:id"               element={<SurveysForm />} />
        <Route path="surveys/:id/results"       element={<SurveysForm />} />
        <Route path="surveys/config"            element={<SurveysPage />} />

        {/* Services */}
        <Route path="timesheets"        element={<TimesheetsPage />} />
        <Route path="timesheets/new"    element={<TimesheetsForm />} />
        <Route path="timesheets/:id"    element={<TimesheetsForm />} />
        <Route path="helpdesk"          element={<HelpdeskPage />} />
        <Route path="helpdesk/new"      element={<HelpdeskForm />} />
        <Route path="helpdesk/all"      element={<HelpdeskPage />} />
        <Route path="helpdesk/stages"   element={<HelpdeskStagesPage />} />
        <Route path="helpdesk/teams"    element={<HelpdeskPage />} />
        <Route path="helpdesk/reporting" element={<HelpdeskPage />} />
        <Route path="helpdesk/config"   element={<HelpdeskPage />} />
        <Route path="helpdesk/:id"      element={<HelpdeskForm />} />
        <Route path="field-service"     element={<FieldServicePage />} />
        <Route path="field-service/new" element={<FieldServiceForm />} />
        <Route path="field-service/:id" element={<FieldServiceForm />} />
        <Route path="planning"          element={<PlanningPage />} />
        <Route path="planning/new"      element={<PlanningForm />} />
        <Route path="planning/:id"      element={<PlanningForm />} />

        {/* Productivity */}
        <Route path="discuss"           element={<DiscussPage />} />
        <Route path="discuss/:id"       element={<DiscussForm />} />
        <Route path="calendar"          element={<CalendarPage />} />
        <Route path="calendar/new"      element={<CalendarForm />} />
        <Route path="calendar/:id"      element={<CalendarForm />} />
        <Route path="knowledge"         element={<KnowledgePage />} />
        <Route path="knowledge/new"     element={<KnowledgeForm />} />
        <Route path="knowledge/:id"     element={<KnowledgeForm />} />
        <Route path="documents"         element={<DocumentsPage />} />
        <Route path="documents/new"     element={<DocumentsForm />} />
        <Route path="documents/:id"     element={<DocumentsForm />} />
        <Route path="sign"              element={<SignPage />} />
        <Route path="sign/new"          element={<SignForm />} />
        <Route path="sign/:id"          element={<SignForm />} />
        <Route path="spreadsheet"       element={<SpreadsheetPage />} />
        <Route path="spreadsheet/new"   element={<SpreadsheetForm />} />
        <Route path="spreadsheet/:id"   element={<SpreadsheetForm />} />
        <Route path="todos"             element={<TodoPage />} />
        <Route path="todos/new"         element={<TodoForm />} />
        <Route path="todos/:id"         element={<TodoForm />} />
        <Route path="voip"              element={<VoIPPage />} />
        <Route path="voip/new"          element={<VoIPForm />} />
        <Route path="voip/:id"          element={<VoIPForm />} />
        <Route path="whatsapp"          element={<WhatsAppPage />} />
        <Route path="whatsapp/new"      element={<WhatsAppForm />} />
        <Route path="whatsapp/:id"      element={<WhatsAppForm />} />

        {/* Appointments — Batch 7 */}
        <Route path="appointments"              element={<AppointmentsPage />} />
        <Route path="appointments/new"          element={<AppointmentsForm />} />
        <Route path="appointments/:id"          element={<AppointmentsForm />} />
        <Route path="appointments/types"        element={<AppointmentTypesPage />} />
        <Route path="appointments/types/new"    element={<AppointmentsForm mode='type' />} />
        <Route path="appointments/types/:id"    element={<AppointmentsForm mode='type' />} />
        <Route path="appointments/reporting"    element={<AppointmentsPage />} />

        {/* Data Cleaning — Batch 7 */}
        <Route path="data-cleaning"             element={<DataCleaningPage />} />
        <Route path="data-cleaning/dedup"       element={<DataCleaningPage />} />
        <Route path="data-cleaning/rules"       element={<DataCleaningPage />} />

      </Route>

      <Route path="/erp/lessons" element={<ERPShell />}><Route index element={<LessonSelector />} /></Route>
      <Route path="*" element={<Navigate to="/erp" replace />} />
      <Route path="launch" element={<ERPLauncher />} />
    </Routes>
    </TaskEngineProvider>
  )
}
