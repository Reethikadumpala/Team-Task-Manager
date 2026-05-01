const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
