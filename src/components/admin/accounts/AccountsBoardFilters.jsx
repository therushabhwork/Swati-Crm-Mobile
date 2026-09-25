import React from 'react'

const AccountsBoardFilters = ({ columns, filters, onFilterChange, showSerialNumber = true, ownerOptions = [] }) => (
  <tr className="admin-accounts-filter-row">
    {showSerialNumber ? (
      <th style={{ width: '52px' }}><span className="admin-accounts-filter-placeholder">-</span></th>
    ) : null}
    {columns.map((column) => {
      const isOwnerCol = column.key === 'accountOwner' || column.key === 'owner' || column.key === 'accountOwnerName'
      const hasOptions = Array.isArray(ownerOptions) && ownerOptions.length > 0

      if (isOwnerCol && hasOptions) {
        return (
          <th key={column.key} className="admin-accounts-filter-cell">
            <select
              value={filters[column.key] || ''}
              onChange={(event) => onFilterChange(column.key, event.target.value)}
              className="admin-accounts-filter-input"
              style={{ padding: '2px 4px', fontSize: '0.82rem', height: '28px', cursor: 'pointer' }}
            >
              <option value="">All Owners</option>
              {ownerOptions.map((opt) => {
                const val = typeof opt === 'string' ? opt : (opt.value || opt.label)
                const lbl = typeof opt === 'string' ? opt : (opt.label || opt.value)
                return <option key={val} value={val}>{lbl}</option>
              })}
            </select>
          </th>
        )
      }

      return (
        <th key={column.key} className="admin-accounts-filter-cell">
          {column.searchable ? (
            <input
              type="text"
              value={filters[column.key] || ''}
              onChange={(event) => onFilterChange(column.key, event.target.value)}
              placeholder={column.filterPlaceholder || `Search ${column.label}`}
              className="admin-accounts-filter-input"
            />
          ) : (
            <span className="admin-accounts-filter-placeholder">-</span>
          )}
        </th>
      )
    })}
  </tr>
)

export default AccountsBoardFilters
