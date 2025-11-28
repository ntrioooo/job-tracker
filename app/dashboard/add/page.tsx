"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function AddJobPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    status: "wishlist" as const,
    appliedDate: new Date().toISOString().split("T")[0],
    notes: "",
    jobType: "remote" as const,
    jobUrl: "",
    salary: "",
    location: "",
    tags: [] as string[],
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    console.log("[v0] Starting form submission")
    setLoading(true)
    try {
      console.log("[v0] Adding document to Firestore")
      await addDoc(collection(db, "jobApplications"), {
        ...formData,
        userId: user.uid,
        createdAt: new Date(),
      })
      console.log("[v0] Document added successfully")
      toast({
        title: "Berhasil!",
        description: "Lamaran berhasil ditambahkan",
      })
      console.log("[v0] Navigating to dashboard")
      router.push("/dashboard")
    } catch (error) {
      console.error("[v0] Error adding job:", error)
      toast({
        title: "Error",
        description: "Gagal menambahkan lamaran. Silakan coba lagi.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-4 border-border bg-primary neo-shadow-lg">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="gap-2 text-primary-foreground hover:bg-primary-foreground/10 font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-4 border-border neo-shadow-lg bg-card">
          <CardHeader>
            <CardTitle className="text-2xl font-black">Tambah Lamaran Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company" className="font-bold">
                    Nama Perusahaan *
                  </Label>
                  <Input
                    id="company"
                    placeholder="e.g., Google, Microsoft"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                    className="border-4 border-border neo-shadow-sm font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position" className="font-bold">
                    Posisi *
                  </Label>
                  <Input
                    id="position"
                    placeholder="e.g., Software Engineer"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                    className="border-4 border-border neo-shadow-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status" className="font-bold">
                    Status *
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status" className="border-4 border-border neo-shadow-sm font-bold">
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobType" className="font-bold">
                    Tipe Pekerjaan *
                  </Label>
                  <Select
                    value={formData.jobType}
                    onValueChange={(value: any) => setFormData({ ...formData, jobType: value })}
                  >
                    <SelectTrigger id="jobType" className="border-4 border-border neo-shadow-sm font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-4 border-border">
                      <SelectItem value="remote">🏠 Remote</SelectItem>
                      <SelectItem value="hybrid">🔄 Hybrid</SelectItem>
                      <SelectItem value="onsite">🏢 WFO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="font-bold">
                    Tanggal Lamar *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.appliedDate}
                    onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                    required
                    className="border-4 border-border neo-shadow-sm font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="font-bold">
                    Lokasi
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Jakarta, Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="border-4 border-border neo-shadow-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary" className="font-bold">
                    Gaji/Range
                  </Label>
                  <Input
                    id="salary"
                    placeholder="e.g., Rp 10-15 juta"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    className="border-4 border-border neo-shadow-sm font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobUrl" className="font-bold">
                    Link Posting
                  </Label>
                  <Input
                    id="jobUrl"
                    type="url"
                    placeholder="https://..."
                    value={formData.jobUrl}
                    onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                    className="border-4 border-border neo-shadow-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="font-bold">
                  Tags
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="e.g., Full-time, Intern, Startup"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="border-4 border-border neo-shadow-sm font-medium"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    className="border-2 border-border neo-shadow-sm font-bold bg-transparent"
                  >
                    Tambah
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
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
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="font-bold">
                  Catatan
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Tambahkan catatan tentang posisi, perusahaan, atau lamaran..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="min-h-32 border-4 border-border neo-shadow-sm font-medium"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full border-4 border-border neo-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-black text-lg h-12"
              >
                {loading ? "Menyimpan..." : "Simpan Lamaran"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
