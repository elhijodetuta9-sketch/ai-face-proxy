import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Validate API key on startup
if (!OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY environment variable is not set!");
  process.exit(1);
}

app.post("/tts", async (req, res) => {
  const text = req.body.text;
  
  // Validate input
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Text field is required" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "tts-1",  // ✅ FIXED: Valid model name
        voice: "alloy",
        input: text
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API error:", errText);
      return res.status(response.status).json({ error: errText });
    }

    res.set("Content-Type", "audio/mpeg");
    response.body.pipe(res);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Error communicating with OpenAI API" });
  }
});

app.listen(3000, () => {
  console.log("✅ Proxy server running on port 3000");
});
