/**
 * DocumentsPage.jsx — Documents module (stub)
 * Uses GenericStubPage for full data-erp selector coverage.
 */
import GenericStubPage from '../GenericStubPage.jsx'

const SEED = [
  { id: 1, name: 'Documents Record 1', type: 'Type A', status: 'Active',  description: 'Sample record' },
  { id: 2, name: 'Documents Record 2', type: 'Type B', status: 'Pending', description: 'Another record' },
  { id: 3, name: 'Documents Record 3', type: 'Type A', status: 'Active',  description: 'Third record' },
]

export function DocumentsPage() {
  return (
    <GenericStubPage
      title="Documents"
      icon="📄"
      seedData={SEED}
      kanbanMode={false}
      sidebarItems={['My Drive', 'Shared', 'Trash']}
    />
  )
}

export function DocumentsForm() {
  return (
    <GenericStubPage
      title="New Documents"
      icon="📄"
      seedData={[]}
      kanbanMode={false}
      sidebarItems={['My Drive', 'Shared', 'Trash']}
    />
  )
}
