import { Moon, Sun, User, Bell, Menu, Bot } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

interface HeaderProps {
  isDarkMode: boolean
  setIsDarkMode: (isDark: boolean) => void
  setShowProfile: (show: boolean) => void
  setShowNotifications: (show: boolean) => void
  setShowSidebar: (show: boolean) => void
  setShowAIChat: (show: boolean) => void
}

export function Header({ isDarkMode, setIsDarkMode, setShowProfile, setShowNotifications, setShowSidebar, setShowAIChat }: HeaderProps) {
  return (
    <motion.header 
      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex justify-between items-center"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2 lg:hidden"
          onClick={() => setShowSidebar(prev => !prev)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <motion.h1 
          className="text-xl lg:text-3xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          R1 Gaming Lounge
        </motion.h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowAIChat(prev => !prev)}
          className="bg-transparent text-white hover:bg-white hover:text-purple-600"
        >
          <Bot className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowNotifications(true)}
          className="bg-transparent text-white hover:bg-white hover:text-purple-600"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowProfile(true)}
          className="bg-transparent text-white hover:bg-white hover:text-purple-600"
        >
          <User className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="bg-transparent text-white hover:bg-white hover:text-purple-600"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </motion.header>
  )
}

