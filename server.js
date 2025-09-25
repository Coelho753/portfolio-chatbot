import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // no Node 18+ pode usar fetch direto

const app = express();
const PORT = process.env.PORT || 3000;
if (!process.env.OPENAI_API_KEY) {
  console.error("⚠️ A variável OPENAI_API_KEY não está configurada!");
}


app.use(cors());
app.use(express.json());

// Rota POST para enviar prompt ao ChatGPT
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "O campo 'prompt' é obrigatório." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Erro na OpenAI:", error);
    res.status(500).json({ error: "Erro ao se comunicar com a OpenAI." });
  }
});



// Teste de saúde (Render usa muito essa rota)
app.get("/", (req, res) => {
  res.send("API está rodando 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
