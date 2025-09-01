import React, { useState, useRef } from "react";
import { Button } from "./components/ui/Button";

export default function TextToSpeech() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Start Recording
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      chunksRef.current = [];
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  // Stop Recording
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  // Play Tamil Story (TTS from Backend)
  const playTamilStory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tts");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      console.error("TTS Error:", err);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-4">
      <h1 className="text-2xl font-bold">🎤 Voice Recorder + Tamil Story Player</h1>

      {/* Recording Controls */}
      <div className="space-x-4">
        {!recording ? (
          <Button onClick={startRecording}>🎙️ Start Recording</Button>
        ) : (
          <Button variant="destructive" onClick={stopRecording}>
            ⏹ Stop Recording
          </Button>
        )}
      </div>

      {/* Playback of recorded audio */}
      {audioUrl && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">🔊 Your Recording:</h2>
          <audio src={audioUrl} controls />
        </div>
      )}

      {/* Tamil Story TTS */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">📖 தமிழ் கதை கேட்க:</h2>
        <Button onClick={playTamilStory}>▶️ Play Tamil Story</Button>
      </div>
    </div>
  );
}
