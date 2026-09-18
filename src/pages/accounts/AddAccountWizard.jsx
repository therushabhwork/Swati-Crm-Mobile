import React, { useMemo, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import LegacyFormField from '../../components/accounts/LegacyFormField'
import LegacyFormSection from '../../components/accounts/LegacyFormSection'
import WizardStepper from '../../components/accounts/WizardStepper'
import { normalizeAccountRecord } from '../../features/adminAccounts/adapters/normalizeAccountRecord'
import { getCrmOwnerOptions } from '../../features/users/crmUserDirectory'
import {
  ACCOUNT_SOURCE_OPTIONS,
  CUSTOMER_TYPE_OPTIONS,
  INDUSTRY_TYPE_OPTIONS,
  STATE_OPTIONS,
} from '../../features/accounts/config/accountDropdownOptions'
import { getAccountCategoryLogo } from '../../features/accounts/config/accountCategoryLogo'
import { customerService } from '../../services/customerService'
import {
  CUSTOMER_QUOTATION_STATUS_OPTIONS,
  DEAL_LIFECYCLE_STATUS_OPTIONS,
} from '../../features/adminDeals/config/dealUtils'
import { userApi } from '../../services/userApi'
import {
  getAccountOwnerOptionLabel,
  loadAccountOwnerOptions,
  filterAccountOwnerOptionsByVertical,
} from '../../features/adminAccounts/utils/accountOwnerOptions'
import './AddAccountWizard.css'

const steps = [
  { id: 'basic', label: 'Account Basic Details' },
  { id: 'deal', label: 'Deal Details' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'reminder', label: 'Reminders & Remark' },
]

const accountCategories = [
  { value: 'LUMOS', label: 'LUMOS' },
  { value: 'SWATI', label: 'SWATI' },
]

const accountSources = ACCOUNT_SOURCE_OPTIONS
const customerTypes = CUSTOMER_TYPE_OPTIONS
const industryTypes = INDUSTRY_TYPE_OPTIONS
const states = STATE_OPTIONS

const reminderTypes = [
  { value: 'call', label: 'Call' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'visit', label: 'Visit' },
  { value: 'email', label: 'Email' },
]

const dealTypes = [
  { value: 'LUMOS', label: 'LUMOS' },
  { value: 'SWATI', label: 'SWATI' },
  { value: 'PURCHASE ENQUIRY', label: 'PURCHASE ENQUIRY' },
  { value: 'TENDER ENQUIRY', label: 'TENDER ENQUIRY' },
]

const dealSources = ['LUMOS', 'SWATI', 'PURCHASE ENQUIRY', 'TENDER ENQUIRY']
const dealStatuses = ['new', 'negotiation', 'won', 'lost', 'hold', 'dropped']

const initialFormData = {
  accountName: '',
  accountOwner: '',
  projectName: '',
  projectCode: '',
  projectType: '',
  projectLocation: '',
  projectValue: '',
  projectStatus: 'Active',
  projectDescription: '',
  state: '',
  description: '',
  address: '',
  customerName: '',
  accountDate: new Date().toISOString().slice(0, 10),
  accountCategory: '',
  accountSource: '',
  accountState: '',
  customerType: '',
  productCategory: '',
  industryType: '',
  customerRefNo: '',
  customerRefDate: '',
  consultantName: '',
  pmcName: '',
  architectName: '',
  contactPerson: '',
  contactDesignation: '',
  contactEmail: '',
  contactPhone: '',
  contactMobile: '',
  reminderDate: '',
  reminderMode: '',
  remark: '',
  // Deal Details Fields
  dealDate: new Date().toISOString().slice(0, 10),
  dealName: '',
  dealDescription: '',
  poValue: '',
  dealCoOwners: '',
  dealValue: '',
  dealScore: '',
  customerQuotationStatus: '',
  dealType: '',
  dealSource: '',
  dealOwner: '',
  dealCity: '',
  expectedClosureDate: new Date().toISOString().slice(0, 10),
  probability: '1',
  gstin: '',
  jobNo: '',
  customerOrderStatus: '',
  valueCurrency: 'INR',
  dealStatus: 'new',
  dealStage: '',
}

const requiredMessages = {
  accountName: 'Account Name: Please provide Account Name',
  accountOwner: 'Account Owner: Please select Account Owner',
  accountSource: 'Account Source: Please select Account Source',
  state: 'State: Please provide State',
  industryType: 'Industry type: Please select Industry type',
}

const fieldGroups = {
  basicLeft: [
    { name: 'accountName', label: 'Account Name', required: true },
    { name: 'accountCategory', label: 'Vertical Name', type: 'select', options: accountCategories, required: true },
    { name: 'accountOwner', label: 'Account Owner', type: 'select', options: [], required: true },
    { name: 'state', label: 'State', type: 'select', options: states, required: true },
    { name: 'description', label: 'Remark', type: 'textarea', textareaRows: 3, fieldClassName: 'min-h-[88px]' },
    { name: 'address', label: 'Address', type: 'textarea', textareaRows: 3, fieldClassName: 'min-h-[88px]' },
  ],
  basicRight: [
    { name: 'accountDate', label: 'Account Date', type: 'date', required: true },
    { name: 'accountSource', label: 'Account Source', type: 'select', options: accountSources, required: true },
    { name: 'customerName', label: 'Customer Name' },
    { name: 'consultantName', label: 'Consultant/AR Name' },
    { name: 'customerType', label: 'Customer Type', type: 'select', options: customerTypes },
    { name: 'customerRefNo', label: 'Inquiry Ref No.' },
    { name: 'customerRefDate', label: 'Inquiry Ref Date', type: 'date' },
    { name: 'industryType', label: 'Industry Type', type: 'select', options: industryTypes, required: true },
  ],
  dealDetailsLeft: [
    { name: 'dealDate', label: 'Deal Date', type: 'date' },
    { name: 'dealName', label: 'Deal Name' },
    { name: 'dealDescription', label: 'Description', type: 'textarea', textareaRows: 2 },
    { name: 'poValue', label: 'PO Value', type: 'number' },
    { name: 'dealCoOwners', label: 'Deal Co-Owners', type: 'select', options: [] },
    { name: 'dealValue', label: 'Deal Value (PO Value/Base Price)', type: 'number' },
    { name: 'dealScore', label: 'Deal Score', type: 'number' },
    { name: 'consultantName', label: 'Consultant/AR Name' },
    { name: 'customerRefNo', label: 'Customer Ref. No.' },
    { name: 'projectName', label: 'Project Name' },
    { name: 'customerQuotationStatus', label: 'Status Of Customer as per quotation Given', type: 'select', options: CUSTOMER_QUOTATION_STATUS_OPTIONS },
    { name: 'dealType', label: 'Deal Type', type: 'select', options: dealTypes },
  ],
  dealDetailsRight: [
    { name: 'dealSource', label: 'Deal Source', type: 'select', options: dealSources },
    { name: 'dealOwner', label: 'Deal Owner', type: 'select', options: [] },
    { name: 'address', label: 'Address', type: 'textarea', textareaRows: 2 },
    { name: 'dealCity', label: 'City' },
    { name: 'expectedClosureDate', label: 'Expected Closure Date', type: 'date' },
    { name: 'probability', label: 'Probability (%)', type: 'range' },
    { name: 'productCategory', label: 'Product Category' },
    { name: 'customerRefDate', label: 'Customer Ref. Date', type: 'date' },
    { name: 'gstin', label: 'GSTIN' },
    { name: 'jobNo', label: 'Job No' },
    { name: 'customerOrderStatus', label: 'Status of Customer as per Order Received', type: 'select', options: DEAL_LIFECYCLE_STATUS_OPTIONS },
    { name: 'valueCurrency', label: 'Currency', type: 'select', options: ['INR', 'USD', 'AED', 'EUR', 'GBP'] },
  ],
  projectDetails: [
    { name: 'projectName', label: 'Project Name' },
    { name: 'architectName', label: 'Architect / Consultant' },
    { name: 'pmcName', label: 'PMC Name' },
  ],
  contactsLeft: [
    { name: 'contactPerson', label: 'Contact Person' },
    { name: 'contactDesignation', label: 'Designation' },
  ],
  contactsRight: [
    { name: 'contactEmail', label: 'Contact Email', type: 'email' },
    { name: 'contactPhone', label: 'Contact Phone', type: 'tel' },
    { name: 'contactMobile', label: 'Contact Mobile', type: 'tel' },
  ],
  reminderLeft: [
    { name: 'reminderDate', label: 'Reminder Date', type: 'date' },
    { name: 'reminderMode', label: 'Reminder Mode', type: 'select', options: reminderTypes },
  ],
  reminderRight: [
    { name: 'remark', label: 'Remark', type: 'textarea', textareaRows: 4, fieldClassName: 'min-h-[110px]' },
  ],
}

const AddAccountWizard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { accounts, createAccount, createDeal, createReminder, addNotification } = useData()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [validationNotice, setValidationNotice] = useState([])
  const [saving, setSaving] = useState(false)
  const [ownerOptions, setOwnerOptions] = useState([])

  const [isExistingCustomer, setIsExistingCustomer] = useState(false)
  const [customerSearch, setCustomerSearch] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [customers, setCustomers] = useState(() => customerService.getCustomers())

  useEffect(() => {
    let isMounted = true
    loadAccountOwnerOptions()
      .then((options) => {
        if (isMounted) setOwnerOptions(options)
      })
      .catch((err) => console.error('Failed to load account owners:', err))

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const unsubscribe = customerService.subscribe((nextCustomers) => {
      setCustomers([...nextCustomers])
    })
    customerService.loadCustomers().then((nextCustomers) => setCustomers([...nextCustomers])).catch(() => {})
    return unsubscribe
  }, [])

  const categoryUpper = String(formData.accountCategory || '').toUpperCase().trim()
  const activeOwners = filterAccountOwnerOptionsByVertical(ownerOptions, formData.accountCategory).map(owner => ({
    value: owner.name,
    label: getAccountOwnerOptionLabel(owner),
    userObj: owner,
  }))

  const isAdmin = useMemo(() => location.pathname.startsWith('/admin'), [location.pathname])
  const backPath = isAdmin ? '/admin/accounts/my-accounts' : '/accounts/my-group-accounts'
  const categoryLogo = useMemo(
    () => getAccountCategoryLogo(formData.accountCategory),
    [formData.accountCategory]
  )

  const customerOptions = useMemo(() => {
    const customerRecords = customers.map((customer) => ({
      ...customer,
      sourceType: customer.sourceType || 'customer',
    }))
    const customerKeys = new Set(customerRecords.flatMap((customer) => [
      String(customer.id || '').toLowerCase(),
      String(customer.customerName || '').trim().toLowerCase(),
      String(customer.customerNumber || '').trim().toLowerCase(),
    ].filter(Boolean)))

    const buildCustomerFromAccount = (account = {}) => ({
      id: `account-${account.id || account.accountId || account.accountNumber || account.accountNo || account.name}`,
      sourceType: 'account',
      accountId: account.id || account.accountId || '',
      customerNumber: account.customerNumber || account.customerRefNo || account.accountNumber || account.accountNo || '',
      customerName: account.customerName || account.accountName || account.name || account.company || '',
      customerOwner: account.accountOwner || account.ownerName || account.assignedUserName || '',
      customerOwnerDisplay: account.accountOwnerDisplay || getAccountOwnerOptionLabel({ name: account.accountOwner || account.ownerName || '' }),
      customerCategory: account.customerCategory || account.accountCategory || account.category || '',
      customerStatus: account.customerStatus || account.accountStatus || account.status || '',
      address: account.address || '',
      gstin: account.gstin || '',
      consultantName: account.consultantName || '',
      jobNo: account.jobNo || '',
      projectName: account.projectName || '',
      contacts: [
        {
          contactPerson: account.contactPerson || account.contactName || '',
          phone: account.contactPhone || account.phone || '',
          mobile: account.contactMobile || account.mobile || account.contactPhone || account.phone || '',
          email: account.contactEmail || account.email || '',
          designation: account.contactDesignation || account.designation || '',
        },
      ],
    })

    const accountRecords = accounts
      .map(buildCustomerFromAccount)
      .filter((customer) => customer.customerName)
      .filter((customer) => ![
        String(customer.accountId || '').toLowerCase(),
        String(customer.customerName || '').trim().toLowerCase(),
        String(customer.customerNumber || '').trim().toLowerCase(),
      ].some((key) => customerKeys.has(key)))

    return [...customerRecords, ...accountRecords]
  }, [accounts, customers])

  const filteredCustomers = useMemo(() => {
    const searchValue = customerSearch.trim().toLowerCase()
    if (!searchValue) return []
    return customerOptions
      .map((customer) => {
        const primaryContact = customer.contacts?.[0] || {}
        const searchableFields = [
          customer.customerName,
          customer.customerNumber,
          customer.customerOwner,
          customer.customerCategory,
          customer.customerStatus,
          customer.address,
          primaryContact.email,
          primaryContact.mobile,
          primaryContact.phone,
          primaryContact.contactPerson,
        ].map((field) => String(field || '').toLowerCase())
        const matched = searchableFields.some((field) => field.includes(searchValue))
        return { customer, matched }
      })
      .filter((entry) => entry.matched)
      .map((entry) => entry.customer)
      .slice(0, 12)
  }, [customerOptions, customerSearch])

  const handleSelectCustomer = (customer) => {
    const primaryContact = customer.contacts?.[0] || {}
    setSelectedCustomerId(customer.id)
    setCustomerSearch(customer.customerName)
    setErrors((prev) => {
      const next = { ...prev }
      delete next.customer
      return next
    })
    
    setFormData((prev) => ({
      ...prev,
      accountName: customer.customerName || prev.accountName,
      customerName: customer.customerName || prev.customerName,
      address: customer.address || prev.address,
      contactPerson: primaryContact.contactPerson || prev.contactPerson,
      contactPhone: primaryContact.phone || prev.contactPhone,
      contactMobile: primaryContact.mobile || prev.contactMobile,
      contactEmail: primaryContact.email || prev.contactEmail,
      contactDesignation: primaryContact.designation || prev.contactDesignation,
      consultantName: customer.consultantName || prev.consultantName,
      projectName: customer.projectName || prev.projectName,
      accountCategory: customer.customerCategory || prev.accountCategory,
      dealName: `${customer.customerName || 'Account'} Deal`,
      dealType: customer.customerCategory || prev.dealType,
    }))
  }

  const validateStep = (stepIndex) => {
    const nextErrors = {}

    if (stepIndex === 0) {
      Object.entries(requiredMessages).forEach(([field, message]) => {
        if (!formData[field]?.trim()) {
          nextErrors[field] = message
        }
      })
      if (isExistingCustomer && !selectedCustomerId && !customerSearch.trim()) {
        nextErrors.customer = 'Please select a customer or type a valid customer name.'
      }
    }

    if (stepIndex === 1) {
      // Deal details are optional. However, if they entered a dealName, we might want to validate some fields, 
      // but per requirements, it can be skipped. We will only flag errors if they provided partial critical data.
      if (formData.dealName && !formData.dealValue) {
        nextErrors.dealValue = 'Please provide a deal value if you are adding a deal.'
      }
    }

    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      nextErrors.contactEmail = 'Enter a valid contact email.'
    }

    setErrors((prev) => ({ ...prev, ...nextErrors }))
    setValidationNotice(
      Object.entries(requiredMessages)
        .filter(([field]) => nextErrors[field])
        .map(([, message]) => message)
    )
    return Object.keys(nextErrors).length === 0
  }

  const validateAllSteps = () => {
    const collectedErrors = {}

    Object.entries(requiredMessages).forEach(([field, message]) => {
      if (!formData[field]?.trim()) {
        collectedErrors[field] = message
      }
    })

    if (isExistingCustomer && !selectedCustomerId && !customerSearch.trim()) {
      collectedErrors.customer = 'Please select a customer or type a valid customer name.'
    }

    if (formData.dealName && !formData.dealValue) {
      collectedErrors.dealValue = 'Please provide a deal value if you are adding a deal.'
    }

    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      collectedErrors.contactEmail = 'Enter a valid contact email.'
    }

    setErrors(collectedErrors)
    setValidationNotice(
      Object.entries(requiredMessages)
        .filter(([field]) => collectedErrors[field])
        .map(([, message]) => message)
    )
    return collectedErrors
  }

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setValidationNotice((prev) =>
      prev.filter((message) => message !== requiredMessages[name])
    )
    setErrors((prev) => {
      if (!prev[name]) return prev
      const nextErrors = { ...prev }
      delete nextErrors[name]
      return nextErrors
    })
  }

  const handleStepChange = (targetStep) => {
    if (targetStep <= currentStep) {
      setCurrentStep(targetStep)
      return
    }

    if (validateStep(currentStep)) {
      setCurrentStep(targetStep)
    } else {
      triggerErrorScroll()
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
      setValidationNotice([])
    } else {
      triggerErrorScroll()
      addNotification('error', 'Required Fields', 'Please complete all required fields marked as required.')
    }
  }

  const triggerErrorScroll = () => {
    setTimeout(() => {
      const firstInvalid = document.querySelector('.legacy-form-error-message, .admin-add-deal-input-error, .border-red-500')
      if (firstInvalid) {
        const fieldContainer = firstInvalid.closest('.legacy-form-row, .legacy-form-field-stack, .add-account-landscape-field-column, .relative') || firstInvalid
        fieldContainer.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validateAllSteps()

    if (Object.keys(validationErrors).length > 0) {
      // Find which step failed and redirect
      const errorKeys = Object.keys(validationErrors)
      let stepWithError = 0
      if (errorKeys.some(key => ['accountName', 'accountOwner', 'accountSource', 'state', 'industryType', 'customer'].includes(key))) {
        stepWithError = 0
      } else if (errorKeys.some(key => ['dealValue'].includes(key))) {
        stepWithError = 1
      } else if (errorKeys.some(key => ['contactEmail'].includes(key))) {
        stepWithError = 2
      }
      
      if (currentStep !== stepWithError) {
        setCurrentStep(stepWithError)
      }
      triggerErrorScroll()
      addNotification('error', 'Required Fields', 'Please complete all required fields marked as required.')
      return
    }

    setSaving(true)
    setValidationNotice([])

    const selectedOwner = activeOwners.find(o => o.value === formData.accountOwner)
    const finalOwnerName = selectedOwner ? selectedOwner.userObj.name : formData.accountOwner
    const finalOwnerCode = selectedOwner && selectedOwner.userObj ? (selectedOwner.userObj.ownerCode || '') : ''

    const accountPayload = {
      name: formData.accountName,
      email: formData.contactEmail,
      phone: formData.contactMobile || formData.contactPhone,
      industry: formData.industryType,
      status: formData.accountState || 'pending',
      accountState: formData.accountState || 'pending',
      source: formData.accountSource,
      ownerName: finalOwnerName,
      addedBy: user?.name || user?.username || '',
      address: formData.address,
      createdByUserId: user?.id || '',
      createdByUserName: user?.name || user?.username || '',
      employeeId: user?.employeeId || user?.ownerCode || '',
      department: user?.department || '',
      userEmail: user?.email || '',
      ...formData,
      accountOwner: finalOwnerName,
      accountOwnerCode: finalOwnerCode,
      company: selectedOwner?.userObj?.company || selectedOwner?.userObj?.companyName || formData.accountCategory || '',
      contacts: [
        {
          name: formData.contactPerson,
          designation: formData.contactDesignation,
          email: formData.contactEmail,
          phone: formData.contactPhone,
          mobile: formData.contactMobile,
        },
      ],
      projects: [
        {
          projectName: formData.projectName,
          projectCode: formData.projectCode,
          projectType: formData.projectType,
          projectLocation: formData.projectLocation,
          consultantName: formData.consultantName,
          architectName: formData.architectName,
          pmcName: formData.pmcName,
          projectValue: formData.projectValue,
          projectStatus: formData.projectStatus,
          projectDescription: formData.projectDescription,
        },
      ],
    }

    // Always create account first
    const accountResult = await createAccount(accountPayload)

    if (accountResult.success) {
      const createdAccountId = accountResult.data?.id || accountResult.data?._id || ''
      const createdAccountName = accountResult.data?.name || formData.accountName || ''

      // If Deal Name is provided, create a Deal using the new Account ID
      if (formData.dealName.trim()) {
        const dealPayload = {
          name: formData.dealName.trim(),
          dealDate: formData.dealDate || new Date().toISOString().slice(0, 10),
          description: formData.dealDescription || '',
          poValue: parseFloat(formData.poValue) || 0,
          dealCoOwners: formData.dealCoOwners || '',
          value: parseFloat(formData.dealValue) || 0,
          valueCurrency: formData.valueCurrency || 'INR',
          dealScore: parseFloat(formData.dealScore) || 0,
          consultantName: formData.consultantName || '',
          customerRefNo: formData.customerRefNo || '',
          projectName: formData.projectName || '',
          quotationCustomerStatus: formData.customerQuotationStatus || '',
          dealType: formData.dealType || formData.accountCategory,
          dealSource: formData.dealSource || formData.accountSource,
          dealOwner: formData.dealOwner || finalOwnerName,
          ownerName: formData.dealOwner || finalOwnerName,
          city: formData.dealCity || '',
          closeDate: formData.expectedClosureDate,
          expectedClosureDate: formData.expectedClosureDate,
          probability: parseFloat(formData.probability) || 1,
          productCategory: formData.productCategory || '',
          customerRefDate: formData.customerRefDate || '',
          gstin: formData.gstin || '',
          jobNo: formData.jobNo || '',
          orderCustomerStatus: formData.customerOrderStatus || '',
          status: formData.dealStatus,
          stage: formData.dealStage || 'new',
          accountId: createdAccountId,
          accountName: createdAccountName,
          customerName: formData.customerName || createdAccountName,
          contacts: [
            {
              name: formData.contactPerson,
              designation: formData.contactDesignation,
              email: formData.contactEmail,
              phone: formData.contactPhone,
              mobile: formData.contactMobile,
            }
          ]
        }
        await createDeal(dealPayload).catch((err) => console.error('Failed to create deal', err))
      }

      // Create reminder if fields filled
      if (formData.reminderDate || formData.remark) {
        await createReminder({
          title: 'Account Follow-up',
          message: formData.remark?.trim() || '',
          remindAt: formData.reminderDate ? `${formData.reminderDate}T10:00:00` : new Date().toISOString(),
          status: 'scheduled',
          relatedEntityType: 'account',
          relatedEntityId: createdAccountId,
          assignedTo: finalOwnerName,
          reminderDate: formData.reminderDate,
          reminderTime: '10:00',
          reminderMode: formData.reminderMode,
        }).catch((err) => console.error('Failed to create reminder', err))
      }



      addNotification(
        'success',
        'Records Created',
        `${formData.accountName} is now visible in Search Account.`
      )

      if (accountResult.data) {
        const normalizedAccount = normalizeAccountRecord(accountResult.data)
        const nextParams = new URLSearchParams({
          stage: normalizedAccount.stage || 'new',
          accountId: normalizedAccount.id,
          page: '1',
        })
        navigate(`${backPath}?${nextParams.toString()}`, {
          state: {
            newAccountId: normalizedAccount.id,
            newAccountName: normalizedAccount.name,
          },
        })
      } else {
        navigate(backPath)
      }
    } else {
      addNotification('error', 'Save Failed', accountResult.message || 'Unable to create account.')
    }
    
    setSaving(false)
  }

  const renderFieldGroup = (fields, options = {}) =>
    fields.map((field) => (
      <LegacyFormField
        key={field.name}
        label={field.label}
        name={field.name}
        type={field.type}
        value={formData[field.name]}
        onChange={handleChange}
        required={field.required}
        options={field.options}
        error={errors[field.name]}
        placeholder={field.placeholder}
        textareaRows={field.textareaRows}
        fieldClassName={field.fieldClassName}
        layout={options.layout}
        rowClassName={[options.rowClassName, field.rowClassName].filter(Boolean).join(' ')}
        inputWrapperClassName={options.inputWrapperClassName}
      />
    ))

  return (
    <div className="add-account-landscape-page">
      <form
        onSubmit={handleSubmit}
        className="add-account-landscape-form"
      >
        <WizardStepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={handleStepChange}
          className="add-account-landscape-stepper"
        />

        {currentStep === 0 ? (
          <LegacyFormSection
            title="Account Basic Details"
            subtitle="Required fields are marked with an asterisk. Layout follows a compact legacy CRM structure."
            className="add-account-landscape-section"
            headerClassName="pb-2"
            titleClassName="text-[17px] sm:text-[18px]"
            subtitleClassName="text-[9px] text-[var(--text-muted)]"
          >
            <div className="mb-4 flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
              <input 
                type="checkbox" 
                id="existingCustomerCheckbox" 
                checked={isExistingCustomer} 
                onChange={(e) => setIsExistingCustomer(e.target.checked)} 
                className="mr-2 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="existingCustomerCheckbox" className="font-semibold text-sm text-gray-700 cursor-pointer select-none">Are your current Account is existing customer?</label>
            </div>
            
            {isExistingCustomer && (
              <div className="mb-6 relative">
                <label className="block text-sm font-semibold mb-1 text-slate-700">
                  Customer Search <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value)
                    setSelectedCustomerId('')
                  }}
                  placeholder="Start typing the customer name (e.g. Tata, Demo)"
                  className={`w-full p-2 border rounded outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-shadow ${errors.customer ? 'border-red-500 admin-add-deal-input-error' : 'border-gray-300'}`}
                />
                {errors.customer && <p className="text-xs text-red-600 mt-1 legacy-form-error-message">{errors.customer}</p>}
                {filteredCustomers.length > 0 && !selectedCustomerId && (
                  <div className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded shadow-lg max-h-60 overflow-y-auto">
                    {filteredCustomers.map(c => (
                      <div key={c.id} onClick={() => handleSelectCustomer(c)} className="p-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-0">
                        <div className="font-semibold text-sm text-slate-800">{c.customerName}</div>
                        <div className="text-xs text-slate-500">
                          <span className="bg-gray-100 px-1 py-0.5 rounded mr-2">{c.sourceType === 'account' ? 'Account' : 'Customer'}</span>
                          {c.customerNumber || 'No number'} | {c.customerOwnerDisplay || 'No owner'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {selectedCustomerId && customerSearch.trim() && (
                  <div className="mt-2 text-sm text-green-700 bg-green-50 p-2 rounded border border-green-100">
                    Selected: <strong>{customerSearch}</strong>. Details auto-filled!
                  </div>
                )}
              </div>
            )}

            <div className="add-account-landscape-field-grid add-account-landscape-field-grid-two">
              <div className="add-account-landscape-field-column">
                {renderFieldGroup(
                  fieldGroups.basicLeft.map(f => f.name === 'accountOwner' ? { ...f, options: activeOwners } : f),
                  {
                    layout: 'inline',
                    rowClassName: '',
                    inputWrapperClassName: 'w-full max-w-none',
                  }
                )}
              </div>
              <div className="add-account-landscape-field-column">
                {renderFieldGroup(fieldGroups.basicRight, {
                  layout: 'inline',
                  inputWrapperClassName: 'w-full max-w-none',
                })}
              </div>
            </div>
          </LegacyFormSection>
        ) : null}

        {currentStep === 0 ? (
          <LegacyFormSection
            title="Project Details"
            className="add-account-landscape-section"
            headerClassName="pb-2"
            titleClassName="text-[17px] sm:text-[18px]"
          >
            <div className="add-account-landscape-field-grid add-account-landscape-field-grid-three">
              {renderFieldGroup(fieldGroups.projectDetails, {
                layout: 'inline',
                inputWrapperClassName: 'w-full max-w-none',
              })}
            </div>
          </LegacyFormSection>
        ) : null}

        {currentStep === 1 ? (
          <LegacyFormSection
            title="Deal Details (Optional)"
            subtitle="Fill these details if you also want to create a Deal alongside the Account."
            className="add-account-landscape-section"
          >
            <div className="add-account-landscape-field-grid add-account-landscape-field-grid-two">
              <div className="add-account-landscape-field-column">
                {renderFieldGroup(
                  fieldGroups.dealDetailsLeft.map(f => f.name === 'dealCoOwners' ? { ...f, options: activeOwners, type: 'select', isMulti: true } : f),
                  { layout: 'inline' }
                )}
              </div>
              <div className="add-account-landscape-field-column">
                {renderFieldGroup(
                  fieldGroups.dealDetailsRight.map(f => f.name === 'dealOwner' ? { ...f, options: activeOwners } : f),
                  { layout: 'inline' }
                )}
              </div>
            </div>
          </LegacyFormSection>
        ) : null}

        {currentStep === 2 ? (
          <LegacyFormSection
            title="Contacts"
            subtitle="Add the primary contact details linked to this account."
            className="add-account-landscape-section"
          >
            <div className="add-account-landscape-field-grid add-account-landscape-field-grid-two">
              <div className="add-account-landscape-field-column">{renderFieldGroup(fieldGroups.contactsLeft, { layout: 'inline' })}</div>
              <div className="add-account-landscape-field-column">{renderFieldGroup(fieldGroups.contactsRight, { layout: 'inline' })}</div>
            </div>
          </LegacyFormSection>
        ) : null}

        {currentStep === 3 ? (
          <LegacyFormSection
            title="Reminders"
            subtitle="Capture follow-up details and internal notes before saving the account."
            className="add-account-landscape-section"
          >
            <div className="add-account-landscape-field-grid add-account-landscape-field-grid-two">
              <div className="add-account-landscape-field-column">{renderFieldGroup(fieldGroups.reminderLeft, { layout: 'stacked' })}</div>
              <div className="add-account-landscape-field-column">{renderFieldGroup(fieldGroups.reminderRight, { layout: 'stacked' })}</div>
            </div>
          </LegacyFormSection>
        ) : null}

        <div className="add-account-landscape-footer">
          <p>
            Step {currentStep + 1} of {steps.length}
          </p>

          <div>
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="add-account-landscape-button add-account-landscape-button-secondary"
            >
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="add-account-landscape-button add-account-landscape-button-primary"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={saving}
                className="add-account-landscape-button add-account-landscape-button-primary"
              >
                {saving ? 'Saving...' : 'Submit'}
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate(backPath)}
              className="add-account-landscape-button add-account-landscape-button-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddAccountWizard
