import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// === Environment Variable ===
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY environment variable is not set!");
  process.exit(1);
}

// === Test route ===
app.get("/", (req, res) => {
  res.json({ message: "✅ Gemini proxy is alive!" });
});

// === TTS / Chat route ===
app.post("/tts", async (req, res) => {
  const text = req.body.text;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Missing text field" });
  }

  console.log("🟢 Received text:", text);

  try {
    const geminiResponse = await fetch(
 fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + GEMINI_API_KEY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text }],
            },
          ],
        }),
      }
    );

    const data = await geminiResponse.json();
    console.log("🧠 Gemini raw response:", JSON.stringify(data, null, 2));

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t process that.";

    console.log("💬 Reply:", reply);
    res.json({ reply });
  } catch (err) {
    console.error("❌ Error from Gemini:", err);
    res.status(500).json({ error: "Gemini request failed" });
  }
});

// === Start Server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Gemini proxy running on port ${PORT}`);
  console.log("🌐 Ready at: http://localhost:" + PORT);
});
