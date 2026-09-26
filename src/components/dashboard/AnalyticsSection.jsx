import React, { useMemo, useState } from 'react'
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { formatCurrency, formatDate } from '../../utils/helpers'
import './AnalyticsSection.css'

const COLORS = ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#d32f2f', '#00838f']
const normalize = (value) => String(value || '').trim().toLowerCase()
const amountOf = (item) => Number(item?.total || item?.grandTotal || item?.value || item?.amount || 0) || 0
const dateOf = (item) => item?.createdAt || item?.date || item?.dealDate || item?.quotationDate || item?.updatedAt

const monthKey = (date) => {
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return null
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`
}

const buildMonthlyData = (deals, quotations) => {
  const keys = Array.from(new Set([...deals, ...quotations].map((item) => monthKey(dateOf(item))).filter(Boolean))).sort().slice(-6)
  return keys.map((key) => {
    const [year, month] = key.split('-')
    const scopedDeals = deals.filter((item) => monthKey(dateOf(item)) === key)
    const scopedQuotations = quotations.filter((item) => monthKey(dateOf(item)) === key)
    return {
      name: new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('en-IN', { month: 'short' }),
      newDeals: scopedDeals.length,
      wonDeals: scopedDeals.filter((item) => ['won', 'closed'].includes(normalize(item.status || item.stage))).length,
      lostDeals: scopedDeals.filter((item) => ['lost', 'rejected', 'order_lost'].includes(normalize(item.status || item.stage))).length,
      quotationValue: scopedQuotations.reduce((sum, item) => sum + amountOf(item), 0),
    }
  })
}

const AnalyticsSection = ({ accounts = [], deals = [], quotations = [], activities = [], users = [] }) => {
  const [period, setPeriod] = useState('month')
  const chartData = useMemo(() => buildMonthlyData(deals, quotations), [deals, quotations])
  const pipeline = useMemo(() => {
    const counts = deals.reduce((result, deal) => {
      const key = String(deal.stage || deal.status || 'unknown').replace(/_/g, ' ')
      result[key] = (result[key] || 0) + 1
      return result
    }, {})
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [deals])
  const recentDeals = useMemo(() => [...deals].sort((a, b) => new Date(dateOf(b)) - new Date(dateOf(a))).slice(0, 8), [deals])
  const recentQuotations = useMemo(() => [...quotations].sort((a, b) => new Date(dateOf(b)) - new Date(dateOf(a))).slice(0, 8), [quotations])

  return (
    <section className="analytics-section" aria-label="Analytics">
      <div className="analytics-section__header">
        <div><span className="analytics-eyebrow">Performance</span><h2>Analytics</h2></div>
        <select value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Analytics period">
          <option value="month">Month wise</option><option value="week">Week wise</option><option value="day">Day wise</option>
        </select>
      </div>
      <div className="analytics-grid analytics-grid--charts">
        <article className="analytics-card analytics-card--wide"><h3>Deal Trend</h3><ResponsiveContainer width="100%" height={250}><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Legend /><Line dataKey="newDeals" name="New" stroke="#1976d2" strokeWidth={2} /><Line dataKey="wonDeals" name="Won" stroke="#2e7d32" strokeWidth={2} /><Line dataKey="lostDeals" name="Lost" stroke="#d32f2f" strokeWidth={2} /></LineChart></ResponsiveContainer></article>
        <article className="analytics-card"><h3>Deal Pipeline</h3><ResponsiveContainer width="100%" height={250}><BarChart data={pipeline}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" hide /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" name="Deals">{pipeline.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}</Bar></BarChart></ResponsiveContainer></article>
        <article className="analytics-card analytics-card--wide"><h3>Quotation Value</h3><ResponsiveContainer width="100%" height={250}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip formatter={(value) => formatCurrency(value)} /><Bar dataKey="quotationValue" name="Quotation value" fill="#ed6c02" /></BarChart></ResponsiveContainer></article>
        <article className="analytics-card"><h3>User Distribution</h3><ResponsiveContainer width="100%" height={250}><PieChart><Pie data={users.length ? users.map((user) => ({ name: user.department || user.role || 'Other', value: 1 })).reduce((all, item) => { const found = all.find((entry) => entry.name === item.name); if (found) found.value += 1; else all.push(item); return all }, []) : pipeline} dataKey="value" nameKey="name" outerRadius={85} label>{(users.length ? users : pipeline).map((entry, index) => <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></article>
      </div>
      <div className="analytics-grid analytics-grid--tables">
        <article className="analytics-card analytics-table-card"><h3>Deals</h3><div className="analytics-table-wrap"><table><thead><tr><th>Title</th><th>Owner</th><th>Stage</th><th>Value</th></tr></thead><tbody>{recentDeals.map((deal) => <tr key={deal.id || deal._id}><td>{deal.name || deal.dealName || deal.title || '-'}</td><td>{deal.ownerName || deal.dealOwner || '-'}</td><td>{deal.stage || deal.status || '-'}</td><td>{formatCurrency(amountOf(deal))}</td></tr>)}</tbody></table></div></article>
        <article className="analytics-card analytics-table-card"><h3>Quotations</h3><div className="analytics-table-wrap"><table><thead><tr><th>Quotation</th><th>Account</th><th>Total</th><th>Date</th></tr></thead><tbody>{recentQuotations.map((quotation) => <tr key={quotation.id || quotation._id}><td>{quotation.quotationNumber || quotation.number || '-'}</td><td>{quotation.accountName || quotation.customerName || '-'}</td><td>{formatCurrency(amountOf(quotation))}</td><td>{formatDate(dateOf(quotation))}</td></tr>)}</tbody></table></div></article>
        <article className="analytics-card analytics-table-card"><h3>Accounts</h3><div className="analytics-table-wrap"><table><thead><tr><th>Account</th><th>Contact</th><th>Industry</th><th>Status</th></tr></thead><tbody>{accounts.slice(0, 8).map((account) => <tr key={account.id || account._id}><td>{account.name || '-'}</td><td>{account.contactPerson || '-'}</td><td>{account.industryType || '-'}</td><td>{account.status || account.stage || '-'}</td></tr>)}</tbody></table></div></article>
        <article className="analytics-card analytics-table-card"><h3>Recent Activities</h3><div className="analytics-activity-list">{activities.slice(0, 8).map((activity) => <div key={activity.id || activity._id}><strong>{activity.title || activity.action || 'Activity'}</strong><span>{activity.message || activity.description || activity.entityType || ''}</span><time>{formatDate(activity.createdAt || activity.timestamp)}</time></div>)}</div></article>
      </div>
      <span className="analytics-period-note">Viewing {period}-wise data from MongoDB-backed records.</span>
    </section>
  )
}

export default AnalyticsSection
