const mongoose = require('mongoose');

const PodcastSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [],
    required: false,
  },
  audioFile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PodcastAudioFile',
    required: true,
  },
  cover: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PodcastCover',
    required: true,
  },
  uploadedOn: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedOn: {
    type: Date,
    default: null,
    required: false,
  },
});

const Podcast = mongoose.model('Podcast', PodcastSchema);

module.exports = Podcast;
