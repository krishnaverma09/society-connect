import React from 'react'
import './NoticeCard.css'

const NoticeCard = ({ notice, onView }) => {
  const date = new Date(notice.createdAt).toLocaleDateString()

  return (
    <div className="notice-card">
      <div className="notice-card-head">
        <h3 className="notice-card-title">{notice.title}</h3>
        <span className="notice-card-badge">{notice.category}</span>
      </div>
      <p className="notice-card-desc">{notice.description}</p>
      <div className="notice-card-foot">
        <span className="notice-date">{date}</span>
        <button onClick={() => onView(notice)} className="notice-view-btn">View</button>
      </div>
    </div>
  )
}

export default NoticeCard
