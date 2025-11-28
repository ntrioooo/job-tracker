"use client"

import type { JobApplication } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Briefcase, TrendingUp, Award, XCircle } from "lucide-react"

interface AnalyticsProps {
  jobs: JobApplication[]
}

export default function Analytics({ jobs }: AnalyticsProps) {
  const stats = {
    total: jobs.length,
    wishlist: jobs.filter((j) => j.status === "wishlist").length,
    applied: jobs.filter((j) => j.status === "applied").length,
    interviews: jobs.filter((j) => j.status === "interview").length,
    offers: jobs.filter((j) => j.status === "offered").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
  }

  const interviewRate = stats.total > 0 ? ((stats.interviews / stats.total) * 100).toFixed(1) : "0"
  const offerRate = stats.total > 0 ? ((stats.offers / stats.total) * 100).toFixed(1) : "0"

  const statusData = [
    { name: "Wishlist", value: stats.wishlist, color: "oklch(0.75 0.15 195)" },
    { name: "Dilamar", value: stats.applied, color: "oklch(0.7 0.24 55)" },
    { name: "Interview", value: stats.interviews, color: "oklch(0.85 0.15 95)" },
    { name: "Ditawari", value: stats.offers, color: "oklch(0.65 0.22 145)" },
    { name: "Ditolak", value: stats.rejected, color: "oklch(0.55 0.27 25)" },
  ].filter((item) => item.value > 0)

  const monthlyData = jobs.reduce((acc: any, job) => {
    const month = new Date(job.appliedDate).toLocaleDateString("id-ID", { month: "short", year: "numeric" })
    const existing = acc.find((item: any) => item.month === month)
    if (existing) {
      existing.count++
    } else {
      acc.push({ month, count: 1 })
    }
    return acc
  }, [])

  const jobTypeData = [
    { type: "Remote", count: jobs.filter((j) => j.jobType === "remote").length },
    { type: "Hybrid", count: jobs.filter((j) => j.jobType === "hybrid").length },
    { type: "WFO", count: jobs.filter((j) => j.jobType === "onsite").length },
  ].filter((item) => item.count > 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-4 border-border neo-shadow bg-[oklch(0.7_0.24_55)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black text-black flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Total Lamaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-black">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-4 border-border neo-shadow bg-[oklch(0.85_0.15_95)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black text-black flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Interview Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-black">{interviewRate}%</div>
          </CardContent>
        </Card>

        <Card className="border-4 border-border neo-shadow bg-[oklch(0.65_0.22_145)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black text-black flex items-center gap-2">
              <Award className="w-5 h-5" />
              Offer Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-black">{offerRate}%</div>
          </CardContent>
        </Card>

        <Card className="border-4 border-border neo-shadow bg-[oklch(0.55_0.27_25)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black text-white flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              Ditolak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-white">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-4 border-border neo-shadow bg-card">
          <CardHeader>
            <CardTitle className="font-black">Status Lamaran</CardTitle>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="#000"
                    strokeWidth={2}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-12 font-medium">Belum ada data</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-4 border-border neo-shadow bg-card">
          <CardHeader>
            <CardTitle className="font-black">Lamaran per Bulan</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#000" opacity={0.1} />
                  <XAxis dataKey="month" stroke="#000" style={{ fontWeight: "bold" }} />
                  <YAxis stroke="#000" style={{ fontWeight: "bold" }} />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="oklch(0.45 0.25 275)"
                    stroke="#000"
                    strokeWidth={2}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted-foreground py-12 font-medium">Belum ada data</p>
            )}
          </CardContent>
        </Card>

        {jobTypeData.length > 0 && (
          <Card className="border-4 border-border neo-shadow bg-card">
            <CardHeader>
              <CardTitle className="font-black">Tipe Pekerjaan</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobTypeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#000" opacity={0.1} />
                  <XAxis type="number" stroke="#000" style={{ fontWeight: "bold" }} />
                  <YAxis dataKey="type" type="category" stroke="#000" style={{ fontWeight: "bold" }} />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="oklch(0.65 0.22 145)"
                    stroke="#000"
                    strokeWidth={2}
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
