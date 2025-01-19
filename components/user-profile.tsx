import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Trophy, Star, Clock, Edit2, Save } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { supabase } from '@/lib/supabase'

interface UserProfileProps {
  setShowProfile: (show: boolean) => void
}

export function UserProfile({ setShowProfile }: UserProfileProps) {
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [nickname, setNickname] = useState('')
  const [favoriteGame, setFavoriteGame] = useState('')
  const [gamingExperience, setGamingExperience] = useState('')

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      setNickname(user.user_metadata.nickname || '')
      setFavoriteGame(user.user_metadata.favorite_game || '')
      setGamingExperience(user.user_metadata.gaming_experience || '')
    }
  }

  const handleSave = async () => {
    const { data, error } = await supabase.auth.updateUser({
      data: { nickname, favorite_game: favoriteGame, gaming_experience: gamingExperience }
    })

    if (error) {
      console.error('Error updating user:', error)
    } else {
      setUser(data.user)
      setIsEditing(false)
    }
  }

  if (!user) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-purple-900 rounded-lg shadow-lg w-full max-w-md"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <Card className="bg-purple-800 border-purple-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold text-purple-100">User Profile</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowProfile(false)}>
              <X className="h-4 w-4 text-purple-100" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="border w-20 h-20">
                <AvatarImage src={`https://api.dicebear.com/6.x/pixel-art/svg?seed=${user.id}`} />
                <AvatarFallback>{nickname.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                {isEditing ? (
                  <Input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="mb-2 bg-purple-700 text-white"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-purple-100">{nickname}</h2>
                )}
                <p className="text-purple-300">{user.email}</p>
              </div>
            </div>
            <div className="grid gap-4 mb-4">
              <div>
                <p className="text-sm font-semibold text-purple-300 mb-1">Favorite Game</p>
                {isEditing ? (
                  <Input
                    value={favoriteGame}
                    onChange={(e) => setFavoriteGame(e.target.value)}
                    className="bg-purple-700 text-white"
                  />
                ) : (
                  <p className="text-purple-100">{favoriteGame}</p>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-purple-300 mb-1">Gaming Experience</p>
                {isEditing ? (
                  <Input
                    value={gamingExperience}
                    onChange={(e) => setGamingExperience(e.target.value)}
                    className="bg-purple-700 text-white"
                  />
                ) : (
                  <p className="text-purple-100">{gamingExperience}</p>
                )}
              </div>
            </div>
            {isEditing ? (
              <Button onClick={handleSave} className="w-full bg-purple-600 hover:bg-purple-500">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="w-full bg-purple-600 hover:bg-purple-500">
                <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

