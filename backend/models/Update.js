const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema(
  {
    idea: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['update', 'feedback'], default: 'update' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Update', updateSchema);
