const { OpenAI } = require('openai');
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function sendImage(imageBase64) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "You are a assistant that helps scoring mahjong hands. What is the score in this image. Please think carefully." },
          {
            type: "image_url",
            image_url: {
              "url": "data:image/jpeg;base64," + imageBase64 
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