import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaArrowRight,
  FaBell,
  FaCalendarAlt,
  FaCheckCircle,
  FaClipboardList,
  FaEnvelope,
  FaFileAlt,
  FaHandshake,
  FaHeadset,
  FaThLarge,
  FaUser,
  FaUsers,
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import apiClient from '../../services/apiClient'
import { formatCurrency, formatDate } from '../../utils/helpers'
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

  const fetchTodoReplies = useCallback(async () => {
    try {
      const res = await apiClient.get('/support-requests/todo/replies')
      setTodoReplies(Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []))
    } catch (error) {
      console.error('Failed to fetch todo replies:', error)
    }
  }, [])

  useEffect(() => {
    fetchTodoReplies()
  }, [fetchTodoReplies])

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
      quotations: quotations.length,
    }
  }, [accounts, deals, notifications.length, quotations.length, supportRequests, tasks])

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
        type: 'REMINDER (NONE)',
        title: reminder.title || reminder.message || 'abc',
        meta: formatTodoDateTime(reminder.remindAt || reminder.reminderDate) || '30 Sept, 05:30 am',
        message: reminder.message || reminder.note || 'abc',
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
        type: 'REPLY',
        title: reply.sender_email || reply.senderEmail || 'Support Reply',
        meta: formatTodoDateTime(reply.created_at || reply.createdAt),
        message: reply.message || 'abc',
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
        type: 'TASK',
        title: task.title || task.name || 'abc',
        meta: formatTodoDateTime(task.dueDate || task.createdAt) || '30 Sept, 05:30 am',
        message: task.description || task.note || 'abc',
        date: task.dueDate || task.createdAt,
        task,
        onClick: () => navigate('/accounts/my-accounts'),
      }))

    return [...reminderItems, ...replyItems, ...taskItems]
      .sort((left, right) => new Date(right.date || 0).getTime() - new Date(left.date || 0).getTime())
      .slice(0, 8)
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

  const currentFormattedDateTime = useMemo(() => {
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-GB')
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
    return `${dateStr}, ${timeStr}`
  }, [])

  return (
    <div className="ud-page">
      {/* Welcome Section */}
      <div className="ud-welcome-section">
        <span className="ud-welcome-kicker">WELCOME,</span>
        <h1 className="ud-welcome-heading">{user?.name || 'Keval V Shah'}!</h1>
        <p className="ud-welcome-subtext">Here&apos;s what&apos;s happening with your business today.</p>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="ud-stats-grid">
        {/* Card 1: Accounts */}
        <div className="ud-stat-card ud-stat-card--accounts" onClick={() => navigate('/accounts/my-accounts')}>
          <div className="ud-stat-icon-wrapper ud-stat-icon-wrapper--red">
            <FaUsers />
          </div>
          <div className="ud-stat-content">
            <div className="ud-stat-num-row">
              <span className="ud-stat-number">{stats.accounts || 14}</span>
              <span className="ud-stat-badge ud-stat-badge--green">↗ +12%</span>
            </div>
            <span className="ud-stat-title">Accounts</span>
          </div>
          <div className="ud-stat-curve ud-stat-curve--red" />
        </div>

        {/* Card 2: Customer */}
        <div className="ud-stat-card ud-stat-card--customer" onClick={() => navigate('/customers/my-customers')}>
          <div className="ud-stat-icon-wrapper ud-stat-icon-wrapper--blue">
            <FaUser />
          </div>
          <div className="ud-stat-content">
            <div className="ud-stat-num-row">
              <span className="ud-stat-number">0</span>
              <span className="ud-stat-badge ud-stat-badge--gray">0%</span>
            </div>
            <span className="ud-stat-title">Customer</span>
          </div>
          <div className="ud-stat-curve ud-stat-curve--blue" />
        </div>

        {/* Card 3: Deal */}
        <div className="ud-stat-card ud-stat-card--deal" onClick={() => navigate('/deals/view')}>
          <div className="ud-stat-icon-wrapper ud-stat-icon-wrapper--green">
            <FaHandshake />
          </div>
          <div className="ud-stat-content">
            <div className="ud-stat-num-row">
              <span className="ud-stat-number">{stats.openDeals || 18}</span>
              <span className="ud-stat-badge ud-stat-badge--green">↗ +8%</span>
            </div>
            <span className="ud-stat-title">Deal</span>
          </div>
          <div className="ud-stat-curve ud-stat-curve--green" />
        </div>

        {/* Card 4: Quotation Manager */}
        <div className="ud-stat-card ud-stat-card--quotation" onClick={() => navigate('/quotation-manager/view')}>
          <div className="ud-stat-icon-wrapper ud-stat-icon-wrapper--orange">
            <FaFileAlt />
          </div>
          <div className="ud-stat-content">
            <div className="ud-stat-num-row">
              <span className="ud-stat-number">{stats.quotations || 23}</span>
            </div>
            <span className="ud-stat-title">Quotation Manager</span>
          </div>
          <div className="ud-stat-curve ud-stat-curve--orange" />
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="ud-main-layout">
        {/* Left Wide Column: To Do List */}
        <div className="ud-card ud-todo-card">
          <div className="ud-card-header">
            <div className="ud-card-header-left">
              <FaClipboardList className="ud-card-header-icon" />
              <h3>To Do List</h3>
            </div>
            <div className="ud-card-header-right">
              <button
                type="button"
                className="ud-link-btn"
                onClick={() => navigate('/reminders/my')}
              >
                View All &rarr;
              </button>
              <button
                type="button"
                className="ud-red-btn"
                onClick={() => navigate('/tasks')}
              >
                + Add Task
              </button>
            </div>
          </div>

          <div className="ud-todo-list">
            {todoItems.length > 0 ? todoItems.slice(0, 6).map((item) => (
              <div key={item.id} className="ud-todo-row" onClick={item.onClick}>
                <div className="ud-todo-icon-box">
                  <FaCalendarAlt />
                </div>
                <div className="ud-todo-body">
                  <div className="ud-todo-meta-line">
                    <span className="ud-todo-badge">{item.type}</span>
                    <span className="ud-todo-date">{item.meta}</span>
                  </div>
                  <div className="ud-todo-title-text">{item.title || item.message}</div>
                </div>
                {item.reminder ? (
                  <div className="ud-todo-btn-group">
                    <button
                      type="button"
                      className="ud-active-pill-btn"
                      onClick={(e) => handleTodoReminderActive(item.reminder, e)}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      className="ud-close-pill-btn"
                      onClick={(e) => handleTodoReminderClose(item.reminder, e)}
                    >
                      Close
                    </button>
                  </div>
                ) : null}
              </div>
            )) : (
              <div className="ud-todo-row">
                <div className="ud-todo-icon-box">
                  <FaCalendarAlt />
                </div>
                <div className="ud-todo-body">
                  <div className="ud-todo-meta-line">
                    <span className="ud-todo-badge">REMINDER (NONE)</span>
                    <span className="ud-todo-date">30 Sept, 05:30 am</span>
                  </div>
                  <div className="ud-todo-title-text">abc</div>
                </div>
                <div className="ud-todo-btn-group">
                  <button type="button" className="ud-active-pill-btn">Active</button>
                  <button type="button" className="ud-close-pill-btn">Close</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Stacked Column: Integrations & Live Activity */}
        <div className="ud-right-column">
          {/* Integrations Card */}
          <div className="ud-card ud-integrations-card">
            <div className="ud-card-header">
              <div className="ud-card-header-left">
                <FaThLarge className="ud-card-header-icon" />
                <h3>Integrations</h3>
              </div>
              <button
                type="button"
                className="ud-link-btn"
                onClick={() => navigate('/integrations')}
              >
                Manage &rarr;
              </button>
            </div>
            <div className="ud-integrations-grid">
              <div className="ud-integration-box" onClick={() => navigate('/outlook')}>
                <div className="ud-integ-icon-box ud-integ-icon-box--blue">
                  <FaEnvelope />
                </div>
                <div className="ud-integ-info">
                  <div className="ud-integ-title">Outlook Mail</div>
                  <div className="ud-integ-subtext">Connect...</div>
                </div>
                <FaArrowRight className="ud-integ-arrow" />
              </div>

              <div className="ud-integration-box" onClick={() => navigate('/support-requests/help')}>
                <div className="ud-integ-icon-box ud-integ-icon-box--red">
                  <FaHeadset />
                </div>
                <div className="ud-integ-info">
                  <div className="ud-integ-title">CRM Support</div>
                  <div className="ud-integ-subtext">Open Su...</div>
                </div>
                <FaArrowRight className="ud-integ-arrow" />
              </div>
            </div>
          </div>

          {/* Live Activity Card */}
          <div className="ud-card ud-live-card">
            <div className="ud-card-header">
              <div className="ud-card-header-left">
                <span className="ud-green-dot" />
                <h3>Live Activity</h3>
              </div>
              <button
                type="button"
                className="ud-link-btn"
                onClick={() => navigate('/team-view')}
              >
                Team View &rarr;
              </button>
            </div>
            <div className="ud-live-card-body">
              <div className="ud-live-user-pill">
                <div className="ud-live-user-left">
                  <span className="ud-live-status-chip">• LIVE</span>
                  <div className="ud-live-user-details">
                    <span className="ud-live-user-name">{user?.name || 'Keval V Shah...'}</span>
                    <span className="ud-live-user-sub">{user?.role || 'Director'} • Active...</span>
                  </div>
                </div>
                <span className="ud-live-time-chip">{currentFormattedDateTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section Component */}
      <AnalyticsSection
        accounts={accounts}
        deals={deals}
        quotations={quotations}
        activities={activities}
      />
    </div>
  )
}

export default UserDashboardPage
