"use client";
import { ChatMessage } from "@/types/chat"
import ReactMarkdown from "react-markdown"
import { User, Bot } from "lucide-react"
import { motion } from "framer-motion"

type MessageProps = {
  role: "user" | "agent";
  text: string;
};

const Message = ({ role, text }: MessageProps) => {
  const isAgent = role === "agent"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex w-full gap-4 ${isAgent ? "flex-row" : "flex-row-reverse"}`}
    >
      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-md
        ${isAgent ? "bg-white/10 text-white border border-white/20" : "bg-blue-600 text-white"}
      `}>
        {isAgent ? <Bot size={24} /> : <User size={24} />}
      </div>

      <div
        className={`max-w-[85%] px-6 py-4 rounded-[2.5rem] text-sm leading-relaxed shadow-2xl backdrop-blur-xl
          ${isAgent
            ? "bg-white/5 text-white border border-white/10 rounded-tl-none"
            : "bg-blue-600/90 text-white rounded-tr-none"
          }`}
      >
        {isAgent ? (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
              li: ({ children }) => <li>{children}</li>,
              strong: ({ children }) => <span className="font-bold text-blue-300">{children}</span>,
            }}
          >
            {text}
          </ReactMarkdown>
        ) : (
          <p className="whitespace-pre-wrap">{text}</p>
        )}
      </div>
    </motion.div>
  )
}

export default Message