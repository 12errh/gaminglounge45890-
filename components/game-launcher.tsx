import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gamepad2, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const games = [
  { id: 'pubg', name: 'PUBG', icon: '🔫' },
  { id: 'fortnite', name: 'Fortnite', icon: '🏗️' },
  { id: 'minecraft', name: 'Minecraft', icon: '⛏️' },
  { id: 'amongus', name: 'Among Us', icon: '🚀' },
]

export function GameLauncher() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Button
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full bg-purple-600 text-white hover:bg-purple-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Gamepad2 className="h-6 w-6" />
        </Button>
      </motion.div>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-sm mx-4"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
          >
            <Card className="bg-purple-800 border-purple-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-100">Quick Launch</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4 text-purple-100" />
                </Button>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                {games.map((game) => (
                  <Button
                    key={game.id}
                    variant="outline"
                    className="w-full justify-start text-purple-100 hover:bg-purple-700"
                    onClick={() => console.log(`Launching ${game.name}`)}
                  >
                    <span className="mr-2">{game.icon}</span>
                    {game.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

