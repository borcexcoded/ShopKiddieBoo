"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { CheckCircle2, Trash2, Mail, MailOpen } from "lucide-react"

type Message = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  created_at: string
}

export function MessagesTab({ messages: initialMessages }: { messages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages)

  async function toggleRead(id: string, currentRead: boolean) {
    const supabase = createClient()
    const { error } = await supabase
      .from("contact_messages")
      .update({ read: !currentRead })
      .eq("id", id)

    if (error) {
      toast.error("Failed to update message")
    } else {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read: !currentRead } : m))
      )
    }
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message?")) return
    const supabase = createClient()
    const { error } = await supabase.from("contact_messages").delete().eq("id", id)
    if (error) {
      toast.error("Failed to delete message")
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== id))
      toast.success("Message deleted")
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground">
          {messages.length} total &middot; {unreadCount} unread
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <Mail className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="font-medium text-foreground">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border bg-card p-5 ${
                msg.read ? "border-border" : "border-primary/30 bg-primary/[0.02]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {msg.read ? (
                      <MailOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Mail className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground">{msg.name}</p>
                      {!msg.read && (
                        <Badge className="bg-primary text-primary-foreground text-[10px]">New</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{msg.email}</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{msg.subject}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{msg.message}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleRead(msg.id, msg.read)}
                    aria-label={msg.read ? "Mark as unread" : "Mark as read"}
                  >
                    <CheckCircle2 className={`h-4 w-4 ${msg.read ? "text-muted-foreground" : "text-primary"}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMessage(msg.id)}
                    aria-label="Delete message"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
