"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Briefcase } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push("/dashboard")
    } catch (err) {
      setError((err as Error).message || "Gagal masuk dengan Google")
      setLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (err) {
      setError((err as Error).message || "Gagal masuk")
      setLoading(false)
    }
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (err) {
      setError((err as Error).message || "Gagal membuat akun")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-yellow-400 px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-400 border-4 border-black rounded-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4">
            <Briefcase className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black mb-2">Job Tracker</h1>
          <p className="text-lg font-bold">Kelola Lamaran Kerja Kamu!</p>
        </div>

        <div className="bg-white border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-400 border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-start gap-2">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-200 border-4 border-black p-1 rounded-lg mb-6">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-cyan-400 data-[state=active]:border-4 data-[state=active]:border-black data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-md"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-pink-400 data-[state=active]:border-4 data-[state=active]:border-black data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold rounded-md"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="font-bold text-base">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="font-bold text-base">
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyan-400 hover:bg-cyan-500 text-black border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all font-bold text-base h-12"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="font-bold text-base">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="font-bold text-base">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Buat password (min. 6 karakter)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pink-400 hover:bg-pink-500 text-black border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all font-bold text-base h-12"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buat Akun"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-4 border-black border-dashed" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white font-bold text-sm">Atau lanjutkan dengan</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 text-black border-4 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all font-bold text-base h-12 gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
