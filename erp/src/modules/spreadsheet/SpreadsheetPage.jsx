/**
 * SpreadsheetPage.jsx — Spreadsheet module (stub)
 * Uses GenericStubPage for full data-erp selector coverage.
 */
import GenericStubPage from '../GenericStubPage.jsx'

const SEED = [
  { id: 1, name: 'Spreadsheet Record 1', type: 'Type A', status: 'Active',  description: 'Sample record' },
  { id: 2, name: 'Spreadsheet Record 2', type: 'Type B', status: 'Pending', description: 'Another record' },
  { id: 3, name: 'Spreadsheet Record 3', type: 'Type A', status: 'Active',  description: 'Third record' },
]

export function SpreadsheetPage() {
  return (
    <GenericStubPage
      title="Spreadsheet"
      icon="📊"
      seedData={SEED}
      kanbanMode={false}
      sidebarItems={[]}
    />
  )
}

export function SpreadsheetForm() {
  return (
    <GenericStubPage
      title="New Spreadsheet"
      icon="📊"
      seedData={[]}
      kanbanMode={false}
      sidebarItems={[]}
    />
  )
}
