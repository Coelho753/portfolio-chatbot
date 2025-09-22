import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = await req.json();

    const response = await fetch(
      "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + process.env.HF_TOKEN, // chave segura
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const data = await response.json();
    res.status(200).json({ reply: data[0]?.generated_text || "Sem resposta." });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

