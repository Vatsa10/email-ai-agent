"use client";
import { useVoiceAgent } from "@/hooks/useVoiceAgent";
import { speak } from "@/lib/tts";
import AudioOrb from "./AudioOrb";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square, RotateCcw, Mic } from "lucide-react";

type VoiceAgentProps = {
  onAgentSpeak: (role: "user" | "agent", text: string) => void;
  onReset: () => void;
};

const VoiceAgent = ({ onAgentSpeak, onReset }: VoiceAgentProps) => {
  const { start, stop, reset, pause, resume, listening, paused } = useVoiceAgent(onAgentSpeak);

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

  return (
    <div className="relative w-1/2 flex flex-col items-center justify-center p-8">
      <div className="z-10 flex flex-col items-center gap-12">
        <AudioOrb active={listening && !paused} />

        <div className="flex flex-wrap justify-center gap-6">
          {!listening && !paused ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="group relative flex items-center gap-3 px-10 py-5 rounded-3xl bg-white text-black font-semibold text-lg hover:bg-blue-50 transition-colors shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-600 transition-transform origin-left group-hover:scale-x-100 scale-x-0" />
              <Mic className="w-6 h-6 text-blue-600" />
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
                  className={`flex items-center justify-center w-16 h-16 rounded-2xl transition-all shadow-lg ${paused
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-amber-400 text-black hover:bg-amber-500"
                    }`}
                  title={paused ? "Resume" : "Pause"}
                >
                  {paused ? <Play className="fill-current" /> : <Pause className="fill-current" />}
                </button>

                <button
                  onClick={stop}
                  className="flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500 text-white hover:bg-rose-600 transition-all shadow-lg"
                  title="Stop"
                >
                  <Square className="fill-current" />
                </button>

                <button
                  onClick={reset}
                  className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all shadow-lg"
                  title="Reset"
                >
                  <RotateCcw />
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
