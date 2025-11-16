import axios from './axios'

export const fetchNotices = () => axios.get('/api/notices')

export const fetchNotice = (id) => axios.get(`/api/notices/${id}`)

export const createNotice = (formData) => {
  // formData is a FormData instance
  return axios.post('/api/notices', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const updateNotice = (id, formData) => {
  return axios.put(`/api/notices/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const deleteNotice = (id) => axios.delete(`/api/notices/${id}`)

export default { fetchNotices, fetchNotice, createNotice, updateNotice, deleteNotice }
