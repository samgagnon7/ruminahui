const openaiService = require('../services/openai-service');

const postImage = async (req, res) => {
    const imageBase64 = req.body.image;
    try {
    const text = await openaiService.sendImage(imageBase64)
      res.json({ text: text });
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Export the controller functions
  module.exports = {
    postImage,
  };