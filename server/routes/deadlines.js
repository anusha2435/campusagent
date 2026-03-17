const express  = require('express');
const router   = express.Router();
const Deadline = require('../models/Deadline');

router.get('/', async (req, res) => {
  try {
    const dl = await Deadline.find().sort({ dueDate: 1 });
    res.json(dl);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const d = new Deadline(req.body);
    await d.save();
    res.json(d);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Deadline.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;