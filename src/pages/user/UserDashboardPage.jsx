import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaBell,
  FaChartLine,
  FaClipboardList,
  FaComments,
  FaHandshake,
  FaUsers,
} from 'react-icons/fa'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import apiClient from '../../services/apiClient'
import { remarkApi } from '../../services/remarkApi'
import {
  formatCurrency,
  formatDate,
  getPriorityColor,
  getStatusColor,
} from '../../utils/helpers'
import './UserDashboardPage.css'
import AnalyticsSection from '../../components/dashboard/AnalyticsSection'

const formatTodoDateTime = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const UserDashboardPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    accounts,
    deals,
    tasks,
    notifications,
    supportRequests,
    reminders,
    quotations,
    activities,
    updateReminder,
  } = useData()
  const [todoReplies, setTodoReplies] = useState([])
  const [remarksList, setRemarksList] = useState([])
  const [isCommunicationModalOpen, setIsCommunicationModalOpen] = useState(false)

  const fetchTodoReplies = useCallback(async () => {
    try {
      const res = await apiClient.get('/support-requests/todo/replies')
      setTodoReplies(Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []))
    } catch (error) {
      console.error('Failed to fetch todo replies:', error)
    }
  }, [])

  const fetchCommunicationRemarks = useCallback(async () => {
    try {
      const data = await remarkApi.getAllRemarks()
      setRemarksList(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch communication remarks:', error)
    }
  }, [])

  useEffect(() => {
    fetchTodoReplies()
    fetchCommunicationRemarks()
  }, [fetchTodoReplies, fetchCommunicationRemarks])

  const stats = useMemo(() => {
    const pendingTasks = tasks.filter((task) => task.status === 'pending')
    const openDeals = deals.filter((deal) => !['won', 'lost'].includes(String(deal.status || '').toLowerCase()))
    const openSupportRequests = supportRequests.filter((supportRequest) => String(supportRequest.status || '').toLowerCase() !== 'closed')

    return {
      accounts: accounts.length,
      deals: deals.length,
      dealValue: deals.reduce((sum, deal) => sum + (Number(deal.value) || 0), 0),
      openDeals: openDeals.length,
      tasks: tasks.length,
      pendingTasks: pendingTasks.length,
      supportRequests: supportRequests.length,
      openSupportRequests: openSupportRequests.length,
      notifications: notifications.length,
    }
  }, [accounts, deals, notifications.length, supportRequests, tasks])

  const recentDeals = useMemo(() => (
    [...deals]
      .sort((left, right) => new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime())
      .slice(0, 3)
  ), [deals])

  const upcomingTasks = useMemo(() => (
    tasks
      .filter((task) => task.status !== 'completed')
      .sort((left, right) => new Date(left.dueDate || left.createdAt || 0).getTime() - new Date(right.dueDate || right.createdAt || 0).getTime())
      .slice(0, 5)
  ), [tasks])

  const latestNotifications = useMemo(() => (
    [...notifications]
      .sort((left, right) => new Date(right.timestamp || 0).getTime() - new Date(left.timestamp || 0).getTime())
      .slice(0, 5)
  ), [notifications])

  const filteredCommunicationRemarks = useMemo(() => {
    const userEmail = (user?.email || user?.userEmail || '').trim().toLowerCase()
    const userName = (user?.name || user?.fullName || '').trim().toLowerCase()
    const isAdmin = user?.role === 'admin'

    if (isAdmin) return remarksList

    return remarksList.filter((rem) => {
      if (!userEmail && !userName) return true
      const createdByEmail = (rem.createdByEmail || rem.createdUserBy || rem.userEmail || '').trim().toLowerCase()
      const dealOwnerEmail = (rem.dealOwnerEmail || '').trim().toLowerCase()
      const accountOwnerEmail = (rem.accountOwnerEmail || '').trim().toLowerCase()
      const createdByName = (rem.createdByName || '').trim().toLowerCase()

      return (
        (userEmail && createdByEmail === userEmail) ||
        (userEmail && dealOwnerEmail === userEmail) ||
        (userEmail && accountOwnerEmail === userEmail) ||
        (userName && createdByName === userName)
      )
    })
  }, [remarksList, user])

  const userIdentity = useMemo(() => [
    user?.id,
    user?.name,
    user?.username,
    user?.email,
  ].filter(Boolean).map((v) => String(v).trim().toLowerCase()), [user])

  const todoItems = useMemo(() => {
    const matchesUser = (target) => {
      if (!target) return false
      const norm = String(target).trim().toLowerCase()
      return userIdentity.some((id) => id === norm || norm.includes(id))
    }

    const reminderItems = (reminders || [])
      .filter((reminder) => String(reminder.status || '').toLowerCase() !== 'closed')
      .filter((reminder) => matchesUser(reminder.assignedTo) || matchesUser(reminder.createdBy) || !reminder.assignedTo)
      .slice(0, 6)
      .map((reminder) => ({
        id: `reminder-${reminder.id}`,
        type: 'Reminder',
        title: reminder.title || 'Reminder',
        meta: formatTodoDateTime(reminder.remindAt || reminder.reminderDate),
        message: reminder.message || reminder.note || '-',
        date: reminder.remindAt || reminder.reminderDate,
        reminder,
        onClick: () => navigate('/reminders/my', {
          state: {
            activeMyReminderTab: 'today',
            reminderId: reminder.id,
          },
        }),
      }))

    const replyItems = todoReplies.slice(0, 6).map((reply, index) => {
      const requestId = reply.support_request_id || reply.supportRequestId || ''
      const matchedRequest = supportRequests.find((request) => (
        [request.id, request.mongoId, request._id, request.legacyId].some((value) => String(value || '') === String(requestId || ''))
      ))
      const targetRequestId = matchedRequest?.id || requestId
      return {
        id: `reply-${reply._id || reply.id || index}`,
        type: 'Reply',
        title: reply.sender_email || reply.senderEmail || 'Support Reply',
        meta: formatTodoDateTime(reply.created_at || reply.createdAt),
        message: reply.message || '-',
        date: reply.created_at || reply.createdAt,
        onClick: () => navigate('/tickets', {
          state: {
            activeTab: 'replied',
            expandedTicketId: targetRequestId,
            supportRequestId: targetRequestId,
          },
        }),
      }
    })

    const taskItems = (tasks || [])
      .filter((task) => String(task.status || '').toLowerCase() === 'pending' || String(task.status || '').toLowerCase() === 'open')
      .filter((task) => matchesUser(task.assignedTo) || matchesUser(task.createdBy) || matchesUser(task.userEmail) || matchesUser(task.ownerUserId) || !task.assignedTo)
      .slice(0, 6)
      .map((task) => ({
        id: `task-${task.id || task._id}`,
        type: task.activityType === 're-assign-account' ? 'Reassignment' : 'Task',
        title: task.title || task.name || 'Pending Task',
        meta: formatTodoDateTime(task.dueDate || task.createdAt),
        message: task.description || task.note || '-',
        date: task.dueDate || task.createdAt,
        task,
        onClick: () => navigate('/accounts/my-accounts'),
      }))

    return [...replyItems, ...reminderItems, ...taskItems]
      .sort((left, right) => new Date(right.date || 0).getTime() - new Date(left.date || 0).getTime())
      .slice(0, 10)
  }, [navigate, reminders, supportRequests, tasks, todoReplies, user?.id, userIdentity])

  const handleTodoReminderActive = (reminder, event) => {
    event?.stopPropagation()
    navigate('/reminders/active', {
      state: {
        reminderId: reminder.id,
      },
    })
  }

  const handleTodoReminderClose = async (reminder, event) => {
    event?.stopPropagation()
    await updateReminder(reminder.id, { status: 'closed' })
    navigate('/reminders/closed', {
      state: {
        reminderId: reminder.id,
      },
    })
  }

  return (
    <div className="ud-page">
      <div className="ud-header">
        <span className="ud-header-kicker">Welcome,</span>
        <h1>{user?.name || 'User'}!</h1>
        <p>Here&apos;s what&apos;s happening with your business today.</p>
      </div>

      <div className="ud-stats-grid">
        <div className="ud-stat-card">
          <div className="ud-stat-icon ud-stat-icon--blue">
            <FaUsers />
          </div>
          <div className="ud-stat-details">
            <div className="ud-stat-value">{stats.accounts}</div>
            <div className="ud-stat-label">Accounts</div>
            <div className="ud-stat-subtext">Assigned to you</div>
          </div>
        </div>

        <div className="ud-stat-card">
          <div className="ud-stat-icon ud-stat-icon--green">
            <FaHandshake />
          </div>
          <div className="ud-stat-details">
            <div className="ud-stat-value">{stats.openDeals}</div>
            <div className="ud-stat-label">Open Deals</div>
            <div className="ud-stat-subtext">{formatCurrency(stats.dealValue)} pipeline</div>
          </div>
        </div>

        <div className="ud-stat-card">
          <div className="ud-stat-icon ud-stat-icon--red">
            <FaClipboardList />
          </div>
          <div className="ud-stat-details">
            <div className="ud-stat-value">{stats.pendingTasks}</div>
            <div className="ud-stat-label">Pending Tasks</div>
            <div className="ud-stat-subtext">{stats.tasks} total tasks</div>
          </div>
        </div>

        <div className="ud-stat-card">
          <div className="ud-stat-icon ud-stat-icon--purple">
            <FaBell />
          </div>
          <div className="ud-stat-details">
            <div className="ud-stat-value">{stats.notifications}</div>
            <div className="ud-stat-label">Notifications</div>
            <div className="ud-stat-subtext">{stats.openSupportRequests} active support requests</div>
          </div>
        </div>
      </div>

      <div className="ud-content-grid ud-content-grid--3col">
        <div className="ud-card">
          <div className="ud-card-header">
            <h3><FaHandshake aria-hidden="true" /> Recent Deals</h3>
            <button type="button" className="ud-view-all-btn" onClick={() => navigate('/deals')}>
              View All &rarr;
            </button>
          </div>
          <div className="ud-list">
            {recentDeals.length > 0 ? recentDeals.map((deal) => (
              <div key={deal.id} className="ud-list-item">
                <div className="ud-item-info">
                  <div className="ud-item-title">{deal.name || '-'}</div>
                  <div className="ud-item-desc">
                    <Badge variant={getStatusColor(deal.status)}>
                      {deal.status || '-'}
                    </Badge>
                  </div>
                </div>
                <div className="ud-item-meta">
                  <div className="ud-item-value">{formatCurrency(deal.value || 0)}</div>
                  <div className="ud-item-date">{formatDate(deal.createdAt)}</div>
                </div>
              </div>
            )) : (
              <div className="ud-empty-state">No deals available</div>
            )}
          </div>
        </div>

        <div className="ud-card">
          <div className="ud-card-header">
            <h3><FaClipboardList aria-hidden="true" /> To Do List</h3>
            <button type="button" className="ud-view-all-btn" onClick={fetchTodoReplies}>
              Refresh
            </button>
          </div>
          <div className="ud-todo-list">
            {todoItems.length > 0 ? todoItems.map((item) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                className="ud-todo-item"
                onClick={item.onClick}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    item.onClick()
                  }
                }}
              >
                <span className="ud-todo-kicker">{item.type}</span>
                <span className="ud-todo-title">{item.title}</span>
                <span className="ud-todo-meta">{item.meta}</span>
                <span className="ud-todo-message">{item.message}</span>
                {item.reminder ? (
                  <span className="ud-todo-actions">
                    <button type="button" className="ud-todo-mini-btn" onClick={(event) => handleTodoReminderActive(item.reminder, event)}>
                      Active
                    </button>
                    <button type="button" className="ud-todo-mini-btn ud-todo-mini-btn--close" onClick={(event) => handleTodoReminderClose(item.reminder, event)}>
                      Close
                    </button>
                  </span>
                ) : null}
              </div>
            )) : (
              <div className="ud-empty-state">No todo items</div>
            )}
          </div>
        </div>

        <div className="ud-card">
          <div className="ud-card-header">
            <h3><FaChartLine aria-hidden="true" /> Upcoming Tasks</h3>
          </div>
          <div className="ud-list">
            {upcomingTasks.length > 0 ? upcomingTasks.map((task) => (
              <div key={task.id} className="ud-list-item">
                <div className="ud-item-info">
                  <div className="ud-item-title">{task.title}</div>
                  <div className="ud-item-desc">{task.description || 'No description'}</div>
                </div>
                <div className="ud-item-meta">
                  <Badge variant={getPriorityColor(task.priority)}>
                    {task.priority || 'medium'}
                  </Badge>
                  <div className="ud-item-date">{task.dueDate ? formatDate(task.dueDate) : '-'}</div>
                </div>
              </div>
            )) : (
              <div className="ud-empty-state">No upcoming tasks</div>
            )}
          </div>
        </div>
        <div className="ud-card">
          <div className="ud-card-header">
            <h3><FaComments aria-hidden="true" /> Communication Activity</h3>
            <button type="button" className="ud-view-all-btn" onClick={() => navigate('/communication-activities')}>
              View All &rarr;
            </button>
          </div>
          <div className="ud-list">
            {filteredCommunicationRemarks.length > 0 ? filteredCommunicationRemarks.slice(0, 3).map((rem) => (
              <div
                key={rem.id}
                className="ud-list-item"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                onClick={() => navigate('/communication-activities')}
              >
                <FaComments style={{ color: '#3b82f6', fontSize: '18px', flexShrink: 0 }} aria-hidden="true" />
                <div className="ud-item-info" style={{ flex: 1 }}>
                  <div className="ud-item-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Badge variant={rem.relatedEntityType === 'deal' ? 'info' : 'success'}>
                      {rem.relatedEntityType === 'deal' ? 'Deal' : 'Account'}
                    </Badge>
                    <span>{rem.dealName || rem.accountName || 'Activity'}</span>
                  </div>
                  <div className="ud-item-desc" style={{ marginTop: '4px', opacity: 0.85 }}>
                    {rem.content}
                  </div>
                </div>
                <div className="ud-item-meta">
                  <div className="ud-item-value">{rem.createdByName || 'User'}</div>
                  <div className="ud-item-date">{rem.createdAt ? formatDate(rem.createdAt) : '-'}</div>
                </div>
              </div>
            )) : (
              <div className="ud-empty-state">No communication activities</div>
            )}
          </div>
        </div>
      </div>

      <AnalyticsSection
        accounts={accounts}
        deals={deals}
        quotations={quotations}
        activities={activities}
      />

      <Modal
        isOpen={isCommunicationModalOpen}
        onClose={() => setIsCommunicationModalOpen(false)}
        title="Communication Activities (Notes & Remarks)"
        size="large"
      >
        <div style={{ padding: '12px 4px', maxHeight: '70vh', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#f8fafc' }}>
                <th style={{ padding: '10px 12px' }}>Type</th>
                <th style={{ padding: '10px 12px' }}>Name</th>
                <th style={{ padding: '10px 12px' }}>Category</th>
                <th style={{ padding: '10px 12px' }}>Remark / Note</th>
                <th style={{ padding: '10px 12px' }}>Record Owner</th>
                <th style={{ padding: '10px 12px' }}>Created By</th>
                <th style={{ padding: '10px 12px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {remarksList.length > 0 ? remarksList.map((rem) => (
                <tr key={rem.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <Badge variant={rem.relatedEntityType === 'deal' ? 'info' : 'success'}>
                      {rem.relatedEntityType === 'deal' ? 'Deal' : 'Account'}
                    </Badge>
                  </td>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>
                    {rem.dealName || rem.accountName || '-'}
                  </td>
                  <td style={{ padding: '10px 12px', textTransform: 'capitalize' }}>
                    {rem.category || 'general'}
                  </td>
                  <td style={{ padding: '10px 12px', maxWidth: '300px', wordBreak: 'break-word' }}>
                    {rem.content}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    {rem.dealOwnerName || rem.accountOwnerName || '-'}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    {rem.createdByName || '-'}
                  </td>
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                    {rem.createdAt ? formatDate(rem.createdAt) : '-'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                    No communication activities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Modal>

    </div>
  )
}

export default UserDashboardPage
