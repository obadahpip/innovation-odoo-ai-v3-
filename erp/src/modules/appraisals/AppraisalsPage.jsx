/**
 * AppraisalsPage.jsx — Appraisals module (stub)
 * Uses GenericStubPage for full data-erp selector coverage.
 */
import GenericStubPage from '../GenericStubPage.jsx'

const SEED = [
  { id: 1, name: 'Appraisals Record 1', type: 'Type A', status: 'Active',  description: 'Sample record' },
  { id: 2, name: 'Appraisals Record 2', type: 'Type B', status: 'Pending', description: 'Another record' },
  { id: 3, name: 'Appraisals Record 3', type: 'Type A', status: 'Active',  description: 'Third record' },
]

export function AppraisalsPage() {
  return (
    <GenericStubPage
      title="Appraisals"
      icon="⭐"
      seedData={SEED}
      kanbanMode={false}
      sidebarItems={['Appraisals', 'Analysis']}
    />
  )
}

export function AppraisalsForm() {
  return (
    <GenericStubPage
      title="New Appraisals"
      icon="⭐"
      seedData={[]}
      kanbanMode={false}
      sidebarItems={['Appraisals', 'Analysis']}
    />
  )
}
