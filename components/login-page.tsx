"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Gamepad2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"

export function LoginPage() {
  const [key, setKey] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const { data, error } = await supabase.rpc("login", { p_auth_key: key })

      if (error) throw error

      if (data.error) {
        setError(data.error)
      } else {
        localStorage.setItem("user", JSON.stringify(data))
        router.push("/chat")
      }
    } catch (error: any) {
      console.error("Error during login:", error)
      setError("An error occurred during login. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-[350px] bg-purple-800 border-purple-600">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center">
              <Gamepad2 className="mr-2 h-6 w-6" />
              R1 Gaming Lounge
            </CardTitle>
            <CardDescription className="text-center text-purple-300">Login to your account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Authentication Key"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="bg-purple-700 border-purple-600 text-white placeholder-purple-400"
                  required
                />
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white">
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              className="text-purple-300 hover:text-purple-200"
              onClick={() => router.push("/signup")}
            >
              Don't have an account? Sign up
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

