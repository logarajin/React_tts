import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";

function StoryInput() {
  const [story, setStory] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  // When audioUrl changes, ensure audio element has the src and attempt to play.
  useEffect(() => {
    if (!audioUrl) return;
    const audioEl = audioRef.current;
    if (!audioEl) return;

    audioEl.src = audioUrl;
    audioEl.load();
    audioEl.volume = 1;

    const playPromise = audioEl.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Autoplay may be blocked — user can still press play
        console.warn("Autoplay blocked or error:", err);
      });
    }
  }, [audioUrl]);

  const handleSubmit = async () => {
    if (!story.trim()) {
      alert("Please enter some text to convert.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/api/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyText: story }),
      });

      if (!res.ok) {
        console.error("Server returned status", res.status);
        const text = await res.text();
        console.error("Server body:", text);
        setLoading(false);
        return;
      }

      const blob = await res.blob();
      console.log("Received audio blob:", { size: blob.size, type: blob.type });

      if (blob.size < 1000) {
        console.warn("Audio blob is very small — likely empty/silent TTS or server error.");
      }

      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            English to Tamil Story Converter
          </Typography>

          <TextField
            label="Enter your story in English"
            placeholder="Type your story here..."
            value={story}
            onChange={(e) => setStory(e.target.value)}
            multiline
            minRows={8}
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mb: 2 }}>
            Submit
          </Button>

          {audioUrl && (
            <div style={{ marginTop: "20px" }}>
              <Typography variant="subtitle1">Your Recording:</Typography>
              {/* src is controlled via useEffect; controls let the user play if autoplay is blocked */}
              <audio ref={audioRef} controls style={{ width: "100%" }} />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={loading}>
        <DialogContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 4 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Converting to audio...</Typography>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default StoryInput;
