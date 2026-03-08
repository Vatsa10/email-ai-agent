"use client";
import { useVoiceAgent } from "@/hooks/useVoiceAgent";
import { speak } from "@/lib/tts";
import AudioOrb from "./AudioOrb";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square, RotateCcw, Mic } from "lucide-react";

type VoiceAgentProps = {
  onAgentSpeak: (role: "user" | "agent", text: string) => void;
  onReset: () => void;
};

const VoiceAgent = ({ onAgentSpeak, onReset }: VoiceAgentProps) => {
  const {
    start, stop, reset, pause, resume,
    listening, paused, sendStep, draftSubject, draftBody,
    searchStep, searchTo, sendText
  } = useVoiceAgent(onAgentSpeak);

  const [typedEmail, setTypedEmail] = useState("");
  const [typedSearch, setTypedSearch] = useState("");

  useEffect(() => {
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleStart = () => {
    const greeting = "Hi, I am your Email Voice Assistant. I can help you read, summarize, or send emails. What would you like to do?";
    speak(greeting, () => {
      onAgentSpeak("agent", greeting);
      start();
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedEmail.trim()) {
      sendText(typedEmail.trim());
      setTypedEmail("");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedSearch.trim()) {
      sendText(typedSearch.trim());
      setTypedSearch("");
    }
  };

  return (
    <div className="relative w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto overflow-x-hidden pt-32 pb-10 scrollbar-hide">
      <div className="z-10 flex flex-col items-center gap-8 md:gap-10 w-full max-w-md">

        {/* HITL Cards Container */}
        <div className="w-full flex flex-col gap-4">
          {/* Draft Preview & HITL Input */}
          <AnimatePresence mode="wait">
            {draftSubject && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="w-full bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl flex flex-col gap-4 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Email Draft</span>
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm line-clamp-1 opacity-80 mb-1">{draftSubject}</h3>
                  <p className="text-white/40 text-xs line-clamp-3 leading-relaxed">{draftBody}</p>
                </div>

                {sendStep === "awaiting_recipient" && (
                  <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleEmailSubmit}
                    className="mt-2 flex flex-col gap-3"
                  >
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter recipient's email..."
                        value={typedEmail}
                        onChange={(e) => setTypedEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-blue-500/50 transition-colors"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-xl hover:bg-blue-500 transition-colors"
                      >
                        Confirm
                      </button>
                    </div>
                    <p className="text-[10px] text-white/30 text-center italic">Tip: You can also say the email address</p>
                  </motion.form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Verification HITL */}
          <AnimatePresence mode="wait">
            {searchStep === "confirm_search" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="w-full bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl flex flex-col gap-4 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest text-nowrap">Search Verification</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div>
                  <p className="text-white/60 text-xs leading-relaxed">
                    Preparing to search emails from: <span className="text-white font-semibold">"{searchTo}"</span>
                  </p>
                </div>

                <form
                  onSubmit={handleSearchSubmit}
                  className="mt-2 flex flex-col gap-3"
                >
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Correct the name/email..."
                      value={typedSearch}
                      onChange={(e) => setTypedSearch(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-emerald-500/50 transition-colors"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-xl hover:bg-emerald-500 transition-colors"
                    >
                      Update
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => sendText("yes")}
                    className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-colors"
                  >
                    Confirm & Search
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AudioOrb active={listening && !paused} />

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {!listening && !paused ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="group relative flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-3xl bg-white text-black font-semibold text-base md:text-lg hover:bg-blue-50 transition-colors shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-600 transition-transform origin-left group-hover:scale-x-100 scale-x-0" />
              <Mic className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              Start Assistant
            </motion.button>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <button
                  onClick={paused ? resume : pause}
                  className={`flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl transition-all shadow-lg ${paused
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-amber-400 text-black hover:bg-amber-500"
                    }`}
                  title={paused ? "Resume" : "Pause"}
                >
                  {paused ? <Play className="fill-current w-5 h-5 md:w-6 md:h-6" /> : <Pause className="fill-current w-5 h-5 md:w-6 md:h-6" />}
                </button>

                <button
                  onClick={stop}
                  className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-lg"
                  title="Stop"
                >
                  <Square className="fill-current w-5 h-5 md:w-6 md:h-6" />
                </button>

                <button
                  onClick={reset}
                  className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all shadow-lg"
                  title="Reset"
                >
                  <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        <div className="h-8">
          <AnimatePresence>
            {listening && !paused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-blue-400 font-medium"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Assistant is listening...
              </motion.div>
            )}
            {paused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-amber-400 font-medium"
              >
                Session Paused
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgent;
