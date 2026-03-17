const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'No message provided' });

    const prompt = `You are a friendly AI study assistant for Indian college students. Explain concepts clearly using simple language and real examples. Keep answers under 200 words. Use bullet points when listing steps. If asked for quiz questions, give exactly 5 MCQs with answers. Student question: ${message}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({ answer: completion.choices[0].message.content });

  } catch (err) {
    console.error('Chat error:', err.message);
    res.json({ answer: 'The AI is taking a moment — please try again in a few seconds.' });
  }
});

module.exports = router;