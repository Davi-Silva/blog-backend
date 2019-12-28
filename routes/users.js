const express = require('express');

const router = express.Router();
// const bcrypt = require('bcryptjs');
// const passport = require('passport');

// Load User model
const User = require('../models/user/User');

const user = {};

router.get('/all', (req, res) => {
  const usersList = [];
  User.find()
    .populate('profileImage')
    .then((users) => {
      users.map((user) => {
        usersList.push({
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          profileImage: user.profileImage,
          isAdmin: user.isAdmin,
          origin: user.origin,
          createdOn: user.createdOn,
        });
        console.log(usersList);
      });
      res.json(usersList);
    })
    .catch((err) => {
      console.log(err);
    });
  console.log('Get All Users');
});

// Get User
router.post('/user', (req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (err, user) => {
    console.log('Mongoose user:', user);
    res.status(200).send({
      name: user.name,
      email: user.email,
      created_on: user.created_on,
    });
  }).catch((err) => console.log(err));
});

module.exports = router;
