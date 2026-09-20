import React, { useMemo } from 'react'
import { useData } from '../../../context/DataContext'
import { FaBriefcase, FaUsers, FaAddressCard, FaFileInvoiceDollar } from 'react-icons/fa'
import './AdminMonitoringDashboard.css'

export const AdminMonitoringDashboard = () => {
  const { deals, quotations, customers, accounts } = useData()

  const metrics = useMemo(() => {
    const dealsList = deals || []
    const quotesList = quotations || []
    
    return {
      totalDeals: dealsList.length,
      wonDeals: dealsList.filter(d => ['won', 'closed won', 'converted'].includes(String(d.status || d.stage).toLowerCase())).length,
      lostDeals: dealsList.filter(d => ['lost', 'closed lost', 'rejected'].includes(String(d.status || d.stage).toLowerCase())).length,
      totalQuotations: quotesList.length,
      totalCustomers: (customers || []).length,
      totalAccounts: (accounts || []).length,
    }
  }, [deals, quotations, customers, accounts])

  const recentActivity = useMemo(() => {
    const allActivity = []
    
    ;(deals || []).forEach(d => {
      if (d.createdAt || d.addedOn) {
        allActivity.push({
          id: `deal-${d.id || Math.random()}`,
          type: 'Deal',
          title: d.dealName || d.title || 'Unknown Deal',
          date: new Date(d.createdAt || d.addedOn),
          owner: d.accountOwner || d.addedBy || 'Unassigned',
        })
      }
    })

    ;(quotations || []).forEach(q => {
      if (q.createdAt || q.addedOn) {
        allActivity.push({
          id: `quote-${q.id || Math.random()}`,
          type: 'Quotation',
          title: q.quotationNumber || q.title || 'Unknown Quotation',
          date: new Date(q.createdAt || q.addedOn),
          owner: q.accountOwner || q.addedBy || 'Unassigned',
        })
      }
    })

    return allActivity
      .filter(item => !Number.isNaN(item.date.getTime()))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 20) // Top 20 recent
  }, [deals, quotations])

  return (
    <div className="monitoring-dashboard">
      <header className="monitoring-header">
        <h1>Monitoring Dashboard</h1>
        <p>Real-time overview of CRM activities and metrics</p>
      </header>

      <div className="monitoring-metrics-grid">
        <div className="metric-card">
          <div className="metric-icon metric-icon-deals"><FaBriefcase /></div>
          <div className="metric-content">
            <span className="metric-label">Total Deals</span>
            <span className="metric-value">{metrics.totalDeals}</span>
            <div className="metric-subtext">
              <span className="text-success">{metrics.wonDeals} Won</span> • <span className="text-danger">{metrics.lostDeals} Lost</span>
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon metric-icon-quotes"><FaFileInvoiceDollar /></div>
          <div className="metric-content">
            <span className="metric-label">Total Quotations</span>
            <span className="metric-value">{metrics.totalQuotations}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon metric-icon-customers"><FaUsers /></div>
          <div className="metric-content">
            <span className="metric-label">Total Customers</span>
            <span className="metric-value">{metrics.totalCustomers}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon metric-icon-accounts"><FaAddressCard /></div>
          <div className="metric-content">
            <span className="metric-label">Total Accounts</span>
            <span className="metric-value">{metrics.totalAccounts}</span>
          </div>
        </div>
      </div>

      <div className="monitoring-recent-activity">
        <h2>Recent Activity</h2>
        {recentActivity.length === 0 ? (
          <div className="activity-empty">No recent activity found.</div>
        ) : (
          <ul className="activity-list">
            {recentActivity.map(activity => (
              <li key={activity.id} className="activity-item">
                <div className={`activity-badge activity-badge-${activity.type.toLowerCase()}`}>
                  {activity.type}
                </div>
                <div className="activity-details">
                  <span className="activity-title">{activity.title}</span>
                  <span className="activity-meta">
                    Added by <strong>{activity.owner}</strong> on {activity.date.toLocaleDateString()} at {activity.date.toLocaleTimeString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default AdminMonitoringDashboard
