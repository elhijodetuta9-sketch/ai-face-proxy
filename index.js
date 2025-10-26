import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

app.post("/tts", async (req, res) => {
  const text = req.body.text;

  if (!text) {
    return res.status(400).json({ reply: "Missing text input." });
  }

  try {
    console.log("🟢 Received text:", text);

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text }],
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("🧠 Gemini raw response:", JSON.stringify(data, null, 2));

    let replyText = "Sorry, I couldn’t process that.";
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      replyText = data.candidates[0].content.parts[0].text;
    }

    console.log("✅ Reply:", replyText);
    res.json({ reply: replyText });
  } catch (error) {
    console.error("🔥 Error from Gemini:", error);
    res.status(500).json({ reply: "Server error while talking to Gemini." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Gemini proxy running on port ${PORT}`);
});
