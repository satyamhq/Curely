'use client'

import { useEffect, useState } from 'react'
import { ProviderLayoutShell } from '@/components/layout/ProviderLayoutShell'
import { DataTable } from '@/components/shared/DataTable'
import { createClient } from '@/utils/supabase/client'
import { Loader2, AlertCircle } from 'lucide-react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function loadProfiles() {
      try {
        setLoading(true)
        setErrorMsg(null)
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, role, city, phone, created_at')
          .order('created_at', { ascending: false })

        if (error) throw error

        const mapped = (data || []).map((u: any) => ({
          id: u.id,
          name: u.full_name || 'Anonymous User',
          role: u.role,
          city: u.city || 'Not specified',
          phone: u.phone || 'Not specified',
        }))

        setUsers(mapped)
      } catch (err: any) {
        console.error('Error fetching profiles directory:', err)
        setErrorMsg(err.message || 'Failed to load profiles.')
      } finally {
        setLoading(false)
      }
    }

    loadProfiles()
  }, [])

  const columns = [
    { key: 'name', header: 'Full Name' },
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
    { key: 'phone', header: 'Phone' },
  ]

  return (
    <ProviderLayoutShell role="admin">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Users Directory</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all registered patient and healthcare provider accounts directly from PostgreSQL
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs font-medium text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading users directory...
          </div>
        ) : (
          <DataTable columns={columns} data={users} searchKey="name" placeholder="Search users by name or city..." />
        )}
      </div>
    </ProviderLayoutShell>
  )
}
