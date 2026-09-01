import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  FaBell,
  FaCalendarAlt,
  FaCaretDown,
  FaEnvelope,
  FaExchangeAlt,
  FaFileAlt,
  FaFileUpload,
  FaMapMarkerAlt,
  FaPencilAlt,
  FaPhone,
  FaTimes,
  FaTrash,
  FaUser,
  FaUserCog,
} from 'react-icons/fa'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Button from '../../../components/common/Button'
import Modal from '../../../components/common/Modal'
import { useAuth } from '../../../context/AuthContext'
import { useData } from '../../../context/DataContext'
import { buildAdminManageDealUrl } from '../../../features/adminDeals/config/adminDealViews'
import { buildCrmDealActionUrl } from '../crm-actions/CRMActionPage'
import { authService } from '../../../services/authService'
import { customerService } from '../../../services/customerService'
import { getCrmOwnerDisplay } from '../../../features/users/crmUserDirectory'
import { ACCOUNT_CHANGE_STATUS_OPTIONS } from '../../../features/adminAccounts/config/accountStages'
import {
  ACCOUNT_CATEGORY_OPTIONS,
  ACCOUNT_SOURCE_OPTIONS,
} from '../../../features/accounts/config/accountDropdownOptions'
import {
  CUSTOMER_QUOTATION_STATUS_OPTIONS,
  DEAL_LIFECYCLE_STATUS_OPTIONS,
} from '../../../features/adminDeals/config/dealUtils'
import { formatCurrency, formatDate, formatNumber } from '../../../utils/helpers'
import './AdminDealDetailPage.css'

const normalizeSearchValue = (value) => String(value || '').trim().toLowerCase()

const DEAL_TYPE_OPTIONS = [
  { value: 'LUMOS', label: 'LUMOS' },
  { value: 'SWATI', label: 'SWATI' },
  { value: 'PURCHASE ENQUIRY', label: 'PURCHASE ENQUIRY' },
  { value: 'TENDER ENQUIRY', label: 'TENDER ENQUIRY' },
]

const DEAL_SOURCE_SELECT_OPTIONS = DEAL_TYPE_OPTIONS
const DEAL_SUBSOURCE_SELECT_OPTIONS = ACCOUNT_SOURCE_OPTIONS
const PRODUCT_CATEGORY_SELECT_OPTIONS = ACCOUNT_CATEGORY_OPTIONS

const MANAGE_DEAL_LIFECYCLE_STATUS_OPTIONS = DEAL_LIFECYCLE_STATUS_OPTIONS.map((option) => ({
  ...option,
  label: option.value === 'Convert To PO' ? 'PO Converted' : option.label,
}))

const hasDisplayValue = (value) => {
  if (typeof value === 'number') return true
  return String(value || '').trim() !== ''
}

const renderDisplayValue = (value, options = null, fallback = 'Not Available') => {
  if (!hasDisplayValue(value)) return fallback
  if (options && Array.isArray(options)) {
    const opt = options.find((o) => String(o.value) === String(value))
    if (opt && opt.label) return opt.label
  }
  return value
}


const HIDDEN_MANAGE_DEAL_STATUS_VALUES = new Set(['converted', 'closed', 'contacted', 'order_lost'])
const STATUS_OPTIONS = ACCOUNT_CHANGE_STATUS_OPTIONS.filter((option) => (
  !HIDDEN_MANAGE_DEAL_STATUS_VALUES.has(option.value)
)).map((option) => ({
  ...option,
  label: option.value === 'convert_to_po' ? 'PO Converted' : option.label,
}))

const toDateInputValue = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''
  return date.toISOString().split('T')[0]
}

const clampProbability = (value) => {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) return 0
  return Math.max(0, Math.min(100, numericValue))
}

