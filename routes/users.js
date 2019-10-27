const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Load User model
const User = require("../models/User");

router.get("/all", (req, res) => {
  let users_list = [];
  User.find()
    .then(users => {
      users.map(user => {
        users_list.push({
          name: user.name,
          email: user.email,
          created_on: user.created_on
        });
        console.log(users_list);
      });
      res.json(users_list);
    })
    .catch(err => {
      console.log(err);
    });
  console.log("Get All Users");
});

// Get User
router.post("/user", (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }, (err, user) => {
    console.log("Mongoose user:", user);
    res.status(200).send({
      name: user.name,
      email: user.email,
      created_on: user.created_on
    });
  }).catch(err => console.log(err));
});

module.exports = router;
