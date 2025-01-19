'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export function AIChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <Card className="w-full h-full bg-purple-800 border-purple-600">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-purple-100">AI Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-250px)] pr-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start space-x-2 mb-4 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role !== 'user' && (
                <Avatar>
                  <AvatarImage src="/ai-avatar.png" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`p-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-700 text-purple-100'
                }`}
              >
                {message.content}
              </div>
              {message.role === 'user' && (
                <Avatar>
                  <AvatarImage src="/user-avatar.png" alt="User" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
        </ScrollArea>
        <form onSubmit={handleSubmit} className="mt-4 flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask the AI assistant..."
            className="flex-grow bg-purple-700 text-white placeholder-purple-300 border-purple-600"
          />
          <Button type="submit" className="bg-purple-600 hover:bg-purple-500">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

