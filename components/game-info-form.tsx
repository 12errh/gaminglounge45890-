'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from '@/lib/supabase'

interface GameInfoFormProps {
  userId: string
}

export function GameInfoForm({ userId }: GameInfoFormProps) {
  const [gameName, setGameName] = useState('')
  const [gameId, setGameId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    console.log('GameInfoForm mounted with userId:', userId)
  }, [userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (!userId) {
        throw new Error('User ID is missing')
      }

      console.log('Attempting to update game info for user:', userId)

      const { data, error } = await supabase
        .from('user_game_info')
        .upsert({ 
          user_id: userId, 
          game_name: gameName, 
          game_id: gameId 
        }, { 
          onConflict: 'user_id',
          returning: 'minimal'
        })

      if (error) {
        console.error('Supabase error:', JSON.stringify(error, null, 2))
        throw new Error(error.message || 'Failed to update game information')
      }

      console.log('Game info updated successfully')
      router.push('/chat')
    } catch (error: any) {
      console.error('Error updating game info:', JSON.stringify(error, null, 2))
      setError(error.message || 'Failed to update game information. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[350px] bg-purple-800 border-purple-600">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-white">
          Game Information
        </CardTitle>
        <CardDescription className="text-center text-purple-300">
          Please provide your game details
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {error}
              {process.env.NODE_ENV === 'development' && (
                <details>
                  <summary>Debug Info</summary>
                  <pre>{JSON.stringify({ userId, gameName, gameId }, null, 2)}</pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Game Name"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="bg-purple-700 border-purple-600 text-white placeholder-purple-400"
              required
            />
            <Input
              type="text"
              placeholder="Game ID"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="bg-purple-700 border-purple-600 text-white placeholder-purple-400"
              required
            />
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-500 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

