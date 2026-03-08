import { useRef, useState } from "react";
import { createDeepgramSocket } from "@/lib/deepgram";
import { sendToBackend } from "@/lib/api";
import { speak } from "@/lib/tts";

function cleanForSpeech(text: string): string {
  return text
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/#{1,6}\s/g, "")
    .replace(/`/g, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
}

export function useVoiceAgent(onMessage?: (role: "user" | "agent", text: string) => void) {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isSpeaking = useRef(false);
  const isPaused = useRef(false);

  const [listening, setListening] = useState(false);
  const [paused, setPaused] = useState(false);
  const lastEmailIdRef = useRef<string | null>(null);
  const [lastEmailId, setLastEmailId] = useState<string | null>(null);

  const [sendStep, setSendStep] = useState<string | null>(null);
  const [draftSubject, setDraftSubject] = useState<string | null>(null);
  const [draftBody, setDraftBody] = useState<string | null>(null);

  const [searchStep, setSearchStep] = useState<string | null>(null);
  const [searchTo, setSearchTo] = useState<string | null>(null);

  function startRecording() {
    if (!streamRef.current || !socketRef.current) return;
    mediaRecorder.current = new MediaRecorder(streamRef.current, {
      mimeType: "audio/webm;codecs=opus",
    });
    mediaRecorder.current.ondataavailable = (e) => {
      if (socketRef.current?.readyState === WebSocket.OPEN && !isSpeaking.current) {
        socketRef.current.send(e.data);
      }
    };
    mediaRecorder.current.start(250);
    setListening(true);
  }

  async function handleResponse(data: any) {
    if (typeof data.email_id === "string") {
      lastEmailIdRef.current = data.email_id;
      setLastEmailId(data.email_id);
    }
    if (data.deleted === true) {
      lastEmailIdRef.current = null;
      setLastEmailId(null);
    }

    setSendStep(data.send_step || null);
    setDraftSubject(data.draft_subject || null);
    setDraftBody(data.draft_body || null);

    setSearchStep(data.search_step || null);
    setSearchTo(data.search_to || null);

    onMessage?.("agent", data.response);

    isSpeaking.current = true;
    speak(cleanForSpeech(data.response), () => {
      setTimeout(() => {
        isSpeaking.current = false;
        if (isPaused.current) return;

        socketRef.current?.close();
        socketRef.current = null;
        startSession();
      }, 200);
    });
  }

  const sendText = async (text: string) => {
    mediaRecorder.current?.stop();
    mediaRecorder.current = null;
    socketRef.current?.close();
    socketRef.current = null;
    setListening(false);

    onMessage?.("user", text);
    const data = await sendToBackend(text, lastEmailIdRef.current);
    await handleResponse(data);
  };

  function startSession() {
    if (!streamRef.current || isPaused.current) return;

    socketRef.current = createDeepgramSocket(async (finalText) => {
      if (isSpeaking.current || isPaused.current) return;
      mediaRecorder.current?.stop();
      mediaRecorder.current = null;
      setListening(false);

      onMessage?.("user", finalText);

      const lower = finalText.toLowerCase();
      const isComposeFlow =
        lower.includes("create") ||
        lower.includes("compose") ||
        lower.includes("write") ||
        lower.includes("send mail");

      const data = await sendToBackend(
        finalText,
        isComposeFlow || lastEmailIdRef.current == null
          ? null
          : lastEmailIdRef.current
      );

      await handleResponse(data);
    }, isSpeaking);

    socketRef.current.onopen = () => {
      console.log("Deepgram ready - listening...");
      startRecording();
    };
  }

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    startSession();
  }

  function pause() {
    isPaused.current = true;
    setPaused(true);

    mediaRecorder.current?.stop();
    mediaRecorder.current = null;
    socketRef.current?.close();
    socketRef.current = null;

    window.speechSynthesis.cancel();
    isSpeaking.current = false;

    setListening(false);
    console.log("PAUSED - state preserved in LangGraph");
  }

  function resume() {
    isPaused.current = false;
    setPaused(false);
    console.log("RESUMED - continuing conversation");
    startSession();
  }

  function stop() {
    mediaRecorder.current?.stop();
    mediaRecorder.current = null;
    socketRef.current?.close();
    socketRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setListening(false);
  }

  async function reset() {
    stop();
    lastEmailIdRef.current = null;
    setLastEmailId(null);
    setSendStep(null);
    setDraftSubject(null);
    setDraftBody(null);
    setSearchStep(null);
    setSearchTo(null);
    await fetch("http://localhost:8000/reset", { method: "POST" });
    await sendToBackend("reset", null);
    setTimeout(() => start(), 300);
  }

  return {
    start,
    stop,
    reset,
    pause,
    resume,
    listening,
    paused,
    lastEmailId,
    sendStep,
    draftSubject,
    draftBody,
    searchStep,
    searchTo,
    sendText,
  };
}
