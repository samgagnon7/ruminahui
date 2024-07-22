// src/App.js

import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/generate', { prompt });
      setResponse(res.data.text);
    } catch (error) {
      console.error('Error calling the backend API:', error);
      setResponse('Error generating response');
    }
  };

  return (
    <div>
      <h1>OpenAI API with React</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows="4"
          cols="50"
        />
        <br />
        <button type="submit">Generate</button>
      </form>
      <div>
        <h2>Response:</h2>
        <p>{response}</p>
      </div>
    </div>
  );
}

export default App;