import React, { useState } from "react";
import TextToSpeech from "./TextToSpeech";
import StoryInput from "./StoryInput";
import MenuBar from "./MenuBar";



function App() {
  const loggedIn = false; // <ExcelQABotUI />  <TextToSpeech/>import UserInfo from "./UserInfo"; Replace with actual auth check (cookie or token)  <UserInfo /><h1>React + SAML2 + OpenAM Demo</h1>

  return (
    <div>
          <StoryInput />
           
<TextToSpeech/>
    </div>
  );
}
function App1() {
  const [storyText, setStoryText] = useState(""); // stores story input
  const [ttsOutput, setTtsOutput] = useState(""); // stores TTS audio URL

  const handleMenuSelect = async (option) => {
    console.log("Selected option:", option);

    if (option === "tts") {
      if (!storyText) return; // do nothing if story is empty

      // forward storyText to TTS function
      const audioUrl = await StoryInput(storyText);
      if (audioUrl) setTtsOutput(audioUrl);
    } else if (option === "stt") {
      console.log("STT clicked");
      // implement Speech To Text logic here if needed
    }
  };

  return (
    <div className="p-6">
      <MenuBar onSelect={handleMenuSelect} />

      <h1 className="text-xl font-bold mt-4 mb-2">Enter Your Story</h1>
      <textarea
        className="border p-2 w-full mb-4"
        rows="6"
        value={storyText}
        onChange={(e) => setStoryText(e.target.value)}
        placeholder="Type your story here..."
      />

      {ttsOutput && (
        <div className="mt-4">
          <audio controls src={ttsOutput}></audio>
        </div>
      )}
    </div>
  );
}

export default App;