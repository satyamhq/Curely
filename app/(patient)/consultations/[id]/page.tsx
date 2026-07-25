'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PatientLayoutShell } from '@/components/layout/PatientLayoutShell'
import { ArrowLeft, CheckCircle2, FileText, Mic, MicOff, Send, ShieldCheck, User, Video, VideoOff } from 'lucide-react'

export default function ConsultationSessionPage({ params }: { params: { id: string } }) {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [messages, setMessages] = useState<Array<{ sender: 'patient' | 'doctor'; text: string; time: string }>>([
    {
      sender: 'doctor',
      text: 'Hello! I am Dr. Rajesh Sharma. How are you feeling today?',
      time: '10:01 AM',
    },
  ])
  const [inputText, setInputText] = useState('')

  const doctor = {
    name: 'Dr. Rajesh Sharma',
    speciality: 'General Physician',
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages((prev) => [...prev, { sender: 'patient', text: inputText.trim(), time: timeStr }])
    setInputText('')

    // Mock doctor response simulation
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'doctor',
          text: 'Understood. Please make sure to stay hydrated and take the prescribed medication after meals.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }, 1200)
  }

  return (
    <PatientLayoutShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/appointments"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Leave Session
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Live Video Session</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Video Call Viewport */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border bg-slate-950 shadow-xl flex flex-col justify-between p-6">
              {/* Doctor Video Stream Container */}
              <div className="flex items-center justify-between text-white z-10">
                <div className="flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-md px-3 py-1.5 text-xs font-medium">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>{doctor.name} ({doctor.speciality})</span>
                </div>
                <span className="rounded-full bg-red-500/80 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  REC
                </span>
              </div>

              {/* Central Video Stream Graphic / Stub */}
              <div className="my-auto text-center space-y-3">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-3xl border-2 border-primary/40">
                  {doctor.name.charAt(0)}
                </div>
                <p className="text-xs text-slate-400">Secure 256-bit Encrypted Telehealth Stream</p>
              </div>

              {/* Patient Self-View Window & Media Controls */}
              <div className="flex items-end justify-between z-10">
                <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md p-2 rounded-2xl">
                  <button
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500 text-white'
                    }`}
                    title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
                  >
                    {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </button>

                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                      isVideoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500 text-white'
                    }`}
                    title={isVideoOn ? 'Turn Camera Off' : 'Turn Camera On'}
                  >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </button>
                </div>

                {/* Self View Box */}
                <div className="h-24 w-32 overflow-hidden rounded-xl border border-white/20 bg-slate-900 shadow-md flex items-center justify-center text-slate-400 text-xs">
                  {isVideoOn ? (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" /> Self (You)
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500">Camera Off</span>
                  )}
                </div>
              </div>
            </div>

            {/* Consultation Notes Summary */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-3 shadow-sm">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Doctor Consultation Notes & Rx
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Prescription and medical notes entered by {doctor.name} will automatically sync to your Curely Health Records at the conclusion of this session.
              </p>
            </div>
          </div>

          {/* Consultation Chat Panel */}
          <div className="flex h-[520px] flex-col rounded-3xl border border-border bg-card shadow-md">
            <div className="border-b border-border p-4 font-bold text-sm">
              Live Chat & Prescription
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === 'patient' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                      m.sender === 'patient'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground border border-border'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="mt-1 text-[9px] text-muted-foreground px-1">{m.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-border p-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message to the doctor..."
                className="flex-1 rounded-xl border border-input bg-background py-2 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </PatientLayoutShell>
  )
}
