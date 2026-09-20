import { useMemo } from 'react'

const normalizeLabel = (label) => String(label || 'Unknown').trim()

export const useMatrixAggregator = (records, rowField, colField) => {
  return useMemo(() => {
    if (!records || !Array.isArray(records)) {
      return { columns: [], rows: [], totals: {}, grandTotal: 0 }
    }

    const colSet = new Set()
    const rowSet = new Set()
    
    // Pass 1: Discover all unique columns and rows
    records.forEach(record => {
      const rowVal = normalizeLabel(typeof rowField === 'function' ? rowField(record) : record[rowField])
      const colVal = normalizeLabel(typeof colField === 'function' ? colField(record) : record[colField])
      
      rowSet.add(rowVal)
      colSet.add(colVal)
    })

    const columns = Array.from(colSet).sort()
    const rowKeys = Array.from(rowSet).sort()

    // Pass 2: Aggregate counts
    const matrix = {}
    rowKeys.forEach(rk => {
      matrix[rk] = {}
      columns.forEach(ck => {
        matrix[rk][ck] = 0
      })
      matrix[rk].rowTotal = 0
    })

    const colTotals = {}
    columns.forEach(ck => { colTotals[ck] = 0 })

    let grandTotal = 0

    records.forEach(record => {
      const rowVal = normalizeLabel(typeof rowField === 'function' ? rowField(record) : record[rowField])
      const colVal = normalizeLabel(typeof colField === 'function' ? colField(record) : record[colField])

      matrix[rowVal][colVal] += 1
      matrix[rowVal].rowTotal += 1
      colTotals[colVal] += 1
      grandTotal += 1
    })

    const formattedRows = rowKeys.map(rk => ({
      id: rk,
      label: rk,
      counts: matrix[rk],
      total: matrix[rk].rowTotal
    }))

    return {
      columns: columns.map(c => ({ id: c, label: c })),
      rows: formattedRows,
      colTotals,
      grandTotal
    }
  }, [records, rowField, colField])
}
