const mongoose = require('mongoose');

const D = new mongoose.Schema({
  subject:   { type: String, required: true },
  type:      { type: String, enum: ['Assignment','Internal','Lab','Presentation'], default: 'Assignment' },
  dueDate:   { type: Date, required: true },
  weightage: { type: Number, default: 0 },
  alertSent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Deadline', D);