const buildNormalizedDeal = ({ deal, accounts, customers, users, currentUser }) => {
  if (!deal) return null

  const userDirectory = users.reduce((lookup, entry) => {
    lookup[String(entry.id)] = entry.name
    return lookup
  }, {})

  const accountDirectory = accounts.reduce((lookup, account) => {
    if (account?.id) {
      lookup[String(account.id)] = account
    }
    return lookup
  }, {})

  const accountNameDirectory = accounts.reduce((lookup, account) => {
    const normalizedName = normalizeSearchValue(account?.name || account?.accountName || account?.customerName || '')
    if (normalizedName && !lookup[normalizedName]) {
      lookup[normalizedName] = account
    }
    return lookup
  }, {})

  const customerDirectory = customers.reduce((lookup, customer) => {
    if (customer?.id) {
      lookup[String(customer.id)] = customer
    }
    return lookup
  }, {})

  const linkedAccount = (
    accountDirectory[String(deal.accountId || deal.customerId || '')]
    || accountNameDirectory[normalizeSearchValue(deal.accountName || deal.companyName || deal.customerName || '')]
    || null
  )
  const linkedCustomer = customerDirectory[String(deal.customerId || '')] || null
  const ownerUserId = String(
    deal.ownerUserId
    || deal.ownerId
    || deal.assignedTo
    || deal.assignedUserId
    || deal.userId
    || ''
  )
  const ownerName = (
    deal.dealOwnerName
    || deal.dealOwner
    || deal.ownerName
    || deal.assignedUserName
    || userDirectory[ownerUserId]
    || currentUser?.name
    || 'Unassigned'
  )

  return {
    ...deal,
    id: deal.id,
    linkedAccountId: String(linkedAccount?.id || deal.accountId || ''),
    linkedAccountName: linkedAccount?.name || linkedAccount?.accountName || deal.accountName || deal.customerName || '',
    dealNumber: deal.dealNumber || '',
    dealName: deal.name || '',
    dealDate: deal.dealDate || deal.createdAt || '',
    dealValue: Number(deal.value || 0),
    dealScore: deal.dealScore,
    probability: Number(deal.probability || 0),
    addedBy: deal.createdBy || ownerName,
    lastUpdated: deal.updatedAt || deal.createdAt || '',
    customerName: deal.customerName || linkedCustomer?.customerName || linkedAccount?.customerName || linkedAccount?.name || '',
    customerNumber: deal.customerNumber || linkedCustomer?.customerNumber || linkedAccount?.accountNumber || '',
    dealType: deal.dealType || deal.customerCategory || linkedAccount?.accountCategory || deal.stage || '',
    dealStatus: deal.status || '',
    dealOwner: deal.dealOwnerDisplay || getCrmOwnerDisplay(ownerName) || ownerName,
    dealSource: deal.dealSource || deal.source || linkedAccount?.accountOwner || '',
    dealSubsource: deal.dealSubsource || deal.subsource || '',
    contactName: deal.contactPerson || linkedAccount?.contactPerson || '',
    phone: deal.contactMobile || deal.contactPhone || linkedAccount?.contactMobile || linkedAccount?.contactPhone || linkedAccount?.phone || '',
    email: deal.contactEmail || linkedAccount?.contactEmail || linkedAccount?.email || '',
    address: deal.address || linkedAccount?.address || linkedCustomer?.address || '',
    description: deal.description || deal.remark || '',
    poValue: deal.poValue,
    customerReferenceDate: deal.customerReferenceDate || '',
    productCategory: deal.productCategory || deal.customerCategory || linkedAccount?.accountCategory || '',
    customerReferenceNumber: deal.customerReferenceNumber || '',
    consultantName: deal.consultantName || linkedAccount?.consultantName || '',
    gstin: deal.gstin || linkedAccount?.gstin || '',
    projectName: deal.projectName || linkedAccount?.projectName || '',
    orderCustomerStatus: deal.orderCustomerStatus || '',
    jobNo: deal.jobNo || linkedAccount?.jobNo || '',
    quotationCustomerStatus: deal.quotationCustomerStatus || '',
    expectedClosureDate: deal.expectedClosureDate || deal.closeDate || '',
    actualClosureDate: deal.actualClosureDate || '',
  }
}

