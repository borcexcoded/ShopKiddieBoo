"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  Shield,
  ShieldOff,
  Search,
  Users,
  UserCheck,
  User,
  Trash2,
  Mail,
  X,
} from "lucide-react"

type UserProfile = {
  id: string
  email: string
  full_name: string | null
  is_admin: boolean
  created_at: string
}

export function UsersTab({ users: initialUsers }: { users: UserProfile[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "admins" | "customers">("all")
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteLoading, setInviteLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const filtered = users.filter((user) => {
    const matchesSearch =
      (user.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (user.full_name ?? "").toLowerCase().includes(search.toLowerCase())
    const matchesFilter =
      filter === "all" ||
      (filter === "admins" && user.is_admin) ||
      (filter === "customers" && !user.is_admin)
    return matchesSearch && matchesFilter
  })

  const adminCount = users.filter((u) => u.is_admin).length
  const customerCount = users.filter((u) => !u.is_admin).length

  async function toggleAdmin(userId: string, currentIsAdmin: boolean) {
    setTogglingId(userId)
    const supabase = createClient()
    const { error } = await supabase
      .from("profiles")
      .update({ is_admin: !currentIsAdmin })
      .eq("id", userId)

    setTogglingId(null)
    if (error) {
      toast.error("Failed to update role", {
        description: error.message,
      })
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_admin: !currentIsAdmin } : u))
      )
      toast.success(!currentIsAdmin ? "Admin access granted" : "Admin access removed", {
        description: !currentIsAdmin
          ? "User can now access the admin dashboard."
          : "User has been demoted to customer.",
      })
    }
  }

  async function handleDelete(user: UserProfile) {
    if (!confirm(`Delete account for ${user.email}? This cannot be undone.`)) return

    setDeletingId(user.id)
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    })

    setDeletingId(null)
    if (!res.ok) {
      const { error } = await res.json()
      toast.error("Failed to delete user", { description: error })
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== user.id))
      toast.success("User deleted", {
        description: `${user.email} has been removed.`,
      })
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteEmail.trim()) return

    setInviteLoading(true)
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail.trim() }),
    })

    setInviteLoading(false)
    if (!res.ok) {
      const { error } = await res.json()
      toast.error("Invite failed", { description: error })
    } else {
      toast.success("Invitation sent!", {
        description: `An invite email has been sent to ${inviteEmail.trim()}.`,
      })
      setInviteEmail("")
      setShowInvite(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground">{users.length} registered users</p>
        </div>
        <Button onClick={() => setShowInvite((v) => !v)} variant={showInvite ? "outline" : "default"}>
          {showInvite ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Invite User
            </>
          )}
        </Button>
      </div>

      {/* Invite Panel */}
      {showInvite && (
        <form
          onSubmit={handleInvite}
          className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-end"
        >
          <div className="flex-1">
            <Label htmlFor="invite-email" className="mb-1.5 block text-sm font-semibold">
              Email address
            </Label>
            <Input
              id="invite-email"
              type="email"
              required
              placeholder="new.user@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={inviteLoading}>
            {inviteLoading ? "Sending..." : "Send Invite"}
          </Button>
        </form>
      )}

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Users</p>
            <p className="text-xl font-extrabold text-foreground">{users.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
            <UserCheck className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Admins</p>
            <p className="text-xl font-extrabold text-foreground">{adminCount}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <User className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Customers</p>
            <p className="text-xl font-extrabold text-foreground">{customerCount}</p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex shrink-0 gap-2">
          {(["all", "admins", "customers"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold text-foreground">User</th>
              <th className="hidden px-4 py-3 text-left font-semibold text-foreground sm:table-cell">Role</th>
              <th className="hidden px-4 py-3 text-left font-semibold text-foreground md:table-cell">Joined</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {(user.full_name ?? user.email ?? "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{user.full_name || <span className="text-muted-foreground italic">No name</span>}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <div className="mt-1 sm:hidden">
                        {user.is_admin ? (
                          <Badge className="bg-primary text-primary-foreground text-[10px]">Admin</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">Customer</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  {user.is_admin ? (
                    <Badge className="bg-primary text-primary-foreground">Admin</Badge>
                  ) : (
                    <Badge variant="secondary">Customer</Badge>
                  )}
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      size="sm"
                      variant={user.is_admin ? "outline" : "default"}
                      onClick={() => toggleAdmin(user.id, user.is_admin)}
                      disabled={togglingId === user.id}
                      className="shrink-0"
                    >
                      {user.is_admin ? (
                        <>
                          <ShieldOff className="h-3.5 w-3.5 sm:mr-1.5" />
                          <span className="hidden sm:inline">Remove Admin</span>
                        </>
                      ) : (
                        <>
                          <Shield className="h-3.5 w-3.5 sm:mr-1.5" />
                          <span className="hidden sm:inline">Make Admin</span>
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(user)}
                      disabled={deletingId === user.id}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete user"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                  {users.length === 0 ? "No users have signed in yet." : "No users match your search."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
