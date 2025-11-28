"use client"

import type React from "react"

import { useState } from "react"
import type { JobApplication } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Briefcase, GripVertical } from "lucide-react"
import { useRouter } from "next/navigation"

interface KanbanBoardProps {
  jobs: JobApplication[]
  onUpdate: (jobId: string, data: Partial<JobApplication>) => void
  onDelete: (jobId: string) => void
}

const columns = [
  { id: "wishlist", label: "Wishlist", color: "bg-[oklch(0.75_0.15_195)]" },
  { id: "applied", label: "Dilamar", color: "bg-[oklch(0.7_0.24_55)]" },
  { id: "interview", label: "Interview", color: "bg-[oklch(0.85_0.15_95)]" },
  { id: "offered", label: "Ditawari", color: "bg-[oklch(0.65_0.22_145)]" },
  { id: "rejected", label: "Ditolak", color: "bg-[oklch(0.55_0.27_25)]" },
]

const jobTypeConfig = {
  remote: { label: "Remote", icon: "🏠" },
  hybrid: { label: "Hybrid", icon: "🔄" },
  onsite: { label: "WFO", icon: "🏢" },
}

export default function KanbanBoard({ jobs, onUpdate }: KanbanBoardProps) {
  const router = useRouter()
  const [draggedJob, setDraggedJob] = useState<JobApplication | null>(null)

  const handleDragStart = (job: JobApplication) => {
    setDraggedJob(job)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (status: JobApplication["status"]) => {
    if (draggedJob && draggedJob.status !== status) {
      onUpdate(draggedJob.id, { status })
    }
    setDraggedJob(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {columns.map((column) => {
        const columnJobs = jobs.filter((job) => job.status === column.id)
        return (
          <div
            key={column.id}
            className="space-y-3"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id as JobApplication["status"])}
          >
            <div className={`${column.color} border-4 border-border neo-shadow-sm p-3 rounded-lg`}>
              <h3 className="font-black text-lg text-black">{column.label}</h3>
              <p className="text-sm font-bold text-black/70">{columnJobs.length} lamaran</p>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {columnJobs.map((job) => (
                <Card
                  key={job.id}
                  draggable
                  onDragStart={() => handleDragStart(job)}
                  onClick={() => router.push(`/dashboard/job/${job.id}`)}
                  className="border-4 border-border neo-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-move bg-card"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-2">
                      <GripVertical className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-black text-sm leading-tight">{job.position}</h4>
                        <p className="text-xs font-bold text-muted-foreground mt-1">{job.companyName}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {job.location && (
                      <Badge variant="outline" className="text-xs border-2 border-border font-bold">
                        <MapPin className="w-3 h-3 mr-1" />
                        {job.location}
                      </Badge>
                    )}
                    {job.jobType && (
                      <Badge variant="outline" className="text-xs border-2 border-border font-bold">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {jobTypeConfig[job.jobType].icon} {jobTypeConfig[job.jobType].label}
                      </Badge>
                    )}
                    <p className="text-xs text-muted-foreground font-medium">
                      {new Date(job.appliedDate).toLocaleDateString("id-ID")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
