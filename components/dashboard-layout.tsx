"use client"

import { useState, useEffect } from "react"
import type { User } from "firebase/auth"
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Plus, LayoutGrid, BarChart3 } from "lucide-react"
import JobList from "@/components/job-list"
import KanbanBoard from "@/components/kanban-board"
import Analytics from "@/components/analytics"
import { useRouter } from "next/navigation"

export interface JobApplication {
  id: string
  companyName: string
  position: string
  status: "wishlist" | "applied" | "interview" | "offered" | "rejected"
  appliedDate: string
  notes?: string
  userId: string
  createdAt: Date
  jobType?: "remote" | "hybrid" | "onsite"
  jobUrl?: string
  salary?: string
  location?: string
  tags?: string[]
  interviewStages?: { stage: string; date: string; notes?: string }[]
}

export default function DashboardLayout({ user }: { user: User }) {
  const router = useRouter()
  const { logout } = useAuth()
  const [jobs, setJobs] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const q = query(collection(db, "jobApplications"), where("userId", "==", user.uid))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData: JobApplication[] = []
      snapshot.forEach((doc) => {
        jobsData.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        } as JobApplication)
      })
      setJobs(jobsData.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()))
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const handleAddJob = async (jobData: Omit<JobApplication, "id" | "userId" | "createdAt">) => {
    try {
      await addDoc(collection(db, "jobApplications"), {
        ...jobData,
        userId: user.uid,
        createdAt: new Date(),
      })
    } catch (error) {
      console.error("Error adding job:", error)
    }
  }

  const handleUpdateJob = async (jobId: string, jobData: Partial<JobApplication>) => {
    try {
      await updateDoc(doc(db, "jobApplications", jobId), jobData)
    } catch (error) {
      console.error("Error updating job:", error)
    }
  }

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteDoc(doc(db, "jobApplications", jobId))
    } catch (error) {
      console.error("Error deleting job:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-4 border-border bg-primary neo-shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-primary-foreground">Job Tracker</h1>
            <p className="text-sm text-primary-foreground/80">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push("/dashboard/add")}
              className="gap-2 border-2 border-border neo-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-bold"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tambah</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2 border-2 border-border neo-shadow bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 border-4 border-border neo-shadow p-1 bg-card h-auto">
            <TabsTrigger
              value="list"
              className="gap-2 font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Daftar</span>
            </TabsTrigger>
            <TabsTrigger
              value="kanban"
              className="gap-2 font-bold data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="gap-2 font-bold data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Statistik</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <JobList jobs={jobs} onUpdate={handleUpdateJob} onDelete={handleDeleteJob} loading={loading} />
          </TabsContent>

          <TabsContent value="kanban">
            <KanbanBoard jobs={jobs} onUpdate={handleUpdateJob} onDelete={handleDeleteJob} />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics jobs={jobs} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
