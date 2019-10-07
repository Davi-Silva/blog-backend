const mongoose = require("mongoose");

const PodcastSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  tags: {
    type: String,
    required: false
  },
  filepath: {
    type: String,
    required: true
  },
  length: {
    type: String,
    required: true
  },
  uploaded_on: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated_on: {
    type: Date,
    default: null,
    required: false
  }
});

const Podcast = mongoose.model("Podcast", PodcastSchema);

module.exports = Podcast;
