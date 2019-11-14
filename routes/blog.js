const express = require('express');

const app = express();
const cors = require('cors');
const uuidv4 = require('uuid/v4');
const multer = require('multer');
const multerConfig = require('../config/multer');

app.use(cors());

const Post = require('../models/blog/Post');
const PostCover = require('../models/blog/PostCover');

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

app.get('/short', async (req, res) => {
  const postsList = [];
  Post.find()
    .then((posts) => {
      posts.map((post) => {
        postsList.push({
          title: post.title,
          shortContent: post.shortContent,
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

app.get('/cover', async (req, res) => {
  const {
    title,
  } = req.params;

  const postCover = await Post.find({
    title,
  });

  return res.json(postCover);
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

app.post('/publish/cover', multer(multerConfig).single('file'), async (req, res) => {
  const {
    originalname: name,
    size,
    key,
    location: url = '',
  } = req.file;
  const id = uuidv4();
  console.log('id:', id);

  const cover = await PostCover.create({
    id,
    name,
    size,
    key,
    url,
  });

  return res.json(cover);
});

// Check if Podcast slug is valid
app.get('/validation/slug/:slug', (req, res) => {
  const { slug } = req.params;
  const postList = [];
  Post.find({
    slug,
  })
    .then((posts) => {
      posts.map((post) => {
        postList.push({
          id: post.id,
          type: post.type,
          slug: post.slug,
          category: post.category,
          title: post.title,
          description: post.description,
          tags: post.tags,
          publishedOn: post.publishedOn,
          updateOn: post.updateOn,
        });
      });
      let valid = true;
      if (postList.length > 0) {
        valid = false;
        res.json({
          valid,
        });
      } else if (postList.length === 0) {
        res.json({
          valid,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/set/global-variable', async (req, res) => {
  const {
    type,
    title,
  } = req.body;
  global.gConfigMulter.type = type;
  global.gConfigMulter.title = title;
  global.gConfigMulter.folder_name = global.gConfigMulter.title;
  global.gConfigMulter.destination = `${global.gConfigMulter.type}/${global.gConfigMulter.folder_name}`;
  console.log('global.gConfigMulter.type:', global.gConfigMulter.type);
  console.log('global.gConfigMulter.title:', global.gConfigMulter.title);
  console.log('global.gConfigMulter.destination:', global.gConfigMulter.destination);
  res.status(200).send({
    ok: true,
  });
});

// Update Podcast Info
app.put('/update/:id', (req, res) => {
  const {
    slug,
    category,
    title,
    description,
    tags,
  } = req.body;
  const { id } = req.params;
  console.log('SLUG:', slug);
  Post.updateOne({
    id,
  }, {
    slug,
    category,
    title,
    description,
    tags,
    updatedOn: Date.now(),
  }, {
    runValidators: true,
  })
    .then(() => {
      console.log('res:', {
        msg: 'Podcast details has been successfully updated.',
        id,
        slug,
        category,
        title,
        description,
        tags,
        updated: true,
      });
      res.json({
        msg: 'Podcast details has been successfully updated.',
        id,
        category,
        title,
        description,
        tags,
        updated: true,
      });
    })
    .catch((err) => {
      res.json({
        errorMsg: err,
      });
    });
});

// Delete Podcast
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  Post.deleteOne({
    id,
  }).then(() => {
    res.json({
      msg: ' Blog Post deleted successfully!',
    });
  }).catch((err) => {
    res.json({
      errorMgs: err,
    });
  });
});

app.delete('/delete/cover/:id', async (req, res) => {
  const coverFile = await Post.findById(req.params.id);

  await coverFile.remove();

  return res.send({
    msg: 'Blog Post cover file successfully deleted',
  });
});

module.exports = app;
