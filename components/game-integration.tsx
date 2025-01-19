import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, BarChart2, Users, RefreshCw } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function GameIntegration() {
  const [currentGame, setCurrentGame] = useState('PUBG')
  const [playerCount, setPlayerCount] = useState(42)
  const [winRate, setWinRate] = useState(65)

  const toggleGame = () => {
    setCurrentGame(currentGame === 'PUBG' ? 'Free Fire' : 'PUBG')
    // Simulating different player counts and win rates for each game
    setPlayerCount(currentGame === 'PUBG' ? 38 : 42)
    setWinRate(currentGame === 'PUBG' ? 70 : 65)
  }

  return (
    <motion.div 
      className="bg-gradient-to-r from-indigo-900 to-purple-900 p-4 flex flex-col lg:flex-row justify-between items-center"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex flex-col lg:flex-row items-center mb-4 lg:mb-0">
        <div className="flex items-center mb-2 lg:mb-0 lg:mr-4">
          <Gamepad2 className="mr-2 text-purple-300" />
          <span className="font-bold mr-2 text-purple-300">Current Game: {currentGame}</span>
        </div>
        <div className="flex items-center">
          <Users className="mr-1 text-purple-300" />
          <span className="mr-4 text-purple-300">{playerCount} online</span>
          <BarChart2 className="mr-1 text-purple-300" />
          <span className="text-purple-300">Win Rate: {winRate}%</span>
        </div>
      </div>
      <div className="flex items-center">
        <Progress value={winRate} className="w-32 mr-4 bg-purple-700" />
        <Button variant="outline" className="bg-purple-700 text-white hover:bg-purple-600 mr-2">
          Share Stats
        </Button>
        <Button variant="outline" className="bg-purple-700 text-white hover:bg-purple-600" onClick={toggleGame}>
          <RefreshCw className="mr-2 h-4 w-4" /> Switch
        </Button>
      </div>
    </motion.div>
  )
}

