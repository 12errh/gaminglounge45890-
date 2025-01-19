'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './sidebar'
import { ChatArea } from './chat-area'
import { GameIntegration } from './game-integration'
import { Header } from './header'
import { GameLauncher } from './game-launcher'
import { UserProfile } from './user-profile'
import { NotificationCenter } from './notification-center'
import { VoiceCall } from './voice-call'
import { AIChat } from './ai-chat'
import { subscribeToOnlinePlayers } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function R1ChatRoom() {
  const [currentChannel, setCurrentChannel] = useState('general')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)
  const [onlinePlayers, setOnlinePlayers] = useState<{ username: string }[]>([])
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      }
    }
    checkUser()
  }, [router])

  useEffect(() => {
    const unsubscribe = subscribeToOnlinePlayers((players) => {
      setOnlinePlayers(players);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      <Header 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        setShowProfile={setShowProfile}
        setShowNotifications={setShowNotifications}
        setShowSidebar={setShowSidebar}
        setShowAIChat={setShowAIChat}
      />
      <div className="flex flex-grow overflow-hidden">
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:relative lg:block"
            >
              <Sidebar 
                currentChannel={currentChannel} 
                setCurrentChannel={setCurrentChannel}
                setShowSidebar={setShowSidebar}
                onlinePlayers={onlinePlayers}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex-grow flex flex-col overflow-hidden">
          {showAIChat ? (
            <AIChat />
          ) : (
            <>
              <ChatArea channel={currentChannel} />
              <GameIntegration />
              <div className="p-4 bg-purple-800">
                <VoiceCall channel={currentChannel} />
              </div>
            </>
          )}
        </div>
      </div>
      <GameLauncher />
      <AnimatePresence>
        {showProfile && (
          <UserProfile setShowProfile={setShowProfile} />
        )}
        {showNotifications && (
          <NotificationCenter setShowNotifications={setShowNotifications} />
        )}
      </AnimatePresence>
    </div>
  )
}

