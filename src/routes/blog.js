/* eslint-disable array-callback-return */
const express = require('express');

const app = express();
const router = express.Router()
const cors = require('cors');
const uuidv4 = require('uuid/v4');
const multer = require('multer');
const multerConfig = require('../config/multer');

// const authMiddleware = require('../middleware/auth');

app.use(cors());
// app.use(authMiddleware);
 
const Post = require('../models/blog/Post');
const Comment = require('../models/blog/PostComment')
const PostCover = require('../models/blog/PostCover');
const User = require('../models/user/User');

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
        // console.log('postsList:', posts);
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
    .limit(6)
    .populate('cover')
    .then((posts) => {
      if (posts.lenth === 0) {
        res.status(200).send({
          found: false,
        });
      } else if (posts.length > 0) {
        posts.map((post) => {
          postsList.push({
            id: post.id,
            title: post.title,
            slug: post.slug,
            category: post.category,
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


app.get('/home/main-post', async (req, res) => {
  const postsList = [];
  console.log('/home/main-post');
  Post.find()
    .sort('-howManyRead')
    .limit(5)
    .populate('cover')
    .then((posts) => {
      console.log('post main:', posts);
      if (posts.lenth === 0) {
        res.status(200).send({
          found: false,
        });
      } else if (posts.length > 0) {
        posts.map((post) => {
          postsList.push({
            id: post.id,
            title: post.title,
            slug: post.slug,
            category: post.category,
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


app.get('/home/news', async (req, res) => {
  const postsList = [];
  console.log('userId:', req.userId);
  Post.find({
    type: 'News',
  })
    .sort({ publishedOn: -1 })
    .limit(6)
    .populate('cover')
    .then((posts) => {
      if (posts.lenth === 0) {
        res.status(200).send({
          found: false,
        });
      } else if (posts.length > 0) {
        posts.map((post) => {
          postsList.push({
            id: post.id,
            title: post.title,
            slug: post.slug,
            category: post.category,
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

app.get('/home/most-recent-videos', async (req, res) => {
  const postsList = [];
  console.log('userId:', req.userId);
  Post.find({
    type: 'Video',
  })
    .sort({ publishedOn: -1 })
    .limit(4)
    .populate('cover')
    .then((posts) => {
      if (posts.lenth === 0) {
        res.status(200).send({
          found: false,
        });
      } else if (posts.length > 0) {
        posts.map((post) => {
          postsList.push({
            id: post.id,
            title: post.title,
            slug: post.slug,
            category: post.category,
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

app.get('/home/tutorials', async (req, res) => {
  const postsList = [];
  console.log('userId:', req.userId);
  Post.find({
    type: 'Tutorial',
  })
    .sort({ publishedOn: -1 })
    .limit(6)
    .populate('cover')
    .then((posts) => {
      if (posts.lenth === 0) {
        res.status(200).send({
          found: false,
        });
      } else if (posts.length > 0) {
        posts.map((post) => {
          postsList.push({
            id: post.id,
            title: post.title,
            slug: post.slug,
            category: post.category,
            cover: post.cover,
            category: post.category,
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

app.get('/home/articles', async (req, res) => {
  const postsList = [];
  console.log('userId:', req.userId);
  Post.find({
    type: 'Article',
  })
    .sort({ publishedOn: -1 })
    .limit(6)
    .populate('cover')
    .populate({
      path: 'author',
      populate: {
        path: 'profileImage',
        model: 'UserProfileImage',
      },
    })
    .then((posts) => {
      if (posts.lenth === 0) {
        res.status(200).send({
          found: false,
        });
      } else if (posts.length > 0) {
        posts.map((post) => {
          postsList.push({
            id: post.id,
            title: post.title,
            slug: post.slug,
            category: post.category,
            cover: post.cover,
            author: post.author,
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

app.get('/most/recent/post', async (req, res) => {
  const postsList = [];
  console.log('userId:', req.userId);
  Post.find()
    .sort({ publishedOn: -1 })
    .limit(1)
    .populate('cover')
    .populate({
      path: 'author',
      populate: {
        path: 'profileImage',
        model: 'UserProfileImage',
      },
    })
    .then((posts) => {
      if (posts.lenth === 0) {
        res.status(200).send({
          found: false,
        });
      } else if (posts.length > 0) {
        posts.map((post) => {
          postsList.push({
            id: post.id,
            title: post.title,
            slug: post.slug,
            category: post.category,
            cover: post.cover,
            author: post.author,
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

app.get('/get/top-authors', async (req, res) => {
  User.find()
    .populate('profileImage')
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.json(err);
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

app.post('/get/user/activities', (req, res) => {
  const {
    posts,
  } = req.body;
  console.log('posts:', posts);
  Post.find({ _id: { $in: posts } })
    .populate('cover')
    .sort({ publishedOn: -1 })
    .limit(6)
    .then((activities) => {
      res.status(200).send(activities);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Get Podcast by slug
app.get('/get/slug/:year/:month/:day/:slug', (req, res) => {
  console.log('Getting post by slug');
  const {
    year,
    month,
    day,
    slug,
  } = req.params;

  const fullSlug = `${year}/${month}/${day}/${slug}`;
  const postsList = [];
  Post.find({
    slug: fullSlug,
  }).populate('cover')
    .populate('author')
    .populate({
      path: 'author',
      populate: {
        path: 'profileImage',
        model: 'UserProfileImage',
      },
    })
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
  const pagination = req.query.pagination ? parseInt(req.query.pagination, 10) : 10;
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  console.log('categoy:', category);
  let newCategory;
  if (category.indexOf('-') !== -1) {
    newCategory = category.split('-').join(' ');
  } else if (category.indexOf('-') === -1) {
    newCategory = category;
  }
  Post.find(
    { category: { $regex: `${newCategory}`, $options: 'i' } },
    (err, docs) => {
      console.log('err:', err);
    },
  )
    // .sort({ publishedOn: -1 })
    .skip((page - 1) * pagination)
    .limit(pagination)
    .populate('cover')
    .then((posts) => {
      posts.map((post) => {
        postsList.push({
          title: post.title,
          slug: post.slug,
          category: post.category,
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

app.get('/get/category/newest/:category/:year/:month/:day/:slug', async (req, res) => {
  const {
    year,
    month,
    day,
    slug,
    category,
  } = req.params;

  const fullSlug = `${year}/${month}/${day}/${slug}`;
  let postsList = [];
  console.log('categoy:', category);
  Post.find(
    { category: { $regex: `${category}`, $options: 'i' } },
    (err, docs) => {

    },
  )
    .populate('cover')
    .populate('author')
    .populate({
      path: 'author',
      populate: {
        path: 'profileImage',
        model: 'UserProfileImage',
      },
    })
    .limit(3)
    .then((posts) => {
      posts.map((post) => {
        if (fullSlug !== post.slug) {
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
            author: post.author,
            publishedOn: post.publishedOn,
            updatedOn: post.updatedOn,
          });
        }
      });
      postsList = postsList.reverse();
      // if (postsList.length === 0) {
      //   console.log('EMPTY');
      //   res.json({
      //     found: false,
      //   });
      // }
      if (postsList.length > 4) {
        postsList = postsList.slice(0, 4);
      }
      res.json(postsList);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/comments/', async (req, res) => {
  const {
    postId
  } = req.body;

  console.log('comments:', postId)

  Comment.find({
    post: postId,
  })
    .populate({
      path: 'author',
      populate: {
        path: 'profileImage',
        model: 'UserProfileImage',
      },
    })
    .then((commentsArray) => {
      console.log('commentsArray:', commentsArray)
      res.json(commentsArray)
    })
    .catch((err) => {
      res.json({
        err,
      })
    })

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

app.get('/comments', (req, res) => {
  const {
    postId,
  } = req.query;
  console.log("postId", postId)
});

app.get('/get/tag/:tag', async (req, res) => {
  const { tag } = req.params;
  const pagination = req.query.pagination ? parseInt(req.query.pagination, 10) : 10;
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const postsList = [];
  let newTag;
  if (tag.indexOf('-') !== -1) {
    newTag = tag.split('-').join(' ');
  } else if (tag.indexOf('-') === -1) {
    newTag = tag;
  }
  Post.find({
    tags: newTag,
  })
    .skip((page - 1) * pagination)
    .limit(pagination)
    .sort()
    .populate('cover')
    .then((posts) => {
      if (posts.length === 0) {
        res.status(200).send([]);
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

app.put('/update/post/how-many-read', (req, res) => {
  const {
    slug,
    howManyReadNumber,
  } = req.body;
  Post.updateOne({
    slug,
  }, {
    howManyRead: howManyReadNumber + 1,
  }, {
    runValidators: true,
  })
    .then(() => {
      res.status(200).send({ howManyReadNumber: howManyReadNumber + 1 });
    })
    .catch((err) => {
      console.log(err);
    });
});


module.exports = app;
