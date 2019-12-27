const express = require('express');

const app = express();
const cors = require('cors');
const multer = require('multer');
const multerConfig = require('../../../config/multer');

app.use(cors());

const UserProfileImage = require('../../../models/user/UserProfileImage');

app.post('/verify/su', (req, res) => {
  const {
    user,
    password,
  } = req.body;
  const admin = {
    user: 'admin',
    password: 'admin',
  };
  if (user === admin.user && password === admin.password) {
    res.status(200).send({
      isAdmin: true,
    });
  } else {
    res.status(200).send({
      isAdmin: false,
    });
  }
});

// app.post('/register/admin', (req, res) => {

// });

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

module.exports = app;
