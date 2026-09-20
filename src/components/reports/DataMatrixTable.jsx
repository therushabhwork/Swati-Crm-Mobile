import React from 'react'

export const DataMatrixTable = ({ title, columns, rows, colTotals, grandTotal, rowTitle = "Row" }) => {
  if (rows.length === 0) {
    return <div className="matrix-empty">No data available for {title}</div>
  }

  return (
    <div className="matrix-table-container">
      {title && <h3 className="matrix-table-title">{title}</h3>}
      <div className="table-responsive">
        <table className="crm-table matrix-table">
          <thead>
            <tr>
              <th>{rowTitle}</th>
              {columns.map(col => (
                <th key={col.id} className="text-center">{col.label}</th>
              ))}
              <th className="text-center matrix-total-col">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id}>
                <td className="fw-bold">{row.label}</td>
                {columns.map(col => (
                  <td key={col.id} className="text-center">
                    {row.counts[col.id] || 0}
                  </td>
                ))}
                <td className="text-center fw-bold matrix-total-col">{row.total}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="matrix-total-row">
              <td className="fw-bold">Grand Total</td>
              {columns.map(col => (
                <td key={col.id} className="text-center fw-bold">
                  {colTotals[col.id] || 0}
                </td>
              ))}
              <td className="text-center fw-bold matrix-total-col">{grandTotal}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
