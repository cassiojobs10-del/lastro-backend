const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, system } = req.body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01" 
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620", 
        max_tokens: 1000,
        system: system,
        messages: messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Erro na API do Claude");
    }

    res.json(data);

  } catch (error) {
    console.error("Erro:", error.message);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
