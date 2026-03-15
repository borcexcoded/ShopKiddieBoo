"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Send } from "lucide-react"

export function ContactForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string

    const supabase = createClient()
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
    })

    if (error) {
      toast.error("Something went wrong. Please try again.")
    } else {
      toast.success("Message sent! We'll get back to you soon.")
      form.reset()
    }

    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-6"
    >
      <h2 className="mb-4 text-lg font-bold text-foreground">Send a Message</h2>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required placeholder="Your name" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="your@email.com" className="mt-1.5" />
          </div>
        </div>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" required placeholder="What is this about?" className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            required
            placeholder="Tell us more..."
            rows={5}
            className="mt-1.5"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          <Send className="mr-2 h-4 w-4" />
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  )
}
