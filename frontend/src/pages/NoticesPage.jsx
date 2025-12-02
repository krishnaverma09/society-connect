import React, { useEffect, useState } from 'react'
import { fetchNotices } from '../api/notices'
import NoticeCard from '../components/NoticeCard'
import CreateNoticeModal from '../components/CreateNoticeModal'
import EditNoticeModal from '../components/EditNoticeModal'
import NoticeDetailsModal from '../components/NoticeDetailsModal'
import '../css/NoticesPage.css'

const NoticesPage = () => {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('all')

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

  const filteredNotices = categoryFilter === 'all' 
    ? notices 
    : notices.filter(n => (n.category || '').toLowerCase() === categoryFilter.toLowerCase())

  return (
    <div className="notices-wrap">
      <div className="notices-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 notices-title">Notices</h1>
            <p className="mt-1 text-sm text-gray-500 notices-subtitle">Stay updated with the latest announcements.</p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-6 flex flex-wrap gap-2 notices-filters">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              categoryFilter === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setCategoryFilter('maintenance')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              categoryFilter === 'maintenance'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Maintenance
          </button>
          <button
            onClick={() => setCategoryFilter('event')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              categoryFilter === 'event'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Event
          </button>
          <button
            onClick={() => setCategoryFilter('emergency')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              categoryFilter === 'emergency'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Emergency
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="rounded-lg border border-gray-200 p-6 text-gray-500 notices-state">Loading notices...</div>
        ) : error ? (
          <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3 notices-error">{error}</div>
        ) : filteredNotices.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white px-6 py-10 text-center notices-empty">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 notices-badge">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4l8 4-8 4-8-4 8-4Zm0 8l8 4-8 4-8-4 8-4Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900">No notices found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {categoryFilter === 'all' 
                ? 'Announcements will appear here when available.' 
                : `No ${categoryFilter} notices available.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 notices-grid">
            {filteredNotices.map((n) => (
              <NoticeCard key={n._id} notice={n} onView={(notice) => setSelected(notice)} />
            ))}
          </div>
        )}

        {/* Floating Create Button */}
        {user.role === 'admin' && (
          <button
            onClick={() => setShowCreate(true)}
            className="notices-create-btn-floating"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Create Notice
          </button>
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
