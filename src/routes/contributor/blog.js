const express = require('express');

const app = express();
const router = express.Router();
const cors = require('cors');

app.use(cors());

const Post = require('../../models/blog/Post');
const User = require('../../models/user/User');
const Comment = require('../../models/blog/Comment');
const CommentReply = require('../../models/blog/CommentReply');

router.get('/comment', (req, res) => {
  const {
    postId,
    userId,
  } = req.body;
  console.log("postId", postId)
  console.log("userId", userId)
});

