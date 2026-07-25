'use client'

import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { DataTable } from '@/components/shared/DataTable'

export default function AdminUsersPage() {
  const users = [
    { id: '1', name: 'Amit Patel', email: 'amit@example.com', role: 'patient', city: 'Mumbai' },
    { id: '2', name: 'Dr. Rajesh Sharma', email: 'rajesh@example.com', role: 'doctor', city: 'Mumbai' },
    { id: '3', name: 'Apollo Pharmacy', email: 'apollo@example.com', role: 'pharmacy', city: 'Mumbai' },
    { id: '4', name: 'Metropolis Lab', email: 'metropolis@example.com', role: 'lab', city: 'Mumbai' },
  ]

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Role',
      render: (r: any) => (
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary capitalize">
          {r.role}
        </span>
      ),
    },
    { key: 'city', header: 'City' },
  ]

  return (
    <ProviderLayoutShell role="admin">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Users Directory</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all registered patient and healthcare provider accounts
          </p>
        </div>

        <DataTable columns={columns} data={users} searchKey="name" placeholder="Search users by name or email..." />
      </div>
    </ProviderLayoutShell>
  )
}
