"use client";

import { useEffect, useRef, useState } from "react";

type Message = { sender: string; text: string; type?: "error" | "info" };

export default function VoiceChat() {
  const [listening, setListening] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const recognitionRef = useRef<any>(null); // SpeechRecognition instance or null

  useEffect(() => {
    // cross-browser SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      recognitionRef.current = null;
      return;
    }
    const rec = new SpeechRecognition();
    rec.interimResults = false;
    rec.lang = "en-US"; // change if you want multi-language
    rec.maxAlternatives = 1;

    rec.onresult = (ev: any) => {
      const transcript = ev.results[0][0].transcript;
      handleUserText(transcript);
    };

    rec.onerror = (ev: any) => {
      console.error("SpeechRecognition error", ev);
      setConversation(prev => [...prev, { sender: "System", text: `Mic error: ${ev.error}`, type: "error" }]);
      setListening(false);
    };

    rec.onend = () => {
      setListening(false);
    };

    recognitionRef.current = rec;
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      setConversation(prev => [...prev, { sender: "System", text: "SpeechRecognition not supported in this browser.", type: "error" }]);
      return;
    }
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (e) {
      console.error(e);
      setConversation(prev => [...prev, { sender: "System", text: "Could not start mic.", type: "error" }]);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
  };

  // send the transcribed text to backend and handle response
  const handleUserText = async (userText: string) => {
    // show user's message
    setConversation(prev => [...prev, { sender: "You", text: userText }]);

    // show a thinking indicator
    setConversation(prev => [...prev, { sender: "AI", text: "Thinking...", type: "info" }]);

    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userText }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      // remove last "Thinking..." message
      setConversation(prev => {
        const copy = prev.slice();
        const lastIndex = copy.map(m => m.text).lastIndexOf("Thinking...");
        if (lastIndex >= 0) copy.splice(lastIndex, 1);
        return copy;
      });

      // append AI text
      setConversation(prev => [...prev, { sender: "AI", text: data.ai_text }]);

      // play audio if available
      if (data.audio_url) {
        const audio = new Audio(`http://localhost:8000${data.audio_url.startsWith("/") ? data.audio_url : "/" + data.audio_url}`);
        audio.play().catch(e => {
          console.error("Audio play failed", e);
          setConversation(prev => [...prev, { sender: "System", text: "Audio playback failed", type: "error" }]);
        });
      }
    } catch (err: any) {
      console.error(err);
      // replace thinking with error
      setConversation(prev => {
        const copy = prev.slice();
        const lastIndex = copy.map(m => m.text).lastIndexOf("Thinking...");
        if (lastIndex >= 0) copy.splice(lastIndex, 1);
        return [...copy, { sender: "System", text: `Error: ${err.message}`, type: "error" }];
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-teal-50">
      <header className="bg-teal-600 text-white py-4 px-6 text-center font-bold text-lg shadow-md">
        Voice AI Assistant
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {conversation.map((msg, i) => (
          <div key={i} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl shadow ${
                msg.type === "error"
                  ? "bg-red-100 text-red-700 border border-red-400"
                  : msg.sender === "You"
                  ? "bg-teal-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 border rounded-bl-none"
              }`}
            >
              <p className="text-sm font-semibold">{msg.sender}</p>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </main>

      <footer className="p-4 bg-white shadow-md flex flex-col items-center gap-4 ">
        <button
          onClick={listening ? stopListening : startListening}
          className={`px-6 py-3 rounded-full font-semibold transition duration-300 flex justify-center shadow-lg ${listening ? "bg-red-500 hover:bg-red-600" : "bg-teal-600 hover:bg-teal-700 w-2xl"} text-white`}
        >
          {listening ? "Stop" : "🎤 Click to Speak"}
        </button>
        <div className="text-sm text-gray-600">
        <p>AI Assistant can make mistakes.Check important info.</p>
        </div>
      </footer>
    </div>
  );
}