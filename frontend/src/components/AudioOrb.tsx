"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AudioOrb = ({ active }: { active: boolean }) => {
  const [scale, setScale] = useState(1);
  const [opacity, setOpacity] = useState(0.8);

  useEffect(() => {
    if (!active) {
      setScale(1);
      setOpacity(0.6);
      return;
    }

    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let dataArray: any;
    let rafId = 0;

    const startAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);

        const animate = () => {
          if (!analyser) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const volume = sum / dataArray.length;
          const newScale = 1 + Math.min(volume / 100, 0.4);
          const newOpacity = 0.6 + Math.min(volume / 200, 0.4);

          setScale(newScale);
          setOpacity(newOpacity);
          rafId = requestAnimationFrame(animate);
        };
        animate();
      } catch (err) {
        console.error("Audio initialization failed:", err);
      }
    };

    startAudio();

    return () => {
      cancelAnimationFrame(rafId);
      audioCtx?.close();
    };
  }, [active]);

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer Glow */}
      <motion.div
        animate={{
          scale: active ? [scale, scale * 1.1, scale] : 1,
          opacity: active ? [0.2, 0.4, 0.2] : 0.1,
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute h-80 w-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"
      />

      {/* Main Orb */}
      <div
        className="relative h-64 w-64 rounded-full overflow-hidden transition-all duration-150 ease-out shadow-[0_0_50px_rgba(59,130,246,0.5)]"
        style={{
          transform: `scale(${scale})`,
          opacity: opacity,
          background: "linear-gradient(135deg, #ffffff 0%, #a5b4fc 40%, #6366f1 70%, #312e81 100%)"
        }}
      >
        {/* Shimmer Effect */}
        <motion.div
          animate={{
            x: ["-100%", "100%"],
            y: ["-100%", "100%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "linear",
          }}
          className="absolute inset-0 bg-white/20 blur-xl translate-x-1/2 translate-y-1/2 rotate-45"
        />

        {/* Core Glow */}
        <div className="absolute inset-0 bg-radial-[at_center_center] from-white/30 to-transparent mix-blend-overlay" />
      </div>

      {/* Dynamic Rings when active */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute h-64 w-64 rounded-full border border-blue-400/30"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
              className="absolute h-64 w-64 rounded-full border border-indigo-400/20"
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioOrb;
