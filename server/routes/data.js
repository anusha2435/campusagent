const express  = require('express');
const router   = express.Router();
const Subject  = require('../models/Subject');
const Deadline = require('../models/Deadline');

router.get('/', async (req, res) => {
  try {
    const subjects  = await Subject.find();
    const deadlines = await Deadline.find().sort({ dueDate: 1 });
    res.json({ subjects, deadlines });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;