import React, { useState } from "react";

export default function ExcelAgent() {
  const [files, setFiles] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [schema, setSchema] = useState("");

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    const res = await fetch("http://localhost:8000/load_excels/", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    alert(data.message);
    fetchSchema();
  };

  const fetchSchema = async () => {
    const res = await fetch("http://localhost:8000/schema/");
    const data = await res.json();
    setSchema(data.schema || "No schema available");
  };

  const askQuestion = async () => {
    const formData = new FormData();
    formData.append("question", question);

    const res = await fetch("http://localhost:8000/ask/", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setAnswer(data.answer || "No answer available");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>📊 Excel Q&A Bot</h1>

      <div style={{ marginBottom: "20px" }}>
        <input type="file" multiple onChange={handleFileChange} />
        <button onClick={uploadFiles} style={{ marginLeft: "10px" }}>
          Upload
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Schema</h3>
        <pre style={{ background: "#f4f4f4", padding: "10px" }}>{schema}</pre>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          style={{ width: "300px", marginRight: "10px" }}
        />
        <button onClick={askQuestion}>Ask</button>
      </div>

      <div>
        <h3>Answer</h3>
        <pre style={{ background: "#f9f9f9", padding: "10px" }}>{answer}</pre>
      </div>
    </div>
  );
}
