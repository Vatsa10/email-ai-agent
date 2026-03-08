import React, { useState, useEffect } from "react";
import { Mail, Mic, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const Hero: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-[#030303]">
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center text-center gap-6 md:gap-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[10px] md:text-xs font-bold tracking-widest uppercase mb-2 md:mb-4">
          <Sparkles size={14} />
          AI Powered Productivity
        </div>

        <h1 className="hero-heading text-5xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 leading-[1.1]">
          Tired of Typing <br />
          <span className="flex items-center justify-center gap-3 md:gap-4">
            E<div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-blue-600 inline-flex items-center justify-center shadow-2xl shadow-blue-500/20"><Mail size={30} className="text-white md:size-10" /></div>ails?
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-white/50 max-w-sm md:max-w-2xl font-medium leading-relaxed">
          Manage your inbox with just your voice. <br className="hidden md:block" />
          Experience the future of email.
        </p>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-4 md:mt-8 w-full md:w-auto px-6 md:px-0">
          <Link href="/dashboard" className="w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-3 bg-white text-black px-8 md:px-12 py-4 md:py-5 rounded-[2rem] text-base md:text-lg font-bold shadow-2xl hover:bg-blue-50 transition-all active:scale-95"
            >
              <Mic className="text-blue-600 w-5 h-5 md:w-6 md:h-6" />
              Get Started Free
            </motion.button>
          </Link>

          <button className="w-full md:w-auto px-8 md:px-12 py-4 md:py-5 rounded-[2rem] border border-white/10 bg-white/5 text-white text-base md:text-lg font-bold hover:bg-white/10 transition-all">
            See Video Demo
          </button>
        </div>
      </motion.div>

      {/* Floating indicators */}
      {/* <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
        <p className="text-[10px] uppercase tracking-widest text-white">Scroll to explore</p>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </div> */}
    </div>
  );
};

export default Hero;
