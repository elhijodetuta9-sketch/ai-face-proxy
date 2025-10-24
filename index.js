app.post("/tts", async (req, res) => {
  const text = req.body.text;
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Missing text field" });
  }

  try {
    console.log("🟢 Received text:", text);

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + GEMINI_API_KEY,
      {
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
      }
    );

    const data = await response.json();
    console.log("🧠 Gemini raw response:", JSON.stringify(data, null, 2));

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn’t process that.";

    console.log("💬 Extracted reply:", reply);

    res.json({ reply });
  } catch (err) {
    console.error("❌ Error talking to Gemini:", err);
    res.status(500).json({ error: "Gemini request failed" });
  }
});
