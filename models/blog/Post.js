const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
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
  slug: {
    type: String,
    required: true,
  },
  shortContent: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  publishedOn: {
    type: Date,
    default: Date.now,
  },
  updatedOn: {
    type: Date,
    default: null,
  },
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
