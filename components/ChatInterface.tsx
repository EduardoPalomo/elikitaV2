'use client'

import React, { useState, KeyboardEvent, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Menu, PlusCircle, Settings, LogOut, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/utils/supabase/client'
import { v4 as uuidv4 } from 'uuid'

interface Message {
  role: 'user' | 'ai'
  content: string
}

interface ChatSession {
  session_id: string;
  created_at: string;
}

interface ChatInterfaceProps {
  userId: string
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userId }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState('')
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const supabase = createClient()

  useEffect(() => {
    fetchChatSessions()
  }, [])

  const fetchChatSessions = async () => {
    const { data, error } = await supabase
      .from('conversations')
      .select('session_id, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching chat sessions:', error)
    } else {
      // Group by session_id and take the most recent entry
      const uniqueSessions = data.reduce<Record<string, ChatSession>>((acc, current) => {
        if (!acc[current.session_id]) {
          acc[current.session_id] = current;
        }
        return acc;
      }, {});

      setChatSessions(Object.values(uniqueSessions) as ChatSession[])
    }
  }

  const startNewChat = () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setMessages([]);
  }

  const loadChatSession = async (sessionId: string) => {
    setSessionId(sessionId)
    const { data, error } = await supabase
      .from('conversations')
      .select('message, response')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error loading chat session:', error)
    } else {
      const loadedMessages: Message[] = data.flatMap(item => [
        { role: 'user', content: item.message },
        { role: 'ai', content: item.response }
      ])
      setMessages(loadedMessages)
    }
  }

  const formatResponse = (text: string) => {
    // Split the text into lines
    const lines = text.split('\n');
    
    // Process each line
    const formattedLines = lines.map(line => {
      // Bold headers (lines ending with **)
      if (line.trim().endsWith('**')) {
        return `**${line.trim()}**`;
      }
      // Create list items
      if (line.trim().startsWith('-')) {
        return `• ${line.trim().slice(1).trim()}`;
      }
      // Create numbered list items
      if (/^\d+\./.test(line.trim())) {
        return `${line.trim()}`;
      }
      // Regular text
      return line.trim();
    });

    // Join the lines back together
    return formattedLines.join('\n\n');
  };

  const handleSendMessage = async () => {
    if (input.trim()) {
      // If there's no current sessionId, create a new one
      if (!sessionId) {
        setSessionId(uuidv4());
      }

      const userMessage: Message = { role: 'user', content: input.trim() }
      setMessages(prevMessages => [...prevMessages, userMessage])
      
      try {
        const response = await fetch(`/api/langflow/lf/439095bb-d0f2-41c2-9aa4-29a74177e9e4/api/v1/run/96b5d016-b0e8-482f-9db6-4631f0292d2f?stream=false`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LANGFLOW_API_KEY}`
          },
          body: JSON.stringify({
            input_value: input.trim(),
            output_type: "chat",
            input_type: "chat",
            tweaks: {
              "ChatInput-AcfLN": {
                session_id: sessionId
              }
            }
          })
        })

        const data = await response.json()
        const rawContent = data.outputs[0].outputs[0].results.message.text;
        const formattedContent = formatResponse(rawContent);
        const aiMessage: Message = { role: 'ai', content: formattedContent }
        setMessages(prevMessages => [...prevMessages, aiMessage])

        // Save conversation to Supabase
        await supabase.from('conversations').insert({
          user_id: userId,
          session_id: sessionId,
          message: userMessage.content,
          response: formattedContent
        })

        // Refresh chat sessions
        fetchChatSessions()

      } catch (error) {
        console.error('Error:', error)
      }

      setInput('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Sidebar */}
      <div className="w-64 bg-sky-900 text-sky-100 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">e-Likita Chat</h1>
          <Button variant="ghost" size="icon" className="text-sky-100 hover:text-white hover:bg-sky-800">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-4"
        >
          <Button onClick={startNewChat} className="w-full bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white transition-all duration-300">
            <PlusCircle className="mr-2 h-4 w-4" /> New Chat
          </Button>
        </motion.div>
        <div className="space-y-2 mb-4 overflow-y-auto">
          {chatSessions.map((session) => (
            <motion.div
              key={session.session_id}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              className="p-2 rounded-md cursor-pointer flex items-center"
              onClick={() => loadChatSession(session.session_id)}
            >
              <MessageCircle className="mr-2 h-4 w-4" /> 
              {new Date(session.created_at).toLocaleString()}
            </motion.div>
          ))}
        </div>
        <div className="mt-auto space-y-2">
          <motion.div
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            className="rounded-md overflow-hidden"
          >
            <button className="w-full px-4 py-2 text-left flex items-center text-sky-100 hover:text-white transition-colors duration-200">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </button>
          </motion.div>
          <motion.div
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            className="rounded-md overflow-hidden"
          >
            <button className="w-full px-4 py-2 text-left flex items-center text-sky-100 hover:text-white transition-colors duration-200">
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </button>
          </motion.div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="bg-white border-b border-sky-200 p-4">
          <h2 className="text-xl font-semibold text-sky-900">Chat with e-Likita AI</h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3/4 p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-emerald-400 to-sky-400 text-white'
                    : 'bg-sky-100 text-sky-900'
                }`}
              >
                {message.role === 'ai' ? (
                  <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br>') }} />
                ) : (
                  message.content
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input area */}
        <div className="bg-white border-t border-sky-200 p-4">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border-sky-200 focus:ring-sky-500 focus:border-sky-500"
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button onClick={handleSendMessage} className="bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white transition-all duration-300">
                <Send className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface