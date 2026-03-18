/**
 * App.jsx — Route tree for all 57 modules
 *
 * IMPORTANT: BrowserRouter lives in main.jsx — NOT here.
 * Having two Routers causes: "You cannot render a <Router> inside another <Router>"
 */
import { Routes, Route, Navigate } from 'react-router-dom'
import ERPShell from './shell/ERPShell.jsx'
import AppHome from './modules/home/AppHome.jsx'

// ── Phase 3 core modules (default exports) ──────────────────────
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
import ProductsList       from './modules/inventory/ProductsList.jsx'
import TimeOffPage        from './modules/timeoff/TimeOffPage.jsx'
import UsersList          from './modules/users/UsersList.jsx'
import Settings           from './modules/settings/Settings.jsx'

// ── Phase 4: Finance ─────────────────────────────────────────────
import { ExpensesPage, ExpensesForm as ExpenseForm } from './modules/expenses/ExpensesPage.jsx'
import { PaymentProvidersPage, PaymentProvidersForm } from './modules/payment_providers/PaymentProvidersPage.jsx'
import { ESGPage, ESGForm } from './modules/esg/ESGPage.jsx'

// ── Phase 4: Sales ────────────────────────────────────────────────
import { POSPage, POSForm } from './modules/pos/POSPage.jsx'
import { SubscriptionsPage, SubscriptionsForm } from './modules/subscriptions/SubscriptionsPage.jsx'
import { RentalPage, RentalForm } from './modules/rental/RentalPage.jsx'

// ── Phase 4: Websites ─────────────────────────────────────────────
import { WebsitePage, WebsiteForm } from './modules/website/WebsitePage.jsx'
import { EcommercePage, EcommerceForm } from './modules/ecommerce/EcommercePage.jsx'
import { LiveChatPage, LiveChatForm } from './modules/livechat/LiveChatPage.jsx'
import { ElearningPage, ElearningForm } from './modules/elearning/ElearningPage.jsx'
import { ForumPage, ForumForm } from './modules/forum/ForumPage.jsx'
import { BlogPage, BlogForm } from './modules/blog/BlogPage.jsx'

// ── Phase 4: Supply Chain ─────────────────────────────────────────
import { PurchasePage, PurchaseForm } from './modules/purchase/PurchasePage.jsx'
import { ManufacturingPage, ManufacturingForm } from './modules/manufacturing/ManufacturingPage.jsx'
import { BarcodePage, BarcodeForm } from './modules/barcode/BarcodePage.jsx'
import { QualityPage, QualityForm } from './modules/quality/QualityPage.jsx'
import { MaintenancePage, MaintenanceForm } from './modules/maintenance/MaintenancePage.jsx'
import { RepairsPage, RepairsForm } from './modules/repairs/RepairsPage.jsx'
import { PLMPage, PLMForm } from './modules/plm/PLMPage.jsx'

// ── Phase 4: HR ───────────────────────────────────────────────────
import { PayrollPage, PayrollForm } from './modules/payroll/PayrollPage.jsx'
import { RecruitmentPage, RecruitmentForm } from './modules/recruitment/RecruitmentPage.jsx'
import { AppraisalsPage, AppraisalsForm } from './modules/appraisals/AppraisalsPage.jsx'
import { AttendancesPage, AttendancesForm } from './modules/attendances/AttendancesPage.jsx'
import { FleetPage, FleetForm } from './modules/fleet/FleetPage.jsx'
import { FrontDeskPage, FrontDeskForm } from './modules/frontdesk/FrontDeskPage.jsx'
import { LunchPage, LunchForm } from './modules/lunch/LunchPage.jsx'

// ── Phase 4: Marketing ────────────────────────────────────────────
import { EmailMarketingPage, EmailMarketingForm } from './modules/email_marketing/EmailMarketingPage.jsx'
import { SMSPage, SMSForm } from './modules/sms/SMSPage.jsx'
import { SocialPage, SocialForm } from './modules/social/SocialPage.jsx'
import { EventsPage, EventsForm } from './modules/events/EventsPage.jsx'
import { MarketingAutomationPage, MarketingAutomationForm } from './modules/marketing_automation/MarketingAutomationPage.jsx'
import { SurveysPage, SurveysForm } from './modules/surveys/SurveysPage.jsx'

