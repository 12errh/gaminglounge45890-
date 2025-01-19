'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './components/sidebar'
import { ChatArea } from './components/chat-area'
import { GameIntegration } from './components/game-integration'
import { Header } from './components/header'
import { ThemeProvider } from './components/theme-provider'
import { GameLauncher } from './components/game-launcher'
import { UserProfile } from './components/user-profile'
import { NotificationCenter } from './components/notification-center'

export default function R1ChatRoom() {
  const [currentChannel, setCurrentChannel] = useState('general')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  return (
    <ThemeProvider defaultTheme={isDarkMode ? 'dark' : 'light'}>
      <div className="flex flex-col h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        <Header 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          setShowProfile={setShowProfile}
          setShowNotifications={setShowNotifications}
        />
        <motion.div 
          className="flex flex-grow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Sidebar currentChannel={currentChannel} setCurrentChannel={setCurrentChannel} />
          <div className="flex flex-col flex-grow">
            <ChatArea channel={currentChannel} />
            <GameIntegration />
          </div>
          <GameLauncher />
        </motion.div>
        <AnimatePresence>
          {showProfile && (
            <UserProfile setShowProfile={setShowProfile} />
          )}
          {showNotifications && (
            <NotificationCenter setShowNotifications={setShowNotifications} />
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  )
}

