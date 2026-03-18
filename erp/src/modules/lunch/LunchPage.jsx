/**
 * LunchPage.jsx — Lunch module (stub)
 * Uses GenericStubPage for full data-erp selector coverage.
 */
import GenericStubPage from '../GenericStubPage.jsx'

const SEED = [
  { id: 1, name: 'Lunch Record 1', type: 'Type A', status: 'Active',  description: 'Sample record' },
  { id: 2, name: 'Lunch Record 2', type: 'Type B', status: 'Pending', description: 'Another record' },
  { id: 3, name: 'Lunch Record 3', type: 'Type A', status: 'Active',  description: 'Third record' },
]

export function LunchPage() {
  return (
    <GenericStubPage
      title="Lunch"
      icon="🍕"
      seedData={SEED}
      kanbanMode={false}
      sidebarItems={['Todays Meal', 'Orders', 'Products']}
    />
  )
}

export function LunchForm() {
  return (
    <GenericStubPage
      title="New Lunch"
      icon="🍕"
      seedData={[]}
      kanbanMode={false}
      sidebarItems={['Todays Meal', 'Orders', 'Products']}
    />
  )
}
