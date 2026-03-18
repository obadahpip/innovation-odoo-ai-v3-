/**
 * AttendancesPage.jsx — Attendances module (stub)
 * Uses GenericStubPage for full data-erp selector coverage.
 */
import GenericStubPage from '../GenericStubPage.jsx'

const SEED = [
  { id: 1, name: 'Attendances Record 1', type: 'Type A', status: 'Active',  description: 'Sample record' },
  { id: 2, name: 'Attendances Record 2', type: 'Type B', status: 'Pending', description: 'Another record' },
  { id: 3, name: 'Attendances Record 3', type: 'Type A', status: 'Active',  description: 'Third record' },
]

export function AttendancesPage() {
  return (
    <GenericStubPage
      title="Attendances"
      icon="🕐"
      seedData={SEED}
      kanbanMode={false}
      sidebarItems={['Check In/Out', 'All Attendances']}
    />
  )
}

export function AttendancesForm() {
  return (
    <GenericStubPage
      title="New Attendances"
      icon="🕐"
      seedData={[]}
      kanbanMode={false}
      sidebarItems={['Check In/Out', 'All Attendances']}
    />
  )
}
