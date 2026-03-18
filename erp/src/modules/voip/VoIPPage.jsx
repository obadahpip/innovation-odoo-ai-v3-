/**
 * VoIPPage.jsx — VoIP module (stub)
 * Uses GenericStubPage for full data-erp selector coverage.
 */
import GenericStubPage from '../GenericStubPage.jsx'

const SEED = [
  { id: 1, name: 'VoIP Record 1', type: 'Type A', status: 'Active',  description: 'Sample record' },
  { id: 2, name: 'VoIP Record 2', type: 'Type B', status: 'Pending', description: 'Another record' },
  { id: 3, name: 'VoIP Record 3', type: 'Type A', status: 'Active',  description: 'Third record' },
]

export function VoIPPage() {
  return (
    <GenericStubPage
      title="VoIP"
      icon="📞"
      seedData={SEED}
      kanbanMode={false}
      sidebarItems={['Calls', 'Configuration']}
    />
  )
}

export function VoIPForm() {
  return (
    <GenericStubPage
      title="New VoIP"
      icon="📞"
      seedData={[]}
      kanbanMode={false}
      sidebarItems={['Calls', 'Configuration']}
    />
  )
}
