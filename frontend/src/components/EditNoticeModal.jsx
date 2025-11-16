import React, { useState } from 'react'
import { updateNotice } from '../api/notices'
import './CreateNoticeModal.css'

const EditNoticeModal = ({ notice, onClose, onUpdated }) => {
  const [title, setTitle] = useState(notice?.title || '')
  const [category, setCategory] = useState(notice?.category || 'General')
  const [description, setDescription] = useState(notice?.description || '')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFiles = (e) => setFiles(Array.from(e.target.files))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const form = new FormData()
      if (title) form.append('title', title)
      if (category) form.append('category', category)
      if (description) form.append('description', description)
      files.forEach((f) => form.append('attachments', f))
      await updateNotice(notice._id, form)
      onUpdated()
      onClose()
    } catch (err) {
      setError(err?.message || 'Failed to update notice')
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
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z" fill="#e53935" opacity=".25"/>
              <path d="m14.06 7.81 2.13-2.12a1.5 1.5 0 1 1 2.12 2.12L16.18 9.94m-2.12-2.13L5.25 16.62" stroke="#e53935" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </span>
          <div className="sc-modal-title">Edit Notice</div>
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
              <label className="sc-label">Add Attachments</label>
              <input id="sc-edit-files" className="sc-file" type="file" multiple onChange={handleFiles} />
              <label htmlFor="sc-edit-files" className="sc-file-drop">
                <div style={{fontWeight:600,color:'#374151'}}>Click to upload or drag files</div>
                <div className="sc-file-info">PDFs, images, docs up to 10 files</div>
              </label>
              {files && files.length > 0 && (
                <div className="sc-file-info">{files.length} new file(s) selected</div>
              )}
            </div>

            <div className="sc-modal-actions">
              <button type="button" onClick={onClose} className="btn">Cancel</button>
              <button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Saving...' : 'Save changes'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditNoticeModal
