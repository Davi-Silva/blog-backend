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

router.get('/public-profile/:username', (req, res) => {
  const { username } = req.params;
  console.log('username:', username);
  User.findOne({
    username,
  })
    .populate('profileImage')
    .then((userInfo) => {
      console.log('userInfo:', userInfo);
      res.json(userInfo);
    })
    .catch((err) => {
      console.log(err);
    });
});


router.put('/update', (req, res) => {
  const { userId } = req.body;
  let {
    quote,
    email,
    github,
    linkedin,
    twitter,
  } = req.body;

  if (quote === undefined) {
    quote = '';
  }
  if (email === undefined) {
    email = '';
  }
  if (github === undefined) {
    github = '';
  }
  if (linkedin === undefined) {
    linkedin = '';
  }
  if (twitter === undefined) {
    twitter = '';
  }

  User.updateOne({
    _id: userId,
  }, {
    quote,
    email,
    socialMedia: {
      github,
      linkedin,
      twitter,
    },
  }, {
    runValidators: true,
  })
    .then(() => {
      res.status(200).send({
        quote,
        email,
        github,
        linkedin,
        twitter,
      });
    })
    .catch((err) => {
      res.json({
        updated: false,
        err,
      });
    });
});

router.post('/verify/following/author', async (req, res) => {
  const {
    userId,
    authorId,
  } = req.body;

  const user = await User.findOne({ _id: userId });
  console.log('user.following:', user.following)
  console.log('user.followers:', user.followers)
  res.json({
    following: user.followers.indexOf(authorId),
    followers: user.following.indexOf(authorId),
  });
});

router.put('/update/follow/author', async (req, res) => {
  const {
    userId,
    authorId,
  } = req.body;
  console.log('userId:', userId)
  console.log('authorId:', authorId)
  const user = await User.findOne({ _id: userId });
  const author = await User.findOne({ _id: authorId });

  const userFollowingArray = user.following;
  const authorFollowersArray = author.followers;
  userFollowingArray.push(authorId);
  authorFollowersArray.push(userId);
  console.log("userFollowingArray:", userFollowingArray)
  console.log("authorFollowersArray:", authorFollowersArray)
  await User.updateOne({
    _id: userId,
  }, {
    following: userFollowingArray,
  }, {
    runValidators: true,
  })
    .then(() => {
      isFollowing = true;
    })
    .catch((err) => {
      res.json({
        updated: false,
        err,
      });
    });

  await User.updateOne({
    _id: authorId,
  }, {
    followers: authorFollowersArray,
  }, {
    runValidators: true,
  })
    .then(() => {
      isFollowers = true;
    })
    .catch((err) => {
      res.json({
        updated: false,
        err,
      });
    });

  res.status(200).send({
    authorId,
  });
});

router.put('/update/unfollow/author', async (req, res) => {
  const {
    userId,
    authorId,
  } = req.body;
  console.log('userId:', userId)
  console.log('authorId:', authorId)
  console.log('unfollowing...')
  const user = await User.findOne({ _id: userId });
  const author = await User.findOne({ _id: authorId });

  let userFollowingArray = user.following;
  let authorFollowersArray = author.followers;
  console.log("BEFORE userFollowingArray:", userFollowingArray)
  console.log("BEFORE authorFollowersArray:", authorFollowersArray)
  userFollowingArray = userFollowingArray.splice(userFollowingArray.indexOf(userId))
  authorFollowersArray = authorFollowersArray.splice(authorFollowersArray.indexOf(authorId))
  console.log("AFTER userFollowingArray:", userFollowingArray)
  console.log("AFTER authorFollowersArray:", authorFollowersArray)
  // await User.updateOne({
  //   _id: userId,
  // }, {
  //   following: userFollowingArray,
  // }, {
  //   runValidators: true,
  // })
  //   .then(() => {
  //     isFollowing = true;
  //   })
  //   .catch((err) => {
  //     res.json({
  //       updated: false,
  //       err,
  //     });
  //   });

  // await User.updateOne({
  //   _id: authorId,
  // }, {
  //   followers: authorFollowersArray,
  // }, {
  //   runValidators: true,
  // })
  //   .then(() => {
  //     isFollowers = true;
  //   })
  //   .catch((err) => {
  //     res.json({
  //       updated: false,
  //       err,
  //     });
  //   });

  res.status(200).send({
    authorId,
  });
});


module.exports = router;
