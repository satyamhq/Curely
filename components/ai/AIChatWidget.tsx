'use client'

import { useState } from 'react'
import { Bot, MessageSquare, Send, X } from 'lucide-react'

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text: 'Hello! I am Curely AI Assistant. How can I help you with your health, doctor bookings, or prescriptions today?',
    },
  ])
  const [input, setInput] = useState('')

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = input.trim()
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }])
    setInput('')

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Thank you for asking. Based on "${userMsg}", I recommend checking your symptoms using our AI Symptom Checker or consulting a licensed General Physician.`,
        },
      ])
    }, 600)
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-13 w-13 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
          title="Open AI Health Assistant"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className="flex h-[450px] w-80 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200 sm:w-96">
          <div className="flex items-center justify-between border-b border-border bg-primary p-4 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-bold text-sm">Curely Health Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded p-1 hover:bg-primary-foreground/20">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-3.5 py-2.5 leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground border border-border'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a health question..."
              className="flex-1 rounded-lg border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              type="submit"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