const AdminDealDetailPage = () => {
  const { dealId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { deals, convertedDeals, accounts, addNotification, updateDeal } = useData()
  const { user } = useAuth()
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false)
  const [probabilityDraft, setProbabilityDraft] = useState(0)
  const [isSavingProbability, setIsSavingProbability] = useState(false)

  const [editingFieldKey, setEditingFieldKey] = useState('')
  const [editValue, setEditValue] = useState('')
  const [isSavingField, setIsSavingField] = useState(false)

  const handleStartEditing = (key, initialValue) => {
    setEditingFieldKey(key)
    setEditValue(initialValue || '')
  }

  const handleCancelEditing = () => {
    setEditingFieldKey('')
    setEditValue('')
  }

  const handleSaveField = async (key) => {
    if (!deal?.id || isSavingField) return
    setIsSavingField(true)

    let updatePayload = { [key]: editValue }

    if (key === 'dealName') {
      updatePayload = { dealName: editValue, title: editValue, name: editValue }
    } else if (key === 'dealValue') {
      const val = editValue ? Number(editValue) : 0
      updatePayload = { dealValue: val, value: val, amount: val }
    } else if (key === 'dealScore' || key === 'poValue') {
      updatePayload[key] = editValue ? Number(editValue) : 0
    } else if (key === 'dealDate') {
      updatePayload = { dealDate: editValue }
    } else if (key === 'expectedClosureDate') {
      updatePayload = { expectedClosureDate: editValue, expectedCloseDate: editValue, closeDate: editValue }
    } else if (key === 'actualClosureDate') {
      updatePayload = { actualClosureDate: editValue }
    } else if (key === 'dealStatus') {
      updatePayload = { dealStatus: editValue, status: editValue, stage: editValue }
    } else if (key === 'dealType') {
      updatePayload = { dealType: editValue, customerCategory: editValue }
    } else if (key === 'dealSource') {
      updatePayload = { dealSource: editValue, source: editValue }
    } else if (key === 'dealSubsource') {
      updatePayload = { dealSubsource: editValue, subsource: editValue }
    } else if (key === 'contactName') {
      updatePayload = { contactName: editValue, contactPerson: editValue }
    } else if (key === 'phone') {
      updatePayload = { phone: editValue, contactPhone: editValue, contactMobile: editValue }
    } else if (key === 'email') {
      updatePayload = { email: editValue, contactEmail: editValue }
    } else if (key === 'customerReferenceDate') {
      updatePayload = { customerReferenceDate: editValue, customerRefDate: editValue }
    } else if (key === 'customerReferenceNumber') {
      updatePayload = { customerReferenceNumber: editValue, customerRefNo: editValue }
    } else if (key === 'reasonForLostOrder') {
      updatePayload = { reasonForLostOrder: editValue, reasonForLost: editValue }
    }

    const targetDealId = deal.sourceDealId || deal.source_deal_id || deal.dealId || deal.id
    const result = await updateDeal(targetDealId, updatePayload)
    setIsSavingField(false)

    if (!result.success) {
      addNotification('error', 'Update Deal', result.message || 'Unable to update field.')
      return
    }

    addNotification('success', 'Update Deal', 'Deal updated successfully.')
    setEditingFieldKey('')
    setEditValue('')
  }

  const renderInlineEditor = (item) => {
    const isSelect = item.options && item.options.length > 0
    return (
      <div className="admin-deal-detail-inline-editor">
        {isSelect ? (
          <select value={editValue} onChange={(e) => setEditValue(e.target.value)} disabled={isSavingField}>
            <option value="">Select...</option>
            {item.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        ) : item.type === 'date' ? (
          <input type="date" value={editValue} onChange={(e) => setEditValue(e.target.value)} disabled={isSavingField} />
        ) : (
          <input type={item.type || 'text'} value={editValue} onChange={(e) => setEditValue(e.target.value)} disabled={isSavingField} />
        )}
        <div className="admin-deal-detail-inline-actions">
          <button type="button" onClick={() => handleSaveField(item.key)} disabled={isSavingField}>{isSavingField ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={handleCancelEditing} disabled={isSavingField}>Cancel</button>
        </div>
      </div>
    )
  }

  const [isChangeTypeOpen, setIsChangeTypeOpen] = useState(false)
  const [changeTypeValue, setChangeTypeValue] = useState('')
  const actionsMenuRef = useRef(null)

  useEffect(() => {
    if (!isActionsMenuOpen) return undefined

    const handlePointerDown = (event) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
        setIsActionsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
    }
  }, [isActionsMenuOpen])

  const availableUsers = useMemo(
    () => authService.getAvailableUsers().filter((entry) => entry.name !== 'System Administrator'),
    []
  )
  const customers = useMemo(() => customerService.getCustomers(), [])
  const sourceDeal = useMemo(() => {
    const foundInDeals = deals.find((entry) => (
      String(entry.id) === String(dealId)
      || String(entry.sourceDealId) === String(dealId)
      || String(entry.dealId) === String(dealId)
    ))
    if (foundInDeals) return foundInDeals

    const foundInConverted = (convertedDeals || []).find((entry) => (
      String(entry.id) === String(dealId)
      || String(entry.sourceDealId) === String(dealId)
      || String(entry.dealId) === String(dealId)
    ))
    if (foundInConverted) return foundInConverted

    const stateDeal = location.state?.dealSnapshot
    if (stateDeal && (
      String(stateDeal.id) === String(dealId)
      || String(stateDeal.sourceDealId) === String(dealId)
      || String(stateDeal.dealId) === String(dealId)
    )) {
      return stateDeal
    }

    return null
  }, [dealId, deals, convertedDeals, location.state])
  const deal = useMemo(
    () => buildNormalizedDeal({
      deal: sourceDeal,
      accounts,
      customers,
      users: availableUsers,
      currentUser: user,
    }),
    [accounts, availableUsers, customers, sourceDeal, user]
  )

  useEffect(() => {
    setProbabilityDraft(clampProbability(deal?.probability || 0))
  }, [deal?.id, deal?.probability])

  const fromPath = location.state?.fromPath || (user?.role === 'admin' ? '/admin/deals/view' : '/deals/view')

  const handleClose = () => {
    navigate(fromPath)
  }

  const handleManageDeal = () => {
    if (!deal?.id) return
    navigate(buildAdminManageDealUrl(deal.id), {
      state: {
        fromPath,
        dealSnapshot: sourceDeal || deal,
      },
    })
  }

  const navigateBackWithAction = (actionKey) => {
    if (!deal?.id) return
    navigate(fromPath, { state: { dealActionKey: actionKey, dealActionId: deal.id } })
  }

  const handleSendMail = () => {
    if (!deal?.id) return
    navigate(buildCrmDealActionUrl('send-mail', deal.id, fromPath))
  }

  const handleUploadQuotation = () => {
    if (!deal?.id) return
    navigate(buildCrmDealActionUrl('upload-deal-quotation', deal.id, fromPath))
  }

  const handleReassignDeal = () => {
    if (!deal?.id) return
    navigate(buildCrmDealActionUrl('re-assign-deal', deal.id, fromPath))
  }

  const handleChangeStatus = () => {
    navigateBackWithAction('change-status')
  }

  const handleGenerateQuotation = () => {
    if (!deal) return

    navigate('/admin/quotations', {
      state: {
        openGenerator: true,
        preselectedDeal: sourceDeal || deal,
      },
    })
  }

  const handleOpenChangeType = () => {
    if (!deal) return
    setChangeTypeValue(deal.dealType || '')
    setIsChangeTypeOpen(true)
  }

  const handleCloseChangeType = () => {
    setIsChangeTypeOpen(false)
    setChangeTypeValue('')
  }

  const handleSaveDealType = async (event) => {
    event.preventDefault()
    if (!deal?.id) return

    const nextDealType = String(changeTypeValue || '').trim()
    if (!nextDealType) {
      addNotification('error', 'Change Type', 'Please select a deal type.')
      return
    }

    setIsSavingProbability(true)
    const result = await updateDeal(deal.sourceDealId || deal.source_deal_id || deal.id, {
      dealType: nextDealType,
      customerCategory: nextDealType,
      updatedAt: new Date().toISOString(),
    })
    setIsSavingProbability(false)

    if (!result.success) {
      addNotification('error', 'Change Type', result.message || 'Unable to change deal type.')
      return
    }

    handleCloseChangeType()
    addNotification('success', 'Change Type', `Deal type changed to ${nextDealType}.`)
  }

  const actionsMenuItems = [
    { key: 'reminder', label: 'Add Reminder', icon: <FaBell />, accent: 'orange', onSelect: () => navigateBackWithAction('reminder') },
    { key: 'generateQuotation', label: 'Generate Quotation', icon: <FaFileAlt />, accent: 'green', onSelect: handleGenerateQuotation },
    { key: 'uploadQuotation', label: 'Upload Quotation', icon: <FaFileUpload />, accent: 'blue', onSelect: handleUploadQuotation },
    { key: 'changeType', label: 'Change Type', icon: <FaExchangeAlt />, accent: 'green', onSelect: handleOpenChangeType },
    { key: 'reassign', label: 'Re-Assign Deal', icon: <FaUserCog />, accent: 'slate', onSelect: handleReassignDeal },
    { key: 'sendMail', label: 'Send Mail', icon: <FaEnvelope />, accent: 'blue', onSelect: handleSendMail },
    { key: 'delete', label: 'Delete Deal', icon: <FaTrash />, accent: 'danger', onSelect: () => navigateBackWithAction('delete') },
  ]

  const handleActionsItemClick = (item) => {
    setIsActionsMenuOpen(false)
    item.onSelect()
  }

  const handleSaveProbability = async () => {
    if (!deal?.id) return

    const nextProbability = clampProbability(probabilityDraft)
    setIsSavingProbability(true)

    const result = await updateDeal(deal.sourceDealId || deal.source_deal_id || deal.id, {
      probability: nextProbability,
      updatedAt: new Date().toISOString(),
    })

    setIsSavingProbability(false)

    if (!result.success) {
      addNotification('error', 'Probability', result.message || 'Unable to update probability.')
      return
    }

    addNotification('success', 'Probability', `Probability updated to ${nextProbability}%.`)
  }

  if (!deal) {
    return (
      <div className="admin-deal-detail-page">
        <div className="admin-deal-detail-shell">
          <div className="admin-deal-detail-card">
            <div className="admin-deal-detail-toolbar">
              <h1>Deal Not Found</h1>
              <button type="button" className="admin-deal-detail-close" onClick={handleClose} aria-label="Close deal details">
                <FaTimes />
              </button>
            </div>
            <div className="admin-deal-detail-empty">
              The requested deal could not be found.
            </div>
            <div className="admin-deal-detail-actions">
              <Button type="button" variant="outline" onClick={handleClose}>
                Back To Deals
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const probabilityValue = clampProbability(probabilityDraft)
  const savedProbabilityValue = clampProbability(deal.probability || 0)
  const customerLabel = [deal.customerName, deal.customerNumber ? `[${deal.customerNumber}]` : ''].filter(Boolean).join(' ')
  const overviewItems = [
    { key: 'dealName', label: 'Deal Name', value: deal.dealName || deal.dealNumber, rawValue: deal.dealName, type: 'text', icon: <FaUser /> },
    { key: 'dealDate', label: 'Deal Date', value: renderDisplayValue(deal.dealDate ? formatDate(deal.dealDate) : '', null), rawValue: toDateInputValue(deal.dealDate), type: 'date', icon: <FaCalendarAlt /> },
    { key: 'dealValue', label: 'Deal Value', value: formatCurrency(deal.dealValue || 0), rawValue: deal.dealValue, type: 'number', icon: <FaUser /> },
    { key: 'addedBy', label: 'Added By', value: renderDisplayValue(deal.addedBy, null), readonly: true, icon: <FaUser /> },
    { key: 'dealScore', label: 'Deal Score', value: hasDisplayValue(deal.dealScore) ? formatNumber(Number(deal.dealScore || 0)) : '0', rawValue: deal.dealScore, type: 'number', icon: <FaUser /> },
    { key: 'lastUpdated', label: 'Last Updated', value: renderDisplayValue(deal.lastUpdated ? formatDate(deal.lastUpdated, 'long') : '', null), readonly: true, icon: <FaCalendarAlt /> },
    { key: 'customerName', label: 'Customer', value: renderDisplayValue(customerLabel, null), readonly: true, icon: <FaUser /> },
    { key: 'expectedClosureDate', label: 'Expected Closure Date', value: renderDisplayValue(deal.expectedClosureDate ? formatDate(deal.expectedClosureDate) : '', null), rawValue: toDateInputValue(deal.expectedClosureDate), type: 'date', icon: <FaCalendarAlt /> },
    { key: 'actualClosureDate', label: 'Actual Closure Date', value: renderDisplayValue(deal.actualClosureDate ? formatDate(deal.actualClosureDate) : '', null), rawValue: toDateInputValue(deal.actualClosureDate), type: 'date', icon: <FaCalendarAlt /> },
  ]
  const detailItems = [
    { key: 'dealType', label: 'Deal Type', value: deal.dealType, rawValue: deal.dealType, type: 'text' },
    { key: 'dealStatus', label: 'Deal Status', value: deal.dealStatus, rawValue: deal.dealStatus, type: 'select', options: STATUS_OPTIONS },
    { key: 'dealOwner', label: 'Deal Owner', value: deal.dealOwner, readonly: true },
    { key: 'dealSource', label: 'Deal Source', value: deal.dealSource, rawValue: deal.dealSource, type: 'select', options: DEAL_SOURCE_SELECT_OPTIONS },
    { key: 'dealSubsource', label: 'Deal Subsource', value: deal.dealSubsource, rawValue: deal.dealSubsource, type: 'select', options: DEAL_SUBSOURCE_SELECT_OPTIONS },
  ]
  const contactItems = [
    { key: 'contactName', label: 'Contact Name', value: deal.contactName, rawValue: deal.contactName, type: 'text', icon: <FaUser /> },
    { key: 'phone', label: 'Phone', value: deal.phone, rawValue: deal.phone, type: 'text', icon: <FaPhone /> },
    { key: 'email', label: 'Email', value: deal.email, rawValue: deal.email, type: 'text', icon: <FaEnvelope /> },
    { key: 'address', label: 'Address', value: deal.address, rawValue: deal.address, type: 'text', icon: <FaMapMarkerAlt /> },
  ]
  const otherItems = [
    { key: 'poValue', label: 'PO Value', value: hasDisplayValue(deal.poValue) ? formatCurrency(deal.poValue) : renderDisplayValue(deal.poValue, null), rawValue: deal.poValue, type: 'number' },
    { key: 'customerReferenceDate', label: 'Customer Ref. Date', value: deal.customerReferenceDate ? formatDate(deal.customerReferenceDate) : '', rawValue: toDateInputValue(deal.customerReferenceDate), type: 'date' },
    { key: 'productCategory', label: 'Product Category', value: deal.productCategory, rawValue: deal.productCategory, type: 'select', options: PRODUCT_CATEGORY_SELECT_OPTIONS },
    { key: 'customerReferenceNumber', label: 'Customer Ref. No.', value: deal.customerReferenceNumber, rawValue: deal.customerReferenceNumber, type: 'text' },
    { key: 'consultantName', label: 'Consultant Name', value: deal.consultantName, rawValue: deal.consultantName, type: 'text' },
    { key: 'gstin', label: 'GSTIN', value: deal.gstin, rawValue: deal.gstin, type: 'text' },
    { key: 'projectName', label: 'Project Name', value: deal.projectName, rawValue: deal.projectName, type: 'text' },
    { key: 'orderCustomerStatus', label: 'Status Of Customer as per Order Received', value: deal.orderCustomerStatus, rawValue: deal.orderCustomerStatus, type: 'select', options: MANAGE_DEAL_LIFECYCLE_STATUS_OPTIONS },
    { key: 'jobNo', label: 'Job No', value: deal.jobNo, rawValue: deal.jobNo, type: 'text' },
    { key: 'quotationCustomerStatus', label: 'Status Of Customer as per quotation Given', value: deal.quotationCustomerStatus, rawValue: deal.quotationCustomerStatus, type: 'select', options: CUSTOMER_QUOTATION_STATUS_OPTIONS },
  ]

  return (
    <>
      <div className="admin-deal-detail-page">
        <div className="admin-deal-detail-shell">
          <article className="admin-deal-detail-card">
            <header className="admin-deal-detail-toolbar">
              <div className="admin-deal-detail-heading">
                <h1>{deal.dealName || deal.dealNumber || 'Deal Details'}</h1>
              </div>
              <button type="button" className="admin-deal-detail-close" onClick={handleClose} aria-label="Close deal details">
                <FaTimes />
              </button>
            </header>

            <div className="admin-deal-detail-meta">
              <div className="admin-deal-detail-meta-copy">
                <span className="admin-deal-detail-meta-label">Deal No.</span>
                <strong>{renderDisplayValue(deal.dealNumber, null)}</strong>
              </div>

              <div className="admin-deal-detail-meta-actions">
                <Button type="button" size="small" onClick={handleManageDeal}>
                  Manage Deal
                </Button>
                <Button type="button" size="small" variant="primary" style={{ background: '#3b82f6', borderColor: '#3b82f6' }} onClick={handleChangeStatus}>
                  Change Status
                </Button>

                <div className="admin-deal-detail-actions-menu" ref={actionsMenuRef}>
                  <button
                    type="button"
                    className="admin-deal-detail-actions-trigger"
                    onClick={() => setIsActionsMenuOpen((value) => !value)}
                    aria-haspopup="menu"
                    aria-expanded={isActionsMenuOpen}
                  >
                    <span>Actions</span>
                    <FaCaretDown />
                  </button>

                  {isActionsMenuOpen ? (
                    <div className="admin-deal-detail-actions-popup" role="menu">
                      {actionsMenuItems.map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          role="menuitem"
                          className={`admin-deal-detail-actions-item admin-deal-detail-actions-item-${item.accent}`}
                          onClick={() => handleActionsItemClick(item)}
                        >
                          <span className="admin-deal-detail-actions-item-icon">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <section className="admin-deal-detail-probability">
              <div className="admin-deal-detail-probability-header">
                <div className="admin-deal-detail-section-label">Probability</div>
                <div className="admin-deal-detail-probability-value">{formatNumber(probabilityValue)}%</div>
              </div>
              <div className="admin-deal-detail-probability-bar" aria-hidden="true">
                <span className="admin-deal-detail-probability-fill" style={{ width: `${probabilityValue}%` }} />
              </div>
              <div className="admin-deal-detail-probability-controls">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={probabilityValue}
                  onChange={(event) => setProbabilityDraft(clampProbability(event.target.value))}
                  className="admin-deal-detail-probability-slider"
                  style={{ '--probability-value': `${probabilityValue}%` }}
                  aria-label="Deal probability"
                />
                <Button
                  type="button"
                  size="small"
                  onClick={handleSaveProbability}
                  disabled={isSavingProbability || probabilityValue === savedProbabilityValue}
                >
                  {isSavingProbability ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </section>

            <div className="admin-deal-detail-cards">
              {[
                { key: 'overview', title: 'Overview', items: overviewItems },
                { key: 'detail', title: 'Deal Details', items: detailItems },
                { key: 'contact', title: 'Contact', items: contactItems },
                { key: 'other', title: 'Other Details', items: otherItems },
              ].map((group) => (
                <section key={group.key} className="admin-deal-detail-info-card">
                  <header className="admin-deal-detail-info-card-header">
                    <span className="admin-deal-detail-info-card-title">{group.title}</span>
                  </header>
                  <div className="admin-deal-detail-info-card-body">
                    {group.items.map((item) => (
                      <div key={`${group.key}-${item.label}`} className="admin-deal-detail-info-row">
                        <span className="admin-deal-detail-info-row-label">
                          {item.icon}
                          {item.label}
                        </span>
                        {editingFieldKey === item.key ? (
                          renderInlineEditor(item)
                        ) : (
                          <>
                            <span className={`admin-deal-detail-info-row-value ${hasDisplayValue(item.value) ? '' : 'admin-deal-detail-item-value-empty'}`}>
                              {renderDisplayValue(item.value, item.options)}
                            </span>
                            {!item.readonly && (
                              <button
                                type="button"
                                className="admin-deal-detail-inline-edit"
                                onClick={() => handleStartEditing(item.key, item.rawValue)}
                                aria-label={`Edit ${item.label}`}
                                title={`Edit ${item.label}`}
                              >
                                <FaPencilAlt />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              <section className="admin-deal-detail-info-card admin-deal-detail-info-card-wide">
                <header className="admin-deal-detail-info-card-header">
                  <span className="admin-deal-detail-info-card-title">Description</span>
                </header>
                <div className="admin-deal-detail-info-card-body">
                  {editingFieldKey === 'description' ? (
                    renderInlineEditor({ key: 'description', type: 'text', rawValue: deal.description })
                  ) : (
                    <div className={`admin-deal-detail-description ${hasDisplayValue(deal.description) ? '' : 'admin-deal-detail-item-value-empty'}`}>
                      {renderDisplayValue(deal.description, null)}
                      <button
                        type="button"
                        className="admin-deal-detail-inline-edit admin-deal-detail-description-edit"
                        onClick={() => handleStartEditing('description', deal.description)}
                        aria-label="Edit Description"
                        title="Edit Description"
                      >
                        <FaPencilAlt />
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </article>
        </div>
      </div>
      <Modal
        isOpen={isChangeTypeOpen}
        onClose={handleCloseChangeType}
        title="Change Type"
        size="small"
      >
        <form className="admin-deal-detail-change-type-form" onSubmit={handleSaveDealType}>
          <label className="admin-deal-detail-change-type-field">
            <span>Deal Type</span>
            <select value={changeTypeValue} onChange={(event) => setChangeTypeValue(event.target.value)}>
              <option value="">Select deal type</option>
              {DEAL_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="admin-deal-detail-change-type-actions">
            <Button type="button" variant="outline" onClick={handleCloseChangeType} disabled={isSavingProbability}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSavingProbability}>
              {isSavingProbability ? 'Saving...' : 'Save Type'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default AdminDealDetailPage
