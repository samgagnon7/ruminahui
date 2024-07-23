const { OpenAI } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function sendImage() {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { "type": "json_object" },
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "You are a assistant that helps scoring mahjong hands. What is the score in this image. Please think carefully." },
          {
            type: "image_url",
            image_url: {
              "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1Oyr0HlFrONumSgfBkihwmJCJ2ynRuVmlZQ&s",
            },
          },
        ],
      },
    ],
  });
  console.log(response.choices[0]);
}

async function sendCompletion(prompt) {
  const response = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-4o-mini",
  });
  
  return response.choices[0].message.content.trim();
}

// Export the functions
module.exports = {
  sendImage,
  sendCompletion,
};