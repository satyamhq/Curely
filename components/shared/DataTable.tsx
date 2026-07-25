'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  searchKey?: keyof T
  placeholder?: string
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchKey,
  placeholder = 'Filter table records...',
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = searchKey
    ? data.filter((row) =>
        String(row[searchKey] ?? '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : data

  return (
    <div className="space-y-4">
      {searchKey && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-muted/50 text-muted-foreground uppercase tracking-wider font-semibold">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                  No matching records found.
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-foreground">
                      {col.render ? col.render(row) : String(row[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