// ── Phase 4: Services ─────────────────────────────────────────────
import { TimesheetsPage, TimesheetsForm } from './modules/timesheets/TimesheetsPage.jsx'
import { HelpdeskPage, HelpdeskForm } from './modules/helpdesk/HelpdeskPage.jsx'
import { FieldServicePage, FieldServiceForm } from './modules/field_service/FieldServicePage.jsx'
import { PlanningPage, PlanningForm } from './modules/planning/PlanningPage.jsx'

// ── Phase 4: Productivity ─────────────────────────────────────────
import { DiscussPage, DiscussForm } from './modules/discuss/DiscussPage.jsx'
import { CalendarPage, CalendarForm } from './modules/calendar/CalendarPage.jsx'
import { KnowledgePage, KnowledgeForm } from './modules/knowledge/KnowledgePage.jsx'
import { DocumentsPage, DocumentsForm } from './modules/documents/DocumentsPage.jsx'
import { SignPage, SignForm } from './modules/sign/SignPage.jsx'
import { SpreadsheetPage, SpreadsheetForm } from './modules/spreadsheet/SpreadsheetPage.jsx'
import { TodoPage, TodoForm } from './modules/todo/TodoPage.jsx'
import { VoIPPage, VoIPForm } from './modules/voip/VoIPPage.jsx'
import { WhatsAppPage, WhatsAppForm } from './modules/whatsapp/WhatsAppPage.jsx'

