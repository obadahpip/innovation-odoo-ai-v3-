/**
 * KnowledgePage.jsx — Knowledge module (stub)
 * Uses GenericStubPage for full data-erp selector coverage.
 */
import GenericStubPage from '../GenericStubPage.jsx'

const SEED = [
  { id: 1, name: 'Knowledge Record 1', type: 'Type A', status: 'Active',  description: 'Sample record' },
  { id: 2, name: 'Knowledge Record 2', type: 'Type B', status: 'Pending', description: 'Another record' },
  { id: 3, name: 'Knowledge Record 3', type: 'Type A', status: 'Active',  description: 'Third record' },
]

export function KnowledgePage() {
  return (
    <GenericStubPage
      title="Knowledge"
      icon="📚"
      seedData={SEED}
      kanbanMode={true}
      sidebarItems={['Workspace', 'Articles', 'Favorites']}
    />
  )
}

export function KnowledgeForm() {
  return (
    <GenericStubPage
      title="New Knowledge"
      icon="📚"
      seedData={[]}
      kanbanMode={false}
      sidebarItems={['Workspace', 'Articles', 'Favorites']}
    />
  )
}
