const express = require('express');

const app = express();
const cors = require('cors');
const uuidv4 = require('uuid/v4');
const multer = require('multer');
const multerConfig = require('../../../config/multer');

app.use(cors());

const UserProfileImage = require('../../../models/user/UserProfileImage');
const User = require('../../../models/user/User');

app.post('/verify/su', (req, res) => {
  const {
    user,
    password,
  } = req.body;
  const su = {
    user: 'su',
    password: 'su',
  };
  if (user === su.user && password === su.password) {
    res.status(200).send({
      isSU: true,
    });
  } else {
    res.status(200).send({
      isSU: false,
    });
  }
});

app.get('/verify/admin/username/:username', (req, res) => {
  const { username } = req.params;
  console.log('username:', username);
  let valid = true;
  User.find({
    username,
  })
    .then((users) => {
      console.log('users:', users);
      if (users.length > 0) {
        valid = false;
      }
      res.json({
        valid,
      });
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
});

app.post('/register/admin', (req, res) => {
  const {
    user,
    password,
  } = req.body;
  const errors = [];
  if (!user || !password) {
    errors.push({
      errorMsg: 'Please enter all fields.',
    });
  }

  if (errors.length > 0) {
    res.json({
      error: errors,
    });
  } else {
    const id = uuidv4();
    const newUser = new User({
      id,
      name: '',
      username: user,
      email: '',
      password,
      isAdmin: true,
      origin: 'Local',
    });
    newUser
      .save()
      .then(() => {
        res.status(200).send({
          msg: 'New admin user has been successfully created.',
          id,
        });
      });
  }
});

app.post('/upload/profile-image', multer(multerConfig).single('file'), async (req, res) => {
  const {
    originalname: name,
    size,
    key,
    location: url = '',
  } = req.file;
  const id = uuidv4();
  console.log('id:', id);

  const profileImage = await UserProfileImage.create({
    id,
    name,
    size,
    key,
    url,
  });

  return res.json(profileImage);
});

app.put('/post/to/author', (req, res) => {
  const {
    userId,
    postsArray,
  } = req.body;
  console.log('userId author:', userId);
  console.log('postsArray:', postsArray);
  let user;
  User.updateOne({
    _id: userId,
  }, {
    posts: postsArray,
  }, {
    runValidators: true,
  })
    .then(() => {
      res.status(200);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = app;
