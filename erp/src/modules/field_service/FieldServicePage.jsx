/**
 * FieldServicePage.jsx — Field Service module (stub)
 * Uses GenericStubPage for full data-erp selector coverage.
 */
import GenericStubPage from '../GenericStubPage.jsx'

const SEED = [
  { id: 1, name: 'Field Service Record 1', type: 'Type A', status: 'Active',  description: 'Sample record' },
  { id: 2, name: 'Field Service Record 2', type: 'Type B', status: 'Pending', description: 'Another record' },
  { id: 3, name: 'Field Service Record 3', type: 'Type A', status: 'Active',  description: 'Third record' },
]

export function FieldServicePage() {
  return (
    <GenericStubPage
      title="Field Service"
      icon="🔧"
      seedData={SEED}
      kanbanMode={false}
      sidebarItems={['Tasks', 'Planning', 'Reports']}
    />
  )
}

export function FieldServiceForm() {
  return (
    <GenericStubPage
      title="New Field Service"
      icon="🔧"
      seedData={[]}
      kanbanMode={false}
      sidebarItems={['Tasks', 'Planning', 'Reports']}
    />
  )
}
