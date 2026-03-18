/**
 * TodoPage.jsx — To-Do module (stub)
 * Uses GenericStubPage for full data-erp selector coverage.
 */
import GenericStubPage from '../GenericStubPage.jsx'

const SEED = [
  { id: 1, name: 'To-Do Record 1', type: 'Type A', status: 'Active',  description: 'Sample record' },
  { id: 2, name: 'To-Do Record 2', type: 'Type B', status: 'Pending', description: 'Another record' },
  { id: 3, name: 'To-Do Record 3', type: 'Type A', status: 'Active',  description: 'Third record' },
]

export function TodoPage() {
  return (
    <GenericStubPage
      title="To-Do"
      icon="✅"
      seedData={SEED}
      kanbanMode={false}
      sidebarItems={['My Tasks', 'All Tasks']}
    />
  )
}

export function TodoForm() {
  return (
    <GenericStubPage
      title="New To-Do"
      icon="✅"
      seedData={[]}
      kanbanMode={false}
      sidebarItems={['My Tasks', 'All Tasks']}
    />
  )
}
