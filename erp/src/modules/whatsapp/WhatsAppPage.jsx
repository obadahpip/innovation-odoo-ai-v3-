/**
 * WhatsAppPage.jsx — WhatsApp module (stub)
 * Uses GenericStubPage for full data-erp selector coverage.
 */
import GenericStubPage from '../GenericStubPage.jsx'

const SEED = [
  { id: 1, name: 'WhatsApp Record 1', type: 'Type A', status: 'Active',  description: 'Sample record' },
  { id: 2, name: 'WhatsApp Record 2', type: 'Type B', status: 'Pending', description: 'Another record' },
  { id: 3, name: 'WhatsApp Record 3', type: 'Type A', status: 'Active',  description: 'Third record' },
]

export function WhatsAppPage() {
  return (
    <GenericStubPage
      title="WhatsApp"
      icon="💬"
      seedData={SEED}
      kanbanMode={false}
      sidebarItems={['Messages', 'Templates']}
    />
  )
}

export function WhatsAppForm() {
  return (
    <GenericStubPage
      title="New WhatsApp"
      icon="💬"
      seedData={[]}
      kanbanMode={false}
      sidebarItems={['Messages', 'Templates']}
    />
  )
}
