'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from '@/lib/supabase'
import { GameInfoForm } from './game-info-form'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [favoriteGame, setFavoriteGame] = useState('')
  const [gamingExperience, setGamingExperience] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showGameInfoForm, setShowGameInfoForm] = useState(false)
  const [data, setData] = useState<{ user: { id: string } } | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      setData(data)
      setShowGameInfoForm(true)
    } catch (error: any) {
      console.error('Error during login:', error)
      if (error.message === 'Invalid login credentials') {
        setError('Invalid email or password. Please try again.')
      } else if (error.message === 'Email not confirmed') {
        setError('Please confirm your email address before logging in.')
      } else {
        setError('An error occurred during login. Please try again.')
      }
    }
  }

  const resendConfirmationEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })
      if (error) throw error
      setError('Confirmation email resent. Please check your inbox.')
    } catch (error: any) {
      console.error('Error resending confirmation email:', error)
      setError('Failed to resend confirmation email. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {showGameInfoForm && data?.user?.id ? (
          <GameInfoForm userId={data.user.id} />
        ) : (
          <Card className="w-[350px] bg-purple-800 border-purple-600">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center">
                <Gamepad2 className="mr-2 h-6 w-6" />
                R1 Gaming Lounge
              </CardTitle>
              <CardDescription className="text-center text-purple-300">
                Login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription>{error}</AlertDescription>
                  {error === 'Please confirm your email address before logging in.' && (
                    <Button
                      onClick={resendConfirmationEmail}
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full bg-purple-700 text-white hover:bg-purple-600"
                    >
                      Resend Confirmation Email
                    </Button>
                  )}
                </Alert>
              )}
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-purple-700 border-purple-600 text-white placeholder-purple-400"
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-purple-700 border-purple-600 text-white placeholder-purple-400"
                    required
                  />
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
                  <Input
                    type="text"
                    placeholder="Gaming Experience (e.g., Beginner, Intermediate, Pro)"
                    value={gamingExperience}
                    onChange={(e) => setGamingExperience(e.target.value)}
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
              <Button variant="link" className="text-purple-300 hover:text-purple-200" onClick={() => router.push('/signup')}>
                Don't have an account? Sign up
              </Button>
            </CardFooter>
          </Card>
        )}
      </motion.div>
    </div>
  )
}

