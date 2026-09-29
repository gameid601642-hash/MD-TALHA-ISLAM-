// NK FOZ 0M! Browser — secure ChatGPT backend
// Node.js 18+
// Install: npm install
// Run:     npm start

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn("WARNING: OPENAI_API_KEY is not set.");
}

app.use(express.json({ limit: "64kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: "Server API key is not configured." });
    }

    const message = String(req.body?.message || "").trim();
    const history = Array.isArray(req.body?.history) ? req.body.history.slice(-12) : [];

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const input = [
      ...history
        .filter(x => x && (x.role === "user" || x.role === "assistant") && typeof x.content === "string")
        .map(x => ({ role: x.role, content: x.content })),
      { role: "user", content: message }
    ];

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.6",
        input
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return res.status(response.status).json({
        error: data?.error?.message || "OpenAI API request failed."
      });
    }

    const reply = data.output_text || extractOutputText(data.output);

    if (!reply) {
      return res.status(502).json({ error: "No text response was returned by OpenAI." });
    }

    res.json({ reply });
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

function extractOutputText(output) {
  if (!Array.isArray(output)) return "";
  return output
    .flatMap(item => Array.isArray(item?.content) ? item.content : [])
    .filter(part => part?.type === "output_text")
    .map(part => part.text || "")
    .join("");
}

app.listen(PORT, () => {
  console.log(`NK FOZ 0M! Browser running at http://localhost:${PORT}`);
});
