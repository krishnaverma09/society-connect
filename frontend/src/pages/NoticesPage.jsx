import React, { useEffect, useState } from 'react'
import { fetchNotices } from '../api/notices'
import NoticeCard from '../components/NoticeCard'
import CreateNoticeModal from '../components/CreateNoticeModal'
import EditNoticeModal from '../components/EditNoticeModal'
import NoticeDetailsModal from '../components/NoticeDetailsModal'
import Navbar from '../components/Navbar'
import './NoticesPage.css'

const NoticesPage = () => {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(null)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetchNotices()
      setNotices(res.data.notices || [])
      setError('')
    } catch (err) {
      setError(err?.message || 'Failed to load notices')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="min-h-screen bg-white notices-wrap">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 notices-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 notices-title">Notices</h1>
            <p className="mt-1 text-sm text-gray-500 notices-subtitle">Stay updated with the latest announcements.</p>
          </div>
          {user.role === 'admin' && (
            <button
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 notices-create-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Create Notice
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="rounded-lg border border-gray-200 p-6 text-gray-500 notices-state">Loading notices...</div>
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3 notices-error">{error}</div>
        ) : notices.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white px-6 py-10 text-center notices-empty">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 notices-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4l8 4-8 4-8-4 8-4Zm0 8l8 4-8 4-8-4 8-4Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900">No notices found</h3>
            <p className="mt-1 text-sm text-gray-500">Announcements will appear here when available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 notices-grid">
            {notices.map((n) => (
              <NoticeCard key={n._id} notice={n} onView={(notice) => setSelected(notice)} />
            ))}
          </div>
        )}

        {showCreate && (
          <CreateNoticeModal onClose={() => setShowCreate(false)} onCreated={() => load()} />
        )}

        {selected && (
          <NoticeDetailsModal
            notice={selected}
            onClose={() => setSelected(null)}
            onDeleted={() => load()}
            onEdit={(n) => { setSelected(null); setEditing(n) }}
          />
        )}

        {editing && (
          <EditNoticeModal
            notice={editing}
            onClose={() => setEditing(null)}
            onUpdated={() => load()}
          />
        )}
      </div>
    </div>
  )
}

export default NoticesPage
