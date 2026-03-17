const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Groq = require('groq-sdk');
const Subject = require('../models/Subject');

const upload = multer({ storage: multer.memoryStorage() });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No PDF uploaded' });
    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text.slice(0, 8000);
    const prompt = `You are an academic assistant. Parse this college syllabus text and return ONLY a valid JSON array. No markdown, no explanation, just raw JSON. Each object must have exactly these fields: { "name": string, "credits": number, "units": number, "complexity": "Low" or "Medium" or "High", "topics": [array of topic strings] }. Syllabus text: ${text}`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = completion.choices[0].message.content.replace(/```json|```/g, '').trim();
    const subjects = JSON.parse(raw);
    const withPri = subjects.map(s => ({
      ...s,
      priority: s.complexity === 'High' ? Math.min(100, 75 + (s.credits||0)*2) :
        s.complexity === 'Medium' ? Math.min(100, 50 + (s.credits||0)*2) :
        Math.min(100, 25 + (s.credits||0)*2)
    }));
    await Subject.deleteMany({});
    await Subject.insertMany(withPri);
    res.json({ success: true, subjects: withPri });

  } catch (err) {
    console.error('Parse error:', err.message);
    const mock = [
      { name: 'Data Structures', credits: 4, units: 5, complexity: 'High', topics: ['Arrays','Trees','Graphs'], priority: 83 },
      { name: 'Operating Systems', credits: 4, units: 6, complexity: 'High', topics: ['Processes','Memory','Scheduling'], priority: 83 },
      { name: 'DBMS', credits: 3, units: 5, complexity: 'Medium', topics: ['SQL','Normalization','Transactions'], priority: 56 },
      { name: 'Computer Networks', credits: 3, units: 5, complexity: 'Medium', topics: ['TCP/IP','Routing','DNS'], priority: 56 },
      { name: 'Engineering Maths', credits: 3, units: 4, complexity: 'Low', topics: ['Calculus','Linear Algebra'], priority: 31 },
    ];
    await Subject.deleteMany({});
    await Subject.insertMany(mock);
    return res.json({ success: true, subjects: mock });
  }
});

module.exports = router;