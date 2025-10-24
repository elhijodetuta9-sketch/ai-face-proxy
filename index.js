import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Get Gemini API key from Render environment
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/tts", async (req, res) => {
  const userText = req.body.text;
  if (!userText) {
    return res.status(400).json({ error: "Missing text input" });
  }

  try {
    // Send the text to Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userText }] }],
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini response:", data);

    const aiReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t process that.";

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "Gemini request failed" });
  }
});

app.listen(3000, () => console.log("✅ Gemini proxy running on port 3000"));
