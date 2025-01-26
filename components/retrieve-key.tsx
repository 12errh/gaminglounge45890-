"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Gamepad2, Key } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { initializeSupabase } from "@/lib/supabase"

export function RetrieveKey() {
  const [nickname, setNickname] = useState("")
  const [favoriteGame, setFavoriteGame] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [key, setKey] = useState<string | null>(null)
  const router = useRouter()

  const handleRetrieveKey = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await initializeSupabase()
      const { data, error } = await supabase
        .from("users")
        .select("auth_key")
        .eq("nickname", nickname)
        .eq("favorite_game", favoriteGame)
        .single()

      if (error) throw error

      if (data) {
        setKey(data.auth_key)
      } else {
        setError("No matching user found. Please check your information and try again.")
      }
    } catch (error: any) {
      console.error("Error retrieving key:", error)
      setError("An error occurred while retrieving your key. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-[350px] bg-purple-800 border-purple-600">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center">
              <Key className="mr-2 h-6 w-6" />
              Retrieve Your Key
            </CardTitle>
            <CardDescription className="text-center text-purple-300">
              Enter your information to get your authentication key
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {key ? (
              <div className="text-center">
                <p className="text-white mb-4">Here's your authentication key:</p>
                <p className="text-xl font-bold text-purple-300 mb-4">{key}</p>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white"
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleRetrieveKey}>
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="bg-purple-700 border-purple-600 text-white placeholder-purple-400"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Favorite Game"
                    value={favoriteGame}
                    onChange={(e) => setFavoriteGame(e.target.value)}
                    className="bg-purple-700 border-purple-600 text-white placeholder-purple-400"
                    required
                  />
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white">
                    Retrieve Key
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              className="text-purple-300 hover:text-purple-200"
              onClick={() => router.push("/login")}
            >
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

