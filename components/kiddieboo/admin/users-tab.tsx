"use client"

import { useState } from "react"
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
  Crown,
} from "lucide-react"

type UserProfile = {
  id: string
  email: string
  full_name: string | null
  is_admin: boolean
  created_at: string
}

const SUPER_ADMIN_EMAIL = "odedasiedu1@gmail.com"

export function UsersTab({
  users: initialUsers,
  currentUserEmail,
}: {
  users: UserProfile[]
  currentUserEmail?: string
}) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "admins" | "customers">("all")
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteAsAdmin, setInviteAsAdmin] = useState(false)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const isSuperAdmin = currentUserEmail === SUPER_ADMIN_EMAIL

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
    if (!isSuperAdmin) {
      toast.error("Only the super admin can change roles")
      return
    }

    const targetUser = users.find((u) => u.id === userId)
    if (targetUser?.email === SUPER_ADMIN_EMAIL) {
      toast.error("Cannot modify the super admin's role")
      return
    }

    setTogglingId(userId)
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, is_admin: !currentIsAdmin }),
    })

    setTogglingId(null)
    if (!res.ok) {
      const { error } = await res.json()
      toast.error("Failed to update role", { description: error })
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
    if (user.email === SUPER_ADMIN_EMAIL) {
      toast.error("Cannot delete the super admin account")
      return
    }
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

    if (inviteAsAdmin && !isSuperAdmin) {
      toast.error("Only the super admin can invite new admins")
      return
    }

    setInviteLoading(true)
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail.trim(), makeAdmin: inviteAsAdmin }),
    })

    setInviteLoading(false)
    if (!res.ok) {
      const { error } = await res.json()
      toast.error("Invite failed", { description: error })
    } else {
      toast.success("Invitation sent!", {
        description: `An invite email has been sent to ${inviteEmail.trim()}${inviteAsAdmin ? " with admin access" : ""}.`,
      })
      setInviteEmail("")
      setInviteAsAdmin(false)
      setShowInvite(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground">
            {users.length} registered users
            {isSuperAdmin && (
              <span className="ml-2 inline-flex items-center gap-1 text-amber-600">
                <Crown className="h-3.5 w-3.5" />
                Super Admin
              </span>
            )}
          </p>
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
          className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
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
          </div>
          {isSuperAdmin && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={inviteAsAdmin}
                onChange={(e) => setInviteAsAdmin(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <Shield className="h-3.5 w-3.5 text-primary" />
              Grant admin access to this user
            </label>
          )}
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
            {filtered.map((user) => {
              const isSuper = user.email === SUPER_ADMIN_EMAIL
              return (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {(user.full_name ?? user.email ?? "?")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground flex items-center gap-1.5">
                          {user.full_name || <span className="text-muted-foreground italic">No name</span>}
                          {isSuper && <Crown className="h-3.5 w-3.5 text-amber-500" />}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <div className="mt-1 sm:hidden">
                          {isSuper ? (
                            <Badge className="bg-amber-500 text-white text-[10px]">Super Admin</Badge>
                          ) : user.is_admin ? (
                            <Badge className="bg-primary text-primary-foreground text-[10px]">Admin</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-[10px]">Customer</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    {isSuper ? (
                      <Badge className="bg-amber-500 text-white">Super Admin</Badge>
                    ) : user.is_admin ? (
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
                      {isSuper ? (
                        <span className="text-xs text-muted-foreground italic">Protected</span>
                      ) : (
                        <>
                          {isSuperAdmin && (
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
                                  <span className="hidden sm:inline">Revoke Admin</span>
                                </>
                              ) : (
                                <>
                                  <Shield className="h-3.5 w-3.5 sm:mr-1.5" />
                                  <span className="hidden sm:inline">Make Admin</span>
                                </>
                              )}
                            </Button>
                          )}
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
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
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
