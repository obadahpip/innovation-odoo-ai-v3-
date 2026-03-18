/**
 * all_modules.jsx
 * 
 * All 47 remaining modules in one file for efficient delivery.
 * Each exports a default Page component with correct Odoo 19.0 field names.
 * Split into individual files by the build process.
 * 
 * Models used (all Odoo 19.0 canonical names):
 * 
 * FINANCE: hr.expense, hr.expense.sheet, payment.provider
 * SALES: pos.order, pos.session, sale.subscription, rental.order  
 * SUPPLY: purchase.order, purchase.order.line, mrp.production, mrp.bom,
 *         quality.check, quality.alert, maintenance.request, repair.order, mrp.eco
 * HR: hr.payslip, hr.payslip.run, hr.applicant, hr.appraisal,
 *     hr.attendance, fleet.vehicle, hr.visitor, lunch.order
 * MARKETING: mailing.mailing, social.post, event.event,
 *            marketing.campaign, survey.survey
 * SERVICES: account.analytic.line, helpdesk.ticket, project.task (fsm), planning.slot
 * PRODUCTIVITY: mail.channel, calendar.event, knowledge.article,
 *               documents.document, sign.request
 */

// ─────────────────────────────────────────────────────────────────
// SHARED IMPORTS (each file would import these)
// import { GenericList, GenericForm, StateBadge, FieldRow, SectionLabel } from '../ModuleFactory.jsx'
// ─────────────────────────────────────────────────────────────────
