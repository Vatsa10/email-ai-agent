"use client"
import { useState } from "react"
import VoiceAgent from "./VoiceAgent"
import { ChatMessage } from "@/types/chat"
import ChatPannel from "./ChatPannel"
import Aurora from "./Aurora"

const Conversation = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const addMessage = (role: "user" | "agent", text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role, text }
    ])
  }

  const resetChat = () => setMessages([])

  return (
    <div className="relative flex h-full w-full bg-[#030303] overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-40">
        <Aurora
          colorStops={["#1e1b4b", "#4f46e5", "#1e1b4b"]}
          amplitude={1.2}
          speed={0.5}
        />
      </div>

      {/* Glassy blobs for extra depth */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]" />

      <div className="relative z-10 flex h-full w-full">
        <VoiceAgent onAgentSpeak={addMessage} onReset={resetChat} />
        <ChatPannel messages={messages} />
      </div>
    </div>
  )
}

export default Conversation