// ── App — just Routes, no BrowserRouter ──────────────────────────
export default function App() {
  return (
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

        {/* Inventory */}
        <Route path="inventory/products"     element={<ProductsList />} />
        <Route path="inventory/products/:id" element={<ProductsList />} />

        {/* Time Off / Users / Settings */}
        <Route path="time-off" element={<TimeOffPage />} />
        <Route path="users"    element={<UsersList />} />
        <Route path="settings" element={<Settings />} />

        {/* Finance */}
        <Route path="expenses"              element={<ExpensesPage />} />
        <Route path="expenses/new"          element={<ExpenseForm />} />
        <Route path="expenses/:id"          element={<ExpenseForm />} />
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
        <Route path="rental"            element={<RentalPage />} />
        <Route path="rental/new"        element={<RentalForm />} />
        <Route path="rental/:id"        element={<RentalForm />} />

        {/* Websites */}
        <Route path="website"       element={<WebsitePage />} />
        <Route path="website/:id"   element={<WebsiteForm />} />
        <Route path="ecommerce"     element={<EcommercePage />} />
        <Route path="ecommerce/:id" element={<EcommerceForm />} />
        <Route path="livechat"      element={<LiveChatPage />} />
        <Route path="livechat/:id"  element={<LiveChatForm />} />
        <Route path="elearning"     element={<ElearningPage />} />
        <Route path="elearning/:id" element={<ElearningForm />} />
        <Route path="forum"         element={<ForumPage />} />
        <Route path="forum/:id"     element={<ForumForm />} />
        <Route path="blog"          element={<BlogPage />} />
        <Route path="blog/:id"      element={<BlogForm />} />

        {/* Supply Chain */}
        <Route path="purchase/orders"     element={<PurchasePage />} />
        <Route path="purchase/orders/new" element={<PurchaseForm />} />
        <Route path="purchase/orders/:id" element={<PurchaseForm />} />
        <Route path="manufacturing"       element={<ManufacturingPage />} />
        <Route path="manufacturing/new"   element={<ManufacturingForm />} />
        <Route path="manufacturing/:id"   element={<ManufacturingForm />} />
        <Route path="barcode"             element={<BarcodePage />} />
        <Route path="barcode/:id"         element={<BarcodeForm />} />
        <Route path="quality"             element={<QualityPage />} />
        <Route path="quality/new"         element={<QualityForm />} />
        <Route path="quality/:id"         element={<QualityForm />} />
        <Route path="maintenance"         element={<MaintenancePage />} />
        <Route path="maintenance/new"     element={<MaintenanceForm />} />
        <Route path="maintenance/:id"     element={<MaintenanceForm />} />
        <Route path="repairs"             element={<RepairsPage />} />
        <Route path="repairs/new"         element={<RepairsForm />} />
        <Route path="repairs/:id"         element={<RepairsForm />} />
        <Route path="plm"                 element={<PLMPage />} />
        <Route path="plm/new"             element={<PLMForm />} />
        <Route path="plm/:id"             element={<PLMForm />} />

        {/* HR Ext */}
        <Route path="payroll"         element={<PayrollPage />} />
        <Route path="payroll/new"     element={<PayrollForm />} />
        <Route path="payroll/:id"     element={<PayrollForm />} />
        <Route path="recruitment"     element={<RecruitmentPage />} />
        <Route path="recruitment/new" element={<RecruitmentForm />} />
        <Route path="recruitment/:id" element={<RecruitmentForm />} />
        <Route path="appraisals"      element={<AppraisalsPage />} />
        <Route path="appraisals/new"  element={<AppraisalsForm />} />
        <Route path="appraisals/:id"  element={<AppraisalsForm />} />
        <Route path="attendances"     element={<AttendancesPage />} />
        <Route path="attendances/new" element={<AttendancesForm />} />
        <Route path="attendances/:id" element={<AttendancesForm />} />
        <Route path="fleet"           element={<FleetPage />} />
        <Route path="fleet/new"       element={<FleetForm />} />
        <Route path="fleet/:id"       element={<FleetForm />} />
        <Route path="frontdesk"       element={<FrontDeskPage />} />
        <Route path="frontdesk/new"   element={<FrontDeskForm />} />
        <Route path="frontdesk/:id"   element={<FrontDeskForm />} />
        <Route path="lunch"           element={<LunchPage />} />
        <Route path="lunch/new"       element={<LunchForm />} />
        <Route path="lunch/:id"       element={<LunchForm />} />

        {/* Marketing */}
        <Route path="email-marketing"       element={<EmailMarketingPage />} />
        <Route path="email-marketing/new"   element={<EmailMarketingForm />} />
        <Route path="email-marketing/:id"   element={<EmailMarketingForm />} />
        <Route path="sms"                   element={<SMSPage />} />
        <Route path="sms/new"               element={<SMSForm />} />
        <Route path="sms/:id"               element={<SMSForm />} />
        <Route path="social"                element={<SocialPage />} />
        <Route path="social/new"            element={<SocialForm />} />
        <Route path="social/:id"            element={<SocialForm />} />
        <Route path="events"                element={<EventsPage />} />
        <Route path="events/new"            element={<EventsForm />} />
        <Route path="events/:id"            element={<EventsForm />} />
        <Route path="marketing-automation"       element={<MarketingAutomationPage />} />
        <Route path="marketing-automation/new"   element={<MarketingAutomationForm />} />
        <Route path="marketing-automation/:id"   element={<MarketingAutomationForm />} />
        <Route path="surveys"     element={<SurveysPage />} />
        <Route path="surveys/new" element={<SurveysForm />} />
        <Route path="surveys/:id" element={<SurveysForm />} />

        {/* Services */}
        <Route path="timesheets"        element={<TimesheetsPage />} />
        <Route path="timesheets/new"    element={<TimesheetsForm />} />
        <Route path="timesheets/:id"    element={<TimesheetsForm />} />
        <Route path="helpdesk"          element={<HelpdeskPage />} />
        <Route path="helpdesk/new"      element={<HelpdeskForm />} />
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
      </Route>

      <Route path="*" element={<Navigate to="/erp" replace />} />
    </Routes>
  )
}
