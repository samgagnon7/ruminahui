const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 5000;

// Configure the API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// API route
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-4o-mini",
    });
    res.json({ text: response.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
