import { motion } from 'framer-motion'
import { X, Bell } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface NotificationCenterProps {
  setShowNotifications: (show: boolean) => void
}

export function NotificationCenter({ setShowNotifications }: NotificationCenterProps) {
  const notifications = [
    { id: 1, title: 'New Friend Request', description: 'AHMAD wants to be your friend', time: '5 minutes ago' },
    { id: 2, title: 'Game Invite', description: 'HAIDER invited you to play PUBG', time: '10 minutes ago' },
    { id: 3, title: 'Achievement Unlocked', description: 'You\'ve reached level 50!', time: '1 hour ago' },
    { id: 4, title: 'New Message', description: 'You have a new message from HASSAN', time: '2 hours ago' },
    { id: 5, title: 'Tournament Starting', description: 'The weekly tournament starts in 30 minutes', time: '25 minutes ago' },
  ]

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
            <CardTitle className="text-2xl font-bold text-purple-100 flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
              <X className="h-4 w-4 text-purple-100" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              {notifications.map((notification) => (
                <Card key={notification.id} className="mb-4 bg-purple-700 border-purple-600">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-semibold text-purple-100">{notification.title}</CardTitle>
                    <CardDescription className="text-xs text-purple-300">{notification.time}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-purple-200">{notification.description}</p>
                  </CardContent>
                </Card>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

