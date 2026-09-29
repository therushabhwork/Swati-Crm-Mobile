import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaComments, FaPaperPlane, FaSearch, FaSyncAlt, FaUser, FaBuilding, FaTag, FaCalendarAlt } from 'react-icons/fa'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { useAuth } from '../../context/AuthContext'
import { remarkApi } from '../../services/remarkApi'
import { formatDate } from '../../utils/helpers'

const CommunicationActivitiesPage = ({ isAdmin = false }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [remarks, setRemarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Detail Modal State
  const [selectedRemark, setSelectedRemark] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [postingReply, setPostingReply] = useState(false)

  const fetchRemarks = useCallback(async () => {
    setLoading(true)
    try {
      const data = await remarkApi.getAllRemarks()
      setRemarks(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch communication activities:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRemarks()
  }, [fetchRemarks])

  const userEmail = useMemo(() => (
    (user?.email || user?.userEmail || '').trim().toLowerCase()
  ), [user])

  const userName = useMemo(() => (
    (user?.name || user?.fullName || user?.userName || '').trim().toLowerCase()
  ), [user])

  const filteredRemarks = useMemo(() => {
    return remarks.filter((rem) => {
      // Non-admin email filter: only show records created by or owned by the logged-in user
      const currentUserIsAdmin = isAdmin || user?.role === 'admin'
      if (!currentUserIsAdmin && userEmail) {
        const createdByEmail = (rem.createdByEmail || rem.createdUserBy || rem.userEmail || '').trim().toLowerCase()
        const dealOwnerEmail = (rem.dealOwnerEmail || '').trim().toLowerCase()
        const accountOwnerEmail = (rem.accountOwnerEmail || '').trim().toLowerCase()
        const createdByName = (rem.createdByName || '').trim().toLowerCase()

        const isMatch = (
          (createdByEmail && createdByEmail === userEmail) ||
          (dealOwnerEmail && dealOwnerEmail === userEmail) ||
          (accountOwnerEmail && accountOwnerEmail === userEmail) ||
          (userName && createdByName && createdByName === userName)
        )
        if (!isMatch) return false
      }

      // Type Filter
      if (typeFilter !== 'all') {
        const entityType = (rem.relatedEntityType || '').toLowerCase()
        if (typeFilter === 'deal' && entityType !== 'deal') return false
        if (typeFilter === 'account' && entityType !== 'account') return false
      }

      // Category Filter
      if (categoryFilter !== 'all') {
        if ((rem.category || 'general').toLowerCase() !== categoryFilter.toLowerCase()) return false
      }

      // Search Filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase()
        const name = (rem.dealName || rem.accountName || '').toLowerCase()
        const content = (rem.content || '').toLowerCase()
        const owner = (rem.recordOwnerName || rem.dealOwnerName || rem.accountOwnerName || rem.ownerName || '').toLowerCase()
        const creator = (rem.createdByName || '').toLowerCase()
        const category = (rem.category || '').toLowerCase()

        return (
          name.includes(query) ||
          content.includes(query) ||
          owner.includes(query) ||
          creator.includes(query) ||
          category.includes(query)
        )
      }

      return true
    })
  }, [remarks, isAdmin, user, userEmail, userName, typeFilter, categoryFilter, searchTerm])

  const handleRowClick = (rem) => {
    setSelectedRemark(rem)
    setReplyContent('')
    setIsDetailModalOpen(true)
  }

  // Related Thread Remarks for Selected Item (matching same Account/Deal)
  const threadRemarks = useMemo(() => {
    if (!selectedRemark) return []
    const isDeal = selectedRemark.relatedEntityType === 'deal'
    const targetId = isDeal ? (selectedRemark.dealId || selectedRemark.id) : (selectedRemark.accountId || selectedRemark.id)
    if (!targetId) return [selectedRemark]

    return remarks.filter((r) => {
      const rIsDeal = r.relatedEntityType === 'deal'
      if (isDeal !== rIsDeal) return false

      if (isDeal) {
        const rDealId = r.dealId || r.id
        return String(rDealId || '') === String(targetId) || (selectedRemark.dealName && r.dealName === selectedRemark.dealName)
      }

      const rAccountId = r.accountId || r.id
      return String(rAccountId || '') === String(targetId) || (selectedRemark.accountName && r.accountName === selectedRemark.accountName)
    }).sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
  }, [remarks, selectedRemark])

  const handleSendReply = async (e) => {
    e.preventDefault()
    if (!replyContent.trim() || !selectedRemark || postingReply) return

    setPostingReply(true)
    try {
      const isDeal = selectedRemark.relatedEntityType === 'deal'
      const payload = {
        accountId: isDeal ? null : (selectedRemark.accountId || null),
        dealId: isDeal ? (selectedRemark.dealId || null) : null,
        category: selectedRemark.category || 'general',
        content: replyContent.trim(),
      }

      await remarkApi.createRemark(payload)
      setReplyContent('')
      await fetchRemarks()
    } catch (error) {
      console.error('Failed to post remark reply:', error)
    } finally {
      setPostingReply(false)
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '14px',
            }}
          >
            <FaArrowLeft /> Back
          </button>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', color: '#1e293b' }}>
            <FaComments style={{ color: '#2563eb' }} /> Communication Activities (Notes & Remarks)
          </h2>
        </div>
        <button
          type="button"
          onClick={fetchRemarks}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            color: '#334155',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          <FaSyncAlt /> Refresh
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          background: '#f8fafc',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          alignItems: 'center',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 250px' }}>
          <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Type:</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          >
            <option value="all">All Types</option>
            <option value="deal">Deal</option>
            <option value="account">Account</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#ffffff', color: '#0f172a' }}
          >
            <option value="all">All Categories</option>
            <option value="feedback">Feedback</option>
            <option value="general">General</option>
            <option value="call-log">Call Log</option>
          </select>
        </div>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#475569', fontWeight: 500 }}>Loading communication activities...</div>
        ) : filteredRemarks.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#475569', fontWeight: 500 }}>No communication activities found</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="comm-activities-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px', color: '#0f172a' }}>
              <thead>
                <tr className="comm-activities-thead-tr" style={{ background: '#740A03', borderBottom: '2px solid #ffffff', color: '#ffffff', fontWeight: 700 }}>
                  <th style={{ padding: '14px 16px', width: '40px', background: '#740A03', color: '#ffffff' }}></th>
                  <th style={{ padding: '14px 16px', background: '#740A03', color: '#ffffff' }}>Type</th>
                  <th style={{ padding: '14px 16px', background: '#740A03', color: '#ffffff' }}>Name</th>
                  <th style={{ padding: '14px 16px', background: '#740A03', color: '#ffffff' }}>Category</th>
                  <th style={{ padding: '14px 16px', background: '#740A03', color: '#ffffff' }}>Remark / Note</th>
                  <th style={{ padding: '14px 16px', background: '#740A03', color: '#ffffff' }}>Record Owner</th>
                  <th style={{ padding: '14px 16px', background: '#740A03', color: '#ffffff' }}>Activity By</th>
                  <th style={{ padding: '14px 16px', background: '#740A03', color: '#ffffff' }}>Discussion</th>
                  <th style={{ padding: '14px 16px', background: '#740A03', color: '#ffffff' }}>Start Time</th>
                  <th style={{ padding: '14px 16px', background: '#740A03', color: '#ffffff' }}>End Time</th>
                  <th style={{ padding: '14px 16px', background: '#740A03', color: '#ffffff' }}>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredRemarks.map((rem, idx) => {
                  const isDeal = rem.relatedEntityType === 'deal'
                  const ownerName = rem.recordOwnerName || rem.dealOwnerName || rem.accountOwnerName || rem.ownerName || '-'
                  const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc'
                  return (
                    <tr
                      key={rem.id}
                      style={{ background: rowBg, borderBottom: '1px solid #e2e8f0', cursor: 'pointer', transition: 'background-color 0.15s' }}
                      onClick={() => handleRowClick(rem)}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9' }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = rowBg }}
                    >
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <FaComments style={{ color: '#2563eb', fontSize: '16px' }} title="Click to view details & chat replies" />
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge variant={isDeal ? 'info' : 'success'}>
                          {isDeal ? 'Deal' : 'Account'}
                        </Badge>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>
                        {rem.dealName || rem.accountName || '-'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '4px',
                          background: rem.category === 'call-log' ? '#fef3c7' : '#e2e8f0',
                          color: rem.category === 'call-log' ? '#92400e' : '#1e293b',
                          fontSize: '12px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                        }}>
                          {rem.category || 'general'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#1e293b', maxWidth: '320px', fontWeight: 500 }}>
                        <div>{rem.content || '-'}</div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#334155', fontWeight: 500 }}>
                        {ownerName}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#334155', fontWeight: 500 }}>
                        {rem.createdByName || rem.authorName || 'User'}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#2563eb', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <FaComments /> Discussion
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {rem.startTime || (rem.category === 'call-log' ? (rem.callLogTime || '-') : '-')}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {rem.endTime || '-'}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569', whiteSpace: 'nowrap', fontWeight: 500 }}>
                        {rem.remarkDate ? formatDate(rem.remarkDate, 'long') : (rem.createdAt ? formatDate(rem.createdAt, 'long') : '-')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Row Click Detail & Chat Replies Modal */}
      {selectedRemark && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Communication Detail - ${selectedRemark.dealName || selectedRemark.accountName || 'Record'}`}
          size="large"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '75vh', overflowY: 'auto', paddingRight: '4px' }}>
            {/* Top Section: Account / Deal Details Header Card */}
            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Badge variant={selectedRemark.relatedEntityType === 'deal' ? 'info' : 'success'}>
                    {selectedRemark.relatedEntityType === 'deal' ? 'Deal Details' : 'Account Details'}
                  </Badge>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>
                    {selectedRemark.dealName || selectedRemark.accountName || 'Record Details'}
                  </h3>
                </div>
                <span style={{ fontSize: '13px', background: '#e2e8f0', padding: '4px 10px', borderRadius: '12px', fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>
                  Category: {selectedRemark.category || 'general'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '13px', color: '#475569' }}>
                <div>
                  <strong style={{ color: '#1e293b' }}><FaUser style={{ marginRight: '6px', color: '#2563eb' }} />Record Owner:</strong>{' '}
                  {selectedRemark.recordOwnerName || selectedRemark.dealOwnerName || selectedRemark.accountOwnerName || selectedRemark.ownerName || '-'}
                </div>
                <div>
                  <strong style={{ color: '#1e293b' }}><FaBuilding style={{ marginRight: '6px', color: '#16a34a' }} />Created By:</strong>{' '}
                  {selectedRemark.createdByName || 'User'}
                </div>
                <div>
                  <strong style={{ color: '#1e293b' }}><FaCalendarAlt style={{ marginRight: '6px', color: '#eab308' }} />Created Date:</strong>{' '}
                  {selectedRemark.createdAt ? formatDate(selectedRemark.createdAt) : '-'}
                </div>
                {selectedRemark.accountNo && (
                  <div>
                    <strong style={{ color: '#1e293b' }}><FaTag style={{ marginRight: '6px', color: '#9333ea' }} />Account No:</strong>{' '}
                    {selectedRemark.accountNo}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section: Chat Replies & Discussion Thread */}
            <div style={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '18px' }}>
              <h4 style={{ margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#1e293b' }}>
                <FaComments style={{ color: '#2563eb' }} /> Remarks & Chat Discussion Replies ({threadRemarks.length})
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', maxHeight: '280px', overflowY: 'auto', paddingRight: '6px' }}>
                {threadRemarks.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    style={{
                      background: item.id === selectedRemark.id ? '#eff6ff' : '#f8fafc',
                      border: item.id === selectedRemark.id ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                      padding: '12px 14px',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px', color: '#1e293b' }}>
                        {item.createdByName || 'User'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {item.createdAt ? formatDate(item.createdAt) : '-'}
                      </span>
                    </div>
                    <div style={{ fontSize: '13.5px', color: '#334155', lineHeight: '1.4' }}>
                      {item.content}
                    </div>
                    {item.category === 'call-log' && (item.startTime || item.endTime || item.callLogTime) && (
                      <div style={{ fontSize: '12px', color: '#0284c7', marginTop: '6px', fontWeight: 600 }}>
                        Call Duration: {item.startTime || item.callLogTime || '09:00'} - {item.endTime || '09:30'}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chat Reply Form */}
              <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Type a reply regarding this remark..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  disabled={postingReply}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={postingReply || !replyContent.trim()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 18px',
                    borderRadius: '6px',
                    border: 'none',
                    background: postingReply || !replyContent.trim() ? '#94a3b8' : '#2563eb',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '14px',
                    cursor: postingReply || !replyContent.trim() ? 'not-allowed' : 'pointer',
                  }}
                >
                  <FaPaperPlane /> {postingReply ? 'Sending...' : 'Reply'}
                </button>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default CommunicationActivitiesPage
