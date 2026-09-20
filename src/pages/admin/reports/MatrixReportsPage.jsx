import React, { useState } from 'react'
import { useData } from '../../../context/DataContext'
import { useMatrixAggregator } from '../../../hooks/useMatrixAggregator'
import { DataMatrixTable } from '../../../components/reports/DataMatrixTable'
import './MatrixReportsPage.css'

export const MatrixReportsPage = () => {
  const { deals, quotations, customers } = useData()
  const [activeTab, setActiveTab] = useState('deals')

  // Matrix Configuration - Deals
  const dealMatrix = useMatrixAggregator(
    deals || [],
    (record) => record.status || record.stage || 'Pending',
    (record) => record.accountOwner || record.addedBy || record.ownerCode || 'Unassigned'
  )

  // Matrix Configuration - Quotations
  const quotationMatrix = useMatrixAggregator(
    quotations || [],
    (record) => record.status || record.stage || 'Pending',
    (record) => record.accountOwner || record.addedBy || record.ownerCode || 'Unassigned'
  )

  // Matrix Configuration - Customers
  const customerMatrix = useMatrixAggregator(
    customers || [],
    (record) => record.category || record.type || 'Standard',
    (record) => record.accountOwner || record.addedBy || record.ownerCode || 'Unassigned'
  )

  return (
    <div className="matrix-reports-page">
      <header className="matrix-reports-header">
        <h1>Matrix Reports</h1>
        <p>Cross-tabulated views of your CRM data</p>
      </header>

      <div className="matrix-tabs">
        <button 
          className={`matrix-tab-btn ${activeTab === 'deals' ? 'active' : ''}`}
          onClick={() => setActiveTab('deals')}
        >
          Deals Matrix
        </button>
        <button 
          className={`matrix-tab-btn ${activeTab === 'quotations' ? 'active' : ''}`}
          onClick={() => setActiveTab('quotations')}
        >
          Quotations Matrix
        </button>
        <button 
          className={`matrix-tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          Customers Matrix
        </button>
      </div>

      <div className="matrix-reports-content">
        {activeTab === 'deals' && (
          <DataMatrixTable 
            title="Deals by Status & Owner" 
            rowTitle="Deal Status"
            {...dealMatrix} 
          />
        )}
        
        {activeTab === 'quotations' && (
          <DataMatrixTable 
            title="Quotations by Stage & Owner" 
            rowTitle="Quotation Stage"
            {...quotationMatrix} 
          />
        )}

        {activeTab === 'customers' && (
          <DataMatrixTable 
            title="Customers by Category & Owner" 
            rowTitle="Customer Category"
            {...customerMatrix} 
          />
        )}
      </div>
    </div>
  )
}

export default MatrixReportsPage
