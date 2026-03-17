const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
  try {
    const { subject, dueDate } = req.body;
    const prompt = `Write a polite email from a college student to a professor requesting a 4-day assignment extension. Subject: ${subject}. Original due date: ${dueDate}. Reason: multiple academic deadlines overlapping this week. Keep it professional, humble, under 150 words. Return ONLY valid JSON with no markdown, no backticks: { "subject": "the email subject line", "body": "the full email body" }`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
    });

    const cleaned = completion.choices[0].message.content.replace(/```json|```/g, '').trim();
    const emailObj = JSON.parse(cleaned);
    res.json(emailObj);

  } catch (err) {
    console.error('Email error:', err.message);
    res.json({
      subject: `Extension Request — ${req.body.subject}`,
      body: `Dear Professor,\n\nI hope this message finds you well. I am writing to respectfully request a 4-day extension for the ${req.body.subject} assignment originally due on ${req.body.dueDate}.\n\nI have multiple academic deadlines overlapping this week and want to ensure I submit quality work.\n\nThank you for your understanding.\n\nWarm regards`
    });
  }
});

module.exports = router;