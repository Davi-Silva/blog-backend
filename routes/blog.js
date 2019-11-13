const express = require('express');

const app = express();
const cors = require('cors');
const uuidv4 = require('uuid/v4');
// const multer = require('multer');
// const multerConfig = require('../config/multer');

app.use(cors());

const Post = require('../models/blog/Post');

app.get('/', async (req, res) => {
  const postsList = [];
  Post.find()
    .then((posts) => {
      posts.map((post) => {
        postsList.push({
          title: post.title,
          shortContent: post.shortContent,
          content: post.content,
          author: post.author,
          publishedOn: post.publishedOn,
          updateOn: post.updateOn,
        });
      });
      res.status(302).send(postsList);
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
});

app.post('/publish', async (req, res) => {
  const {
    isSlugValid,
    category,
    title,
    slug,
    tags,
    shortContent,
    content,
    author,
  } = req.body;

  const errors = [];
  if (!isSlugValid
    || !category
    || !tags
    || !title
    || !slug
    || !shortContent
    || !content
    || !author) {
    errors.push({
      errorMsg: 'Please enter all fields.',
    });
  }

  console.log('errors.length:', errors.length);


  if (errors.length > 0) {
    console.log('Errors:', errors);
    res.json({
      error: errors,
    });
  } else {
    const id = uuidv4();
    const type = 'Blog';
    const publishedOn = Date.now();
    const updatedOn = null;
    if (isSlugValid) {
      const newPost = new Post({
        id,
        type,
        isSlugValid,
        category,
        title,
        slug,
        tags,
        shortContent,
        content,
        author,
        publishedOn,
        updatedOn,
      });
      newPost
        .save()
        .then(() => {
          res.status(201).send({
            msg: 'Blog Post successfully published!',
            id,
            type,
            isSlugValid,
            category,
            title,
            slug,
            tags,
            shortContent,
            content,
            author,
            publishedOn,
            updatedOn,
          });
        })
        .catch((err) => {
          res.json({
            errorMsg: err,
          });
        });
    } else {
      res.json({
        errorMsg: 'Slug is invalid',
      });
    }
  }
});

module.exports = app;
