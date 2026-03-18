/**
 * LiveChatPage.jsx — Live Chat module
 * Lesson 36: Live Chat
 * Selectors: field-name, save-button, create-button
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import WebsiteShell from '../website/WebsiteShell'
import { PageHeader, GenericList, GenericForm, StatusBadge } from '../website/websiteHelpers'
import { useRecordList } from '@data/useRecord.js'
import { createRecord, getRecord, updateRecord } from '@data/db.js'

async function seedChannels() {
  const { listRecords } = await import('@data/db.js')
  const existing = await listRecords('live.chat.channel')
  if (existing.length > 0) return
  const channels = [
    { name: 'YourCompany LiveChat', active: true, website_published: true,  default_message: 'Hi! How can I help?' },
    { name: 'Support',              active: true, website_published: false, default_message: 'Welcome to support!' },
  ]
  for (const c of channels) await createRecord('live.chat.channel', c)
}

export function LiveChatPage() {
  const navigate = useNavigate()
  const { records, reload } = useRecordList('live.chat.channel', { sortKey: 'name' })

  useEffect(() => { seedChannels().then(reload) }, [])

  const columns = [
    { key: 'name',              label: 'Channel Name', style: { fontWeight: 500, color: 'var(--teal)' } },
    { key: 'website_published', label: 'Website',      render: v => <StatusBadge label={v ? 'Published' : 'Unpublished'} color={v ? 'var(--success)' : 'var(--text3)'} /> },
    { key: 'active',            label: 'Active',       render: v => <StatusBadge label={v ? 'Active' : 'Inactive'} color={v ? 'var(--success)' : 'var(--text3)'} /> },
  ]

  return (
    <WebsiteShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <PageHeader title="Live Chat Channels" onNew={() => navigate('/erp/livechat/new')} />
        <GenericList columns={columns} rows={records} onRowClick={r => navigate(`/erp/livechat/${r.id}`)} />
      </div>
    </WebsiteShell>
  )
}

export function LiveChatForm() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isNew    = !id || id === 'new'

  const [vals, setVals] = useState({
    name: '', default_message: '', button_text: 'Chat with us',
    input_placeholder: 'Ask something...', notification_text: '',
    button_background_color: '#875a7b', website_published: false,
  })
  const [tab, setTab] = useState('Channel')

  useEffect(() => {
    if (!isNew) getRecord('live.chat.channel', id).then(r => r && setVals(r))
  }, [id])

  const handleSave = async () => {
    if (isNew) await createRecord('live.chat.channel', vals)
    else       await updateRecord('live.chat.channel', id, vals)
    navigate('/erp/livechat')
  }

  const channelFields = [
    { key: 'name',             label: 'Channel Name',    required: true, dataErp: 'field-name', fullWidth: true },
    { key: 'default_message',  label: 'Welcome Message', dataErp: 'field-description' },
    { key: 'button_text',      label: 'Button Text' },
  ]
  const optionsFields = [
    { key: 'notification_text',         label: 'Notification Text',      dataErp: 'field-description', fullWidth: true },
    { key: 'input_placeholder',         label: 'Input Placeholder',      dataErp: 'field-name' },
    { key: 'button_background_color',   label: 'Button Color',           placeholder: '#875a7b' },
    { key: 'website_published',         label: 'Published on Website',   type: 'toggle', onLabel: 'Published', offLabel: 'Unpublished' },
  ]

  return (
    <WebsiteShell>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <GenericForm
          fields={tab === 'Channel' ? channelFields : optionsFields}
          values={vals}
          onChange={(k, v) => setVals(p => ({ ...p, [k]: v }))}
          onSave={handleSave}
          onDiscard={() => navigate('/erp/livechat')}
          tabs={['Channel', 'Options']}
          activeTab={tab}
          onTabChange={setTab}
        />
      </div>
    </WebsiteShell>
  )
}
