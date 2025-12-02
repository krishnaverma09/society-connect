import React, { useState } from 'react'
import '../css/NoticeDetailsModal.css'
import { deleteNotice } from '../api/notices'

const NoticeDetailsModal = ({ notice, onClose, onDeleted, onEdit }) => {
  if (!notice) return null

  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const API_BASE = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
  const category = (notice.category || '').toLowerCase()

  const handleDelete = async () => {
    if (isDeleting) return
    if (!confirm('Delete this notice?')) return
    setError('')
    setIsDeleting(true)
    try {
      await deleteNotice(notice._id)
      onDeleted()
      onClose()
    } catch (e) {
      setError(e?.message || 'Failed to delete notice')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="scd-overlay">
      <div className="scd-card">
        <div className="scd-head">
          <div>
            <h2 className="scd-title">{notice.title}</h2>
            <p className="scd-meta">
              <span className="scd-badge" data-category={category}>{notice.category}</span>
              <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
            </p>
          </div>
          <div className="scd-actions">
            {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' && (
              <>
                <button onClick={() => onEdit(notice)} className="btn" disabled={isDeleting}>Edit</button>
                <button onClick={handleDelete} className="btn btn-danger" disabled={isDeleting}>
                  {isDeleting ? 'Deleting…' : 'Delete'}
                </button>
              </>
            )}
            <button onClick={onClose} className="btn" disabled={isDeleting}>Close</button>
          </div>
        </div>

        <div className="scd-body">
          {error && <div className="scd-error">{error}</div>}
          <p className="scd-desc">{notice.description}</p>

          {notice.attachments && notice.attachments.length > 0 && (
            <div className="scd-attach">
              <h3>Attachments</h3>
              <ul>
        {notice.attachments.map((att, idx) => (
                  <li key={idx}>
          <a href={`${API_BASE}${att}`} target="_blank" rel="noreferrer">
            📎 View attachment {idx + 1}
          </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NoticeDetailsModal
