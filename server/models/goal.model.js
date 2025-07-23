const mongoose = require('mongoose');

const goalSchema = mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  completed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Goal', goalSchema);