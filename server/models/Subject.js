const mongoose = require('mongoose');

const S = new mongoose.Schema({
  name:       { type: String, required: true },
  credits:    { type: Number, default: 0 },
  units:      { type: Number, default: 0 },
  complexity: { type: String, enum: ['Low','Medium','High'], default: 'Medium' },
  topics:     [String],
  priority:   { type: Number, default: 50 }
}, { timestamps: true });

module.exports = mongoose.model('Subject', S);