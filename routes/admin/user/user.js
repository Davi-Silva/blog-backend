const express = require('express');

const app = express();
const cors = require('cors');

app.use(cors());


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

app.post('/register/admin', (req, res) => {

});

module.exports = app;
