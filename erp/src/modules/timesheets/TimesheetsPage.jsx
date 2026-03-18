/**
 * TimesheetsPage.jsx — Timesheets module (stub)
 * Uses GenericStubPage for full data-erp selector coverage.
 */
import GenericStubPage from '../GenericStubPage.jsx'

const SEED = [
  { id: 1, name: 'Timesheets Record 1', type: 'Type A', status: 'Active',  description: 'Sample record' },
  { id: 2, name: 'Timesheets Record 2', type: 'Type B', status: 'Pending', description: 'Another record' },
  { id: 3, name: 'Timesheets Record 3', type: 'Type A', status: 'Active',  description: 'Third record' },
]

export function TimesheetsPage() {
  return (
    <GenericStubPage
      title="Timesheets"
      icon="⏱"
      seedData={SEED}
      kanbanMode={false}
      sidebarItems={['My Timesheets', 'All Timesheets']}
    />
  )
}

export function TimesheetsForm() {
  return (
    <GenericStubPage
      title="New Timesheets"
      icon="⏱"
      seedData={[]}
      kanbanMode={false}
      sidebarItems={['My Timesheets', 'All Timesheets']}
    />
  )
}
