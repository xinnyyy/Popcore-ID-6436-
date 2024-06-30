const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answers: {
    type: [String],
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
