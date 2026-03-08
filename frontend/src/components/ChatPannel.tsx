"use client";
import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { ChatMessage } from "@/types/chat";
import { motion, AnimatePresence } from "framer-motion";

const ChatPannel = ({ messages }: { messages: ChatMessage[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  return (
    <div className="w-full md:w-1/2 flex flex-col h-full items-center justify-center p-4 md:p-8 bg-black/10">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col w-full max-w-2xl h-[70vh] md:h-[85vh] overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-white/[0.03] border border-white/10 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
      >
        <div className="px-6 md:px-10 py-6 md:py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
          <div className="flex flex-col gap-1">
            <h2 className="text-white font-semibold text-base md:text-lg tracking-tight">Transcript</h2>
            <p className="text-[9px] md:text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">Assistant Active</p>
          </div>
          <div className="flex gap-1.5 md:gap-2">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500/50" />
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-400/30" />
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-300/10" />
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 md:px-8 py-6 md:py-10 chat-scroll"
        >
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-white/10 gap-6 md:gap-8 text-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/5 flex items-center justify-center">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/5 animate-ping" />
                  </div>
                </div>
                <div>
                  <p className="text-lg md:text-xl font-medium text-white/20">Awaiting Commands</p>
                  <p className="text-xs md:text-sm mt-2 opacity-50 italic">"Read my unread emails"</p>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-8 md:gap-10">
                {messages.map((m) => (
                  <Message key={m.id} role={m.role} text={m.text} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-6 md:px-10 py-4 md:py-6 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-white/20 font-medium uppercase tracking-[0.2em]">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            Secured Connection
          </div>
          <p className="text-[9px] md:text-[10px] text-white/20 font-bold tracking-tighter">V1.0</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatPannel;
