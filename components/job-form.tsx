"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { JobApplication } from "@/components/dashboard-layout"

interface JobFormProps {
  onSubmit: (data: Omit<JobApplication, "id" | "userId" | "createdAt">) => Promise<void>
  initialData?: JobApplication
}

export default function JobForm({ onSubmit, initialData }: JobFormProps) {
  const [formData, setFormData] = useState({
    companyName: initialData?.companyName || "",
    position: initialData?.position || "",
    status: initialData?.status || ("applied" as const),
    appliedDate: initialData?.appliedDate || new Date().toISOString().split("T")[0],
    notes: initialData?.notes || "",
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      if (!initialData) {
        setFormData({
          companyName: "",
          position: "",
          status: "applied",
          appliedDate: new Date().toISOString().split("T")[0],
          notes: "",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company"
            placeholder="e.g., Google, Microsoft"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            placeholder="e.g., Software Engineer"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="offered">Offered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Applied Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.appliedDate}
            onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Add any notes about the position, company, or application..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="min-h-24"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : initialData ? "Update Application" : "Add Application"}
      </Button>
    </form>
  )
}
