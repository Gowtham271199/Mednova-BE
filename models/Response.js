const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  responses: {
    type: [String],
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Response', responseSchema);
