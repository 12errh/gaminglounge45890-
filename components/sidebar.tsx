import { useState } from 'react'
import { motion } from 'framer-motion'
import { Hash, Gamepad2, Trophy, Headphones, Zap, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { OnlinePlayersList } from './online-players-list'

interface SidebarProps {
  currentChannel: string
  setCurrentChannel: (channel: string) => void
  setShowSidebar: (show: boolean) => void
  onlinePlayers: { username: string }[]
}

export function Sidebar({ currentChannel, setCurrentChannel, setShowSidebar, onlinePlayers }: SidebarProps) {
  const channels = [
    { name: 'general', icon: Hash },
    { name: 'pubg', icon: Gamepad2 },
    { name: 'fortnite', icon: Zap },
    { name: 'minecraft', icon: Gamepad2 },
    { name: 'amongus', icon: Gamepad2 },
  ]

  return (
    <div className="h-full bg-gradient-to-b from-purple-800 to-indigo-900 p-4 flex flex-col overflow-y-auto relative">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-2 right-2 lg:hidden"
        onClick={() => setShowSidebar(false)}
      >
        <X className="h-6 w-6" />
      </Button>
      <div className="mb-4 mt-8 lg:mt-0">
        <h2 className="text-xl mb-2 flex items-center text-purple-300"><Hash className="mr-2" /> Channels</h2>
        {channels.map((channel, index) => (
          <motion.div
            key={channel.name}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant={channel.name === currentChannel ? "secondary" : "ghost"}
              className="w-full justify-start mb-1 text-purple-100 hover:text-white hover:bg-purple-700"
              onClick={() => {
                setCurrentChannel(channel.name)
                setShowSidebar(false)
              }}
            >
              <channel.icon className="mr-2 h-4 w-4" />
              {channel.name}
            </Button>
          </motion.div>
        ))}
      </div>
      <OnlinePlayersList players={onlinePlayers} />
      <motion.div 
        className="mt-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button variant="outline" className="w-full mb-2 bg-purple-700 text-white hover:bg-purple-600">
          <Trophy className="mr-2" /> Leaderboard
        </Button>
        <Button variant="outline" className="w-full bg-purple-700 text-white hover:bg-purple-600">
          <Headphones className="mr-2" /> Voice Chat
        </Button>
      </motion.div>
    </div>
  )
}

