import React, { useState } from 'react'
import { createNotice } from '../api/notices'
import '../css/CreateNoticeModal.css'

const CreateNoticeModal = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('General')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const form = new FormData()
      form.append('title', title)
      form.append('category', category)
      form.append('description', description)
      files.forEach((f) => form.append('attachments', f))

      await createNotice(form)
      onCreated()
      onClose()
    } catch (err) {
      setError(err?.message || 'Failed to create notice')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sc-modal-overlay">
      <div className="sc-modal-card">
        <div className="sc-modal-header">
          <span className="icon" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L2 9l10 6 10-6-10-6Z" fill="#e53935" opacity=".25"/>
              <path d="M2 15l10 6 10-6" stroke="#e53935" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 9l10 6 10-6" stroke="#e53935" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <div className="sc-modal-title">Create Notice</div>
        </div>
        <div className="sc-modal-body">
          {error && <div className="sc-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="sc-field">
              <label className="sc-label">
                <span className="icon" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 7h16M4 12h16M4 17h10" stroke="#e53935" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </span>
                Title
              </label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="sc-input" required />
            </div>

            <div className="sc-field">
              <label className="sc-label">
                <span className="icon" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2Z" stroke="#e53935" strokeWidth="1.2"/>
                  </svg>
                </span>
                Category
              </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="sc-select">
                <option>General</option>
                <option>Event</option>
                <option>Maintenance</option>
                <option>Emergency</option>
              </select>
            </div>

            <div className="sc-field">
              <label className="sc-label">
                <span className="icon" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 5h16M4 12h16M4 19h10" stroke="#e53935" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </span>
                Description
              </label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="sc-textarea" rows={5} required />
            </div>

            <div className="sc-field">
              <label className="sc-label">
                <span className="icon" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 10l-4 4-2-2" stroke="#e53935" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="3" y="3" width="18" height="14" rx="2" ry="2" stroke="#e53935" strokeWidth="1.2"/>
                    <path d="M8 21h8" stroke="#e53935" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </span>
                Attachments
              </label>
              <input id="sc-files" className="sc-file" type="file" multiple onChange={handleFiles} />
              <label htmlFor="sc-files" className="sc-file-drop">
                <div>
                  <div className="icon" aria-hidden>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16V4m0 12l-4-4m4 4l4-4" stroke="#e53935" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="3" y="12" width="18" height="8" rx="2" ry="2" stroke="#e53935" strokeWidth="1.2"/>
                    </svg>
                  </div>
                  <div style={{fontWeight:600,color:'#374151'}}>Click to upload or drag files</div>
                  <div className="sc-file-info">PDFs, images, docs up to 10 files</div>
                </div>
              </label>
              {files && files.length > 0 && (
                <div className="sc-file-info">{files.length} file(s) selected</div>
              )}
            </div>

            <div className="sc-modal-actions">
              <button type="button" onClick={onClose} className="btn">Cancel</button>
              <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Creating...' : 'Create'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateNoticeModal
