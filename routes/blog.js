/* eslint-disable array-callback-return */
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
  const pagination = req.query.pagination ? parseInt(req.query.pagination, 10) : 10;
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const postsList = [];
  Post.find()
    .skip((page - 1) * pagination)
    .limit(pagination)
    .populate('cover')
    .then((posts) => {
      if (posts.length === 0) {
        res.status(200).send({
          found: false,
        });
      } else if (posts.length > 0) {
        posts.map((post) => postsList.push({
          id: post.id,
          title: post.title,
          category: post.category,
          content: post.content,
          slug: post.slug,
          cover: post.cover,
          type: post.type,
          author: post.author,
          publishedOn: post.publishedOn,
          updateOn: post.updateOn,
        }));
        console.log('postsList:', posts);
        res.status(302).send(postsList);
      }
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
});

app.get('/short', async (req, res) => {
  const pagination = req.query.pagination ? parseInt(req.query.pagination, 10) : 10;
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const postsList = [];
  Post.find()
    .sort({ publishedOn: -1 })
    .skip((page - 1) * pagination)
    .limit(pagination)
    .populate('cover')
    .then((posts) => {
      if (posts.lenth === 0) {
        res.status(200).send({
          found: false,
        });
      } else if (posts.length > 0) {
        posts.map((post) => {
          postsList.push({
            title: post.title,
            slug: post.slug,
            cover: post.cover,
            publishedOn: post.publishedOn,
            updateOn: post.updateOn,
          });
        });

        res.status(302).send(postsList);
      }
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

// Get Podcast by slug
app.get('/get/slug/:slug', (req, res) => {
  console.log('Getting post by slug');
  const { slug } = req.params;
  console.log('slug:', slug);
  const postsList = [];
  Post.find({
    slug,
  }).populate('cover')
    .then((posts) => {
      posts.map((post) => {
        postsList.push({
          id: post.id,
          type: post.type,
          slug: post.slug,
          category: post.category,
          title: post.title,
          content: post.content,
          tags: post.tags,
          uploadedOn: post.uploadedOn,
          updatedOn: post.updatedOn,
        });
      });
      res.status(302).send(posts);
    })
    .catch((err) => {
      res.json({
        found: false,
        error: err,
      });
    });
});

app.get('/get/category/:category', async (req, res) => {
  const { category } = req.params;
  const postsList = [];
  console.log('categoy:', category);
  Post.find(
    { category: { $regex: `${category}`, $options: 'i' } },
    (err, docs) => {

    },
  )
    .sort({ publishedOn: -1 })
    .populate('cover')
    .then((posts) => {
      posts.map((post) => {
        postsList.push({
          title: post.title,
          slug: post.slug,
          cover: post.cover,
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

app.get('/get/category/newest/:slug/:category', async (req, res) => {
  const { slug, category } = req.params;
  let postsList = [];
  console.log('categoy:', category);
  Post.find(
    { category: { $regex: `${category}`, $options: 'i' } },
    (err, docs) => {

    },
  )
    .populate('cover')
    .then((posts) => {
      console.log('posts:', posts);
      posts.map((post) => {
        if (slug !== post.slug) {
          postsList.push({
            id: post.id,
            type: post.type,
            slug: post.slug,
            category: post.category,
            title: post.title,
            description: post.description,
            tags: post.tags,
            audioFile: post.audioFile,
            cover: post.cover,
            uploadedOn: post.uploadedOn,
            updatedOn: post.updatedOn,
          });
        }
      });
      postsList = postsList.reverse();
      if (postsList.length === 0) {
        console.log('EMPTY');
        res.status(200).send({
          found: false,
        });
      }
      if (postsList.length > 4) {
        postsList = postsList.slice(0, 4);
      }
      res.status(302).send(postsList);
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
});

app.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  console.log('category:', category);
  const postsList = [];
  Post.find({
    category,
  })
    .then((posts) => {
      console.log('posts latest:', posts);
      posts.map((post) => {
        postsList.push({
          title: post.title,
          slug: post.slug,
          cover: post.cover,
          publishedOn: post.publishedOn,
          updateOn: post.updateOn,
        });
      });
      res.status(200).send(postsList);
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
});

app.get('/get/categories/newest/:number', async (req, res) => {
  const { number } = req.params;
  const postsList = [];
  Post.find()
    .sort({ publishedOn: -1 })
    .then((posts) => {
      posts.map((post) => {
        postsList.push(post.category);
      });
      const uniquePostsList = postsList.filter((v, i, a) => a.indexOf(v) === i);
      res.status(302).send(uniquePostsList.splice(0, number));
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
});

app.get('/get/tag/:tag', async (req, res) => {
  const { tag } = req.params;
  const pagination = req.query.pagination ? parseInt(req.query.pagination, 10) : 10;
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const postsList = [];
  Post.find({
    tags: tag,
  })
    .skip((page - 1) * pagination)
    .limit(pagination)
    .sort()
    .populate('cover')
    .then((posts) => {
      if (posts.length === 0) {
        res.status(200).send({
          found: false,
        });
      } else if (posts.length > 0) {
        posts.map((post) => {
          postsList.push({
            title: post.title,
            slug: post.slug,
            coverUrl: post.cover.url,
            publishedOn: post.publishedOn,
          });
        });
        res.status(302).send(postsList);
      }
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
    content,
    cover,
    author,
  } = req.body;
  console.log('tags:', tags);

  const errors = [];
  if (!isSlugValid
    || !category
    || tags.length === 0
    || !title
    || !slug
    || !content
    || !author) {
    errors.push({
      errorMsg: 'Please enter all fields.',
    });
  }
  console.log('errors.length:', errors.length);
  if (errors.length > 0) {
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
        cover,
        tags,
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
      console.log('posts:', postList);
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
    content,
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
    content,
    tags,
    updatedOn: Date.now(),
  }, {
    runValidators: true,
  })
    .then((post) => {
      console.log('res:', {
        msg: 'Post details has been successfully updated.',
        id,
        slug,
        category,
        title,
        content,
        tags,
        updated: true,
        updatedOn: post.updatedOn,
      });
      res.json({
        msg: 'Post details has been successfully updated.',
        id,
        category,
        title,
        content,
        tags,
        updated: true,
        updatedOn: post.updatedOnOn,
      });
    })
    .catch((err) => {
      res.json({
        errorMsg: err,
      });
    });
});

app.post('/upload/cover', multer(multerConfig).single('file'), async (req, res) => {
  const {
    originalname: name,
    size,
    key,
    location: url = '',
  } = req.file;
  const id = uuidv4();
  console.log('id:', id);
  const cover = await Post.create({
    id,
    name,
    size,
    key,
    url,
  });

  return res.json(cover);
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
