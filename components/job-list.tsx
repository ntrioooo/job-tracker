"use client"

import type { JobApplication } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, ExternalLink, MapPin, Briefcase, Search } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface JobListProps {
  jobs: JobApplication[]
  onUpdate: (jobId: string, data: Partial<JobApplication>) => void
  onDelete: (jobId: string) => void
  loading: boolean
}

const statusConfig = {
  wishlist: { label: "Wishlist", color: "bg-[oklch(0.75_0.15_195)] text-black border-2 border-black" },
  applied: { label: "Dilamar", color: "bg-[oklch(0.7_0.24_55)] text-black border-2 border-black" },
  interview: { label: "Interview", color: "bg-[oklch(0.85_0.15_95)] text-black border-2 border-black" },
  offered: { label: "Ditawari", color: "bg-[oklch(0.65_0.22_145)] text-black border-2 border-black" },
  rejected: { label: "Ditolak", color: "bg-[oklch(0.55_0.27_25)] text-white border-2 border-black" },
}

const jobTypeConfig = {
  remote: { label: "Remote", icon: "🏠" },
  hybrid: { label: "Hybrid", icon: "🔄" },
  onsite: { label: "WFO", icon: "🏢" },
}

export default function JobList({ jobs, onUpdate, onDelete, loading }: JobListProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("all")

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchTerm === "" ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.notes?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    const matchesJobType = jobTypeFilter === "all" || job.jobType === jobTypeFilter

    return matchesSearch && matchesStatus && matchesJobType
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Cari perusahaan, posisi, atau catatan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-4 border-border neo-shadow-sm font-medium"
          />
        </div>
        <div className="flex gap-4 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px] border-4 border-border neo-shadow-sm font-bold">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent className="border-4 border-border">
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="wishlist">Wishlist</SelectItem>
              <SelectItem value="applied">Dilamar</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offered">Ditawari</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
            </SelectContent>
          </Select>
          <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
            <SelectTrigger className="w-full sm:w-[200px] border-4 border-border neo-shadow-sm font-bold">
              <SelectValue placeholder="Filter Tipe" />
            </SelectTrigger>
            <SelectContent className="border-4 border-border">
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="onsite">WFO</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <Card className="border-4 border-border neo-shadow-lg bg-card">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4 font-medium">
              {jobs.length === 0
                ? "Belum ada lamaran. Mulai tracking lamaranmu!"
                : "Tidak ada lamaran yang sesuai filter."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="border-4 border-border neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer bg-card"
              onClick={() => router.push(`/dashboard/job/${job.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-foreground">{job.position}</h3>
                    <p className="text-base font-bold text-muted-foreground mt-1">{job.companyName}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.location && (
                        <Badge variant="outline" className="gap-1 border-2 border-border font-bold">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </Badge>
                      )}
                      {job.jobType && (
                        <Badge variant="outline" className="gap-1 border-2 border-border font-bold">
                          <Briefcase className="w-3 h-3" />
                          {jobTypeConfig[job.jobType].icon} {jobTypeConfig[job.jobType].label}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Badge className={statusConfig[job.status].color + " font-black"}>
                    {statusConfig[job.status].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Tanggal Lamar</span>
                  <span className="font-bold">{new Date(job.appliedDate).toLocaleDateString("id-ID")}</span>
                </div>

                {job.salary && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Gaji</span>
                    <span className="font-bold text-green-600">{job.salary}</span>
                  </div>
                )}

                {job.tags && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="border-2 border-border font-bold">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                  {job.jobUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(job.jobUrl, "_blank")}
                      className="gap-2 border-2 border-border neo-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-bold"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Link
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(job.id)}
                    className="gap-2 border-2 border-border neo-shadow-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-bold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
