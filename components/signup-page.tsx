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

export function SignupPage() {
  const [nickname, setNickname] = useState("")
  const [email, setEmail] = useState("")
  const [favoriteGame, setFavoriteGame] = useState("")
  const [gamingExperience, setGamingExperience] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [key, setKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            nickname,
            email,
            favorite_game: favoriteGame,
            gaming_experience: gamingExperience,
          },
        ])
        .select()

      if (error) {
        console.error("Supabase error:", error)
        throw new Error(error.message || "An error occurred during signup")
      }

      if (!data || data.length === 0) {
        throw new Error("No data returned from signup")
      }

      setKey(data[0].auth_key)

      // Send email with auth key
      const emailResponse = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: "Your R1 Gaming Lounge Authentication Key",
          text: `Your authentication key is: ${data[0].auth_key}`,
        }),
      })

      if (!emailResponse.ok) {
        throw new Error("Failed to send email")
      }
    } catch (error: any) {
      console.error("Error during signup:", error)
      setError(error.message || "An unexpected error occurred during signup. Please try again.")
    } finally {
      setIsLoading(false)
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
            <CardDescription className="text-center text-purple-300">
              {key ? "Your Authentication Key" : "Create a new account"}
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
                <p className="text-white mb-4">
                  Your authentication key has been sent to your email. Please check your inbox!
                </p>
                <Button
                  onClick={() => router.push("/login")}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white"
                >
                  Go to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSignup}>
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
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  <Input
                    type="text"
                    placeholder="Gaming Experience (e.g., Beginner, Intermediate, Pro)"
                    value={gamingExperience}
                    onChange={(e) => setGamingExperience(e.target.value)}
                    className="bg-purple-700 border-purple-600 text-white placeholder-purple-400"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing Up..." : "Sign Up"}
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
              Already have an account? Login
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

