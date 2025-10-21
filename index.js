import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/tts", async (req, res) => {
  const text = req.body.text;

  try {
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: text
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API error:", errText);
      return res.status(response.status).send(errText);
    }

    res.set("Content-Type", "audio/mpeg");
    response.body.pipe(res);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Error communicating with OpenAI API.");
  }
});

app.listen(3000, () => {
  console.log("✅ Proxy server running on port 3000");
});
    
