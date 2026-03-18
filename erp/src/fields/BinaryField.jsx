/**
 * BinaryField.jsx — file upload / image display
 */
import { useRef } from 'react'

export default function BinaryField({ value, onChange, readonly, label, isImage=false, accept='*/*' }) {
  const inputRef = useRef(null)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => onChange?.({ name: file.name, data: ev.target.result, mimetype: file.type, size: file.size })
    reader.readAsDataURL(file)
  }

  // Image display mode
  if (isImage) {
    const src = value?.data ?? value
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'flex-start' }}>
        {src ? (
          <img src={src} alt={label} style={{ width:80, height:80, objectFit:'cover', borderRadius:6, border:'1px solid var(--border2)' }} />
        ) : (
          <div style={{
            width:80, height:80, borderRadius:6, background:'var(--surface2)',
            border:'2px dashed var(--border2)', display:'flex', alignItems:'center', justifyContent:'center',
            color:'var(--text3)', fontSize:11,
          }}>No image</div>
        )}
        {!readonly && (
          <button className="btn btn-secondary btn-sm" onClick={() => inputRef.current?.click()}>
            {src ? 'Change' : 'Upload'}
          </button>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} style={{ display:'none' }} />
      </div>
    )
  }

  // File mode
  const fileName = value?.name ?? (typeof value==='string' ? value : null)
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      {fileName && (
        <span style={{ fontSize:12, color:'var(--teal)', cursor:'pointer' }}>📄 {fileName}</span>
      )}
      {!readonly && (
        <>
          <button className="btn btn-secondary btn-sm" onClick={() => inputRef.current?.click()}>
            {fileName ? 'Replace' : 'Upload file'}
          </button>
          {fileName && (
            <button className="btn btn-secondary btn-sm" onClick={() => onChange?.(null)}>Remove</button>
          )}
        </>
      )}
      {!fileName && readonly && <span style={{ color:'var(--text3)', fontSize:13 }}>—</span>}
      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} style={{ display:'none' }} />
    </div>
  )
}
