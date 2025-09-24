import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());   // <---- libera CORS
app.use(express.json());


app.post("/api", async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: "prompt é obrigatório" });

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    // se a API retornar erro, repassa o texto para debugging
    if (!openaiRes.ok) {
      const text = await openaiRes.text();
      return res.status(openaiRes.status).json({ error: text });
    }

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content ?? "Sem resposta.";
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
