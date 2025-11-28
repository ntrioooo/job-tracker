"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { JobApplication } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2, ExternalLink, Trash2, Plus, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function JobDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()
  const [job, setJob] = useState<JobApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<JobApplication>>({})
  const [newStage, setNewStage] = useState({ stage: "", date: "", notes: "" })
  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchJob = async () => {
      if (!params.id || typeof params.id !== "string") return

      try {
        const jobDoc = await getDoc(doc(db, "jobApplications", params.id))
        if (jobDoc.exists()) {
          const jobData = {
            id: jobDoc.id,
            ...jobDoc.data(),
            createdAt: jobDoc.data().createdAt?.toDate() || new Date(),
          } as JobApplication
          setJob(jobData)
          setFormData(jobData)
        }
      } catch (error) {
        console.error("Error fetching job:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [params.id])

  const handleUpdate = async () => {
    if (!params.id || typeof params.id !== "string") return

    setLoading(true)
    try {
      await updateDoc(doc(db, "jobApplications", params.id), formData)
      setJob({ ...job!, ...formData })
      setEditing(false)
    } catch (error) {
      console.error("Error updating job:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!params.id || typeof params.id !== "string") return
    if (!confirm("Yakin ingin menghapus lamaran ini?")) return

    try {
      await deleteDoc(doc(db, "jobApplications", params.id))
      router.push("/dashboard")
    } catch (error) {
      console.error("Error deleting job:", error)
    }
  }

  const addInterviewStage = () => {
    if (newStage.stage && newStage.date) {
      const stages = formData.interviewStages || []
      setFormData({ ...formData, interviewStages: [...stages, newStage] })
      setNewStage({ stage: "", date: "", notes: "" })
    }
  }

  const removeInterviewStage = (index: number) => {
    const stages = formData.interviewStages || []
    setFormData({ ...formData, interviewStages: stages.filter((_, i) => i !== index) })
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] })
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter((t) => t !== tag) })
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="font-bold">Lamaran tidak ditemukan</p>
      </div>
    )
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-4 border-border bg-primary neo-shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="gap-2 text-primary-foreground hover:bg-primary-foreground/10 font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <div className="flex gap-2">
            {!editing ? (
              <>
                <Button
                  onClick={() => setEditing(true)}
                  className="border-2 border-border neo-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-bold"
                >
                  Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="border-2 border-border neo-shadow bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-bold"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="border-2 border-border neo-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-bold"
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </Button>
                <Button
                  onClick={() => {
                    setEditing(false)
                    setFormData(job)
                  }}
                  variant="outline"
                  className="border-2 border-border neo-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-bold"
                >
                  Batal
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Card className="border-4 border-border neo-shadow-lg bg-card">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="font-bold">Posisi</Label>
                      <Input
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="border-4 border-border neo-shadow-sm font-medium text-xl"
                      />
                    </div>
                    <div>
                      <Label className="font-bold">Perusahaan</Label>
                      <Input
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="border-4 border-border neo-shadow-sm font-medium text-lg"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-3xl font-black">{job.position}</CardTitle>
                    <p className="text-xl font-bold text-muted-foreground mt-2">{job.companyName}</p>
                  </>
                )}
              </div>
              {editing ? (
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="w-[180px] border-4 border-border neo-shadow-sm font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-4 border-border">
                    <SelectItem value="wishlist">Wishlist</SelectItem>
                    <SelectItem value="applied">Dilamar</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="offered">Ditawari</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={statusConfig[job.status].color + " font-black text-lg px-4 py-2"}>
                  {statusConfig[job.status].label}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-bold text-muted-foreground">Tanggal Lamar</Label>
                {editing ? (
                  <Input
                    type="date"
                    value={formData.appliedDate}
                    onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                    className="border-4 border-border neo-shadow-sm font-medium"
                  />
                ) : (
                  <p className="font-bold text-lg">{new Date(job.appliedDate).toLocaleDateString("id-ID")}</p>
                )}
              </div>
              <div>
                <Label className="font-bold text-muted-foreground">Tipe Pekerjaan</Label>
                {editing ? (
                  <Select
                    value={formData.jobType}
                    onValueChange={(value: any) => setFormData({ ...formData, jobType: value })}
                  >
                    <SelectTrigger className="border-4 border-border neo-shadow-sm font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-4 border-border">
                      <SelectItem value="remote">🏠 Remote</SelectItem>
                      <SelectItem value="hybrid">🔄 Hybrid</SelectItem>
                      <SelectItem value="onsite">🏢 WFO</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="font-bold text-lg">
                    {job.jobType && `${jobTypeConfig[job.jobType].icon} ${jobTypeConfig[job.jobType].label}`}
                  </p>
                )}
              </div>
              {(editing || job.location) && (
                <div>
                  <Label className="font-bold text-muted-foreground">Lokasi</Label>
                  {editing ? (
                    <Input
                      value={formData.location || ""}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="border-4 border-border neo-shadow-sm font-medium"
                    />
                  ) : (
                    <p className="font-bold text-lg">{job.location}</p>
                  )}
                </div>
              )}
              {(editing || job.salary) && (
                <div>
                  <Label className="font-bold text-muted-foreground">Gaji</Label>
                  {editing ? (
                    <Input
                      value={formData.salary || ""}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="border-4 border-border neo-shadow-sm font-medium"
                    />
                  ) : (
                    <p className="font-bold text-lg text-green-600">{job.salary}</p>
                  )}
                </div>
              )}
            </div>

            {(editing || job.jobUrl) && (
              <div>
                <Label className="font-bold text-muted-foreground">Link Posting</Label>
                {editing ? (
                  <Input
                    type="url"
                    value={formData.jobUrl || ""}
                    onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                    className="border-4 border-border neo-shadow-sm font-medium"
                  />
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => window.open(job.jobUrl, "_blank")}
                    className="gap-2 border-2 border-border neo-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-bold"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Buka Link
                  </Button>
                )}
              </div>
            )}

            {(editing || (job.tags && job.tags.length > 0)) && (
              <div>
                <Label className="font-bold text-muted-foreground">Tags</Label>
                {editing ? (
                  <>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        placeholder="Tambah tag"
                        className="border-4 border-border neo-shadow-sm font-medium"
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        variant="outline"
                        className="border-2 border-border neo-shadow-sm font-bold bg-transparent"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer border-2 border-border font-bold"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {job.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="border-2 border-border font-bold">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {(editing || job.notes) && (
              <div>
                <Label className="font-bold text-muted-foreground">Catatan</Label>
                {editing ? (
                  <Textarea
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="min-h-32 border-4 border-border neo-shadow-sm font-medium"
                  />
                ) : (
                  <div className="bg-muted/50 p-4 rounded-lg border-4 border-border neo-shadow-sm">
                    <p className="font-medium whitespace-pre-wrap">{job.notes}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-4 border-border neo-shadow-lg bg-card">
          <CardHeader>
            <CardTitle className="font-black">Timeline Interview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {editing && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border-4 border-border">
                <Input
                  placeholder="Stage (e.g., HR Interview)"
                  value={newStage.stage}
                  onChange={(e) => setNewStage({ ...newStage, stage: e.target.value })}
                  className="border-4 border-border neo-shadow-sm font-medium"
                />
                <Input
                  type="date"
                  value={newStage.date}
                  onChange={(e) => setNewStage({ ...newStage, date: e.target.value })}
                  className="border-4 border-border neo-shadow-sm font-medium"
                />
                <Button onClick={addInterviewStage} className="border-2 border-border neo-shadow-sm font-bold">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Stage
                </Button>
              </div>
            )}

            {formData.interviewStages && formData.interviewStages.length > 0 ? (
              <div className="space-y-3">
                {formData.interviewStages.map((stage, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 border-4 border-border neo-shadow-sm rounded-lg bg-background"
                  >
                    <div className="w-3 h-3 rounded-full bg-primary mt-1.5 border-2 border-border flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-black">{stage.stage}</h4>
                      <p className="text-sm font-medium text-muted-foreground">
                        {new Date(stage.date).toLocaleDateString("id-ID")}
                      </p>
                      {stage.notes && <p className="text-sm font-medium mt-1">{stage.notes}</p>}
                    </div>
                    {editing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInterviewStage(index)}
                        className="border-2 border-border"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8 font-medium">Belum ada timeline interview</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
