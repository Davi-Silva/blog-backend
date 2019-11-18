const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const AmazonStrategy = require('passport-amazon').Strategy;
const GithubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;
const TwitchStrategy = require('passport-twitch.js').Strategy;
const chalk = require('chalk');
const session = require('express-session');
const process = require('process');
const keys = require('./config/providers');

let user = {};
// environment variables
process.env.NODE_ENV = 'development';
// process.env.NODE_ENV = "staging";
// process.env.NODE_ENV = "testing".;
// process.env.NODE_ENV = "production";

// config variables
const config = require('./config/config.js');

require('dotenv').config();

const uri = process.env.ATLAS_URI;

// Set up a whitelist and check against it:
const whitelist = ['https://cryptic-activist-frontend.herokuapp.com/', 'http://cryptic-activist-frontend.herokuapp.com/', 'http://cryptic-activist-backend.herokuapp.com/', 'https://cryptic-activist-backend.herokuapp.com/'];
const corsOptions = {
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const app = express();
// Allowing only the domain contained in the corsOptions object
// app.use(cors(corsOptions));
app.use(cors());

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const { connection } = mongoose;
connection.once('open', () => {
  console.log('MongoDB Atlas database connection established successfully.');
});

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// Facebook Strategy
passport.use(
  new FacebookStrategy({
    clientID: keys.FACEBOOK.clientID,
    clientSecret: keys.FACEBOOK.clientSecret,
    callbackURL: 'https://cryptic-activist-backend.herokuapp.com/auth/facebook/callback',
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(chalk.blue(JSON.stringify(profile)));
    user = {
      ...profile,
    };
    return cb(null, profile);
  }),
);

// Amazon Strategy
passport.use(
  new AmazonStrategy({
    clientID: keys.AMAZON.clientID,
    clientSecret: keys.AMAZON.clientSecret,
    callbackURL: 'https://cryptic-activist-backend.herokuapp.com/auth/amazon/callback',
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(chalk.blue(JSON.stringify(profile)));
    user = {
      ...profile,
    };
    return cb(null, profile);
  }),
);

// Github Strategy
passport.use(
  new GithubStrategy({
    clientID: keys.GITHUB.clientID,
    clientSecret: keys.GITHUB.clientSecret,
    callbackURL: 'https://cryptic-activist-backend.herokuapp.com/auth/github/callback',
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(chalk.blue(JSON.stringify(profile)));
    user = {
      ...profile,
    };
    return cb(null, profile);
  }),
);

// Google Strategy
passport.use(
  new GoogleStrategy({
    clientID: keys.GOOGLE.clientID,
    clientSecret: keys.GOOGLE.clientSecret,
    callbackURL: 'https://cryptic-activist-backend.herokuapp.com/auth/google/callback',
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(chalk.blue(JSON.stringify(profile)));
    console.log('accessToken: ', accessToken);
    console.log('refreshToken:', refreshToken);
    user = {
      ...profile,
    };
    return cb(null, profile);
  }),
);

// Instagram Strategy
passport.use(
  new InstagramStrategy({
    clientID: keys.INSTAGRAM.clientID,
    clientSecret: keys.INSTAGRAM.clientSecret,
    callbackURL: 'https://cryptic-activist-backend.herokuapp.com/auth/instagram/callback',
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(chalk.blue(JSON.stringify(profile)));
    user = {
      ...profile,
    };
    return cb(null, profile);
  }),
);

// Spotify Strategy
passport.use(
  new SpotifyStrategy({
    clientID: keys.SPOTIFY.clientID,
    clientSecret: keys.SPOTIFY.clientSecret,
    callbackURL: 'https://cryptic-activist-backend.herokuapp.com/auth/spotify/callback',
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(chalk.blue(JSON.stringify(profile)));
    user = {
      ...profile,
    };
    return cb(null, profile);
  }),
);

// Twitch Strategy
passport.use(
  new TwitchStrategy({
    clientID: keys.TWITCH.clientID,
    clientSecret: keys.TWITCH.clientSecret,
    callbackURL: 'https://cryptic-activist-backend.herokuapp.com/auth/twitch/callback',
  },
  (accessToken, refreshToken, profile, cb) => {
    console.log(chalk.blue(JSON.stringify(profile)));
    user = {
      ...profile,
    };
    return cb(null, profile);
  }),
);

app.use(express.json());
app.use(passport.initialize());

// Bodyparser
app.use(express.urlencoded({
  extended: false,
}));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }),
);


app.use(morgan('dev'));
app.use(
  '/files',
  express.static(path.resolve(__dirname, '.', 'tmp', 'uploads')),
);


// Routes
// app.use("/", require("./routes/index"));
app.use('/users', require('./routes/users'));
app.use('/podcasts', require('./routes/podcasts'));
app.use('/courses', require('./routes/courses'));
app.use('/blog', require('./routes/blog'));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook'),
  (req, res) => {
    // res.redirect("http://localhost:3000/profile");
    res.redirect('https://cryptic-activist-frontend.herokuapp.com/profile');
  },
);

app.get(
  '/auth/amazon',
  passport.authenticate('amazon', {
    scope: ['profile'],
  }),
);
app.get(
  '/auth/amazon/callback',
  passport.authenticate('amazon'),
  (req, res) => {
    // res.redirect("http://localhost:3000/profile");
    res.redirect('https://cryptic-activist-frontend.herokuapp.com/profile');
  },
);

app.get('/auth/github', passport.authenticate('github'));
app.get(
  '/auth/github/callback',
  passport.authenticate('github'),
  (req, res) => {
    // res.redirect("http://localhost:3000/profile");
    res.redirect('https://cryptic-activist-frontend.herokuapp.com/profile');
  },
);

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);
app.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    console.log('Google Profile Info', req.profile);
    // res.redirect("http://localhost:3000/profile");
    res.redirect('https://cryptic-activist-frontend.herokuapp.com/profile');
  },
);

app.get('/auth/instagram', passport.authenticate('instagram'));
app.get(
  '/auth/instagram/callback',
  passport.authenticate('instagram'),
  (req, res) => {
    // res.redirect("http://localhost:3000/profile");
    res.redirect('https://cryptic-activist-frontend.herokuapp.com/profile');
  },
);

app.get('/auth/spotify', passport.authenticate('spotify'));
app.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify'),
  (req, res) => {
    // res.redirect("http://localhost:3000/profile");
    res.redirect('https://cryptic-activist-frontend.herokuapp.com/profile');
  },
);

app.get('/auth/twitch', passport.authenticate('twitch.js'));
app.get(
  '/auth/twitch/callback',
  passport.authenticate('twitch.js'),
  (req, res) => {
    // res.redirect("http://localhost:3000/profile");
    res.redirect('https://cryptic-activist-frontend.herokuapp.com/profile');
  },
);

app.get('/user', (req, res) => {
  console.log('getting user data!');
  console.log('user:', user);
  res.send(user);
});

app.get('/auth/logout', (req, res) => {
  console.log('logging out!');
  user = {};
  // res.redirect("http://localhost:3000");
  res.redirect('https://cryptic-activist-frontend.herokuapp.com');
});

// const port = process.env.PORT || 5000;
const port = process.env.PORT || global.gConfig.node_port;

app.listen(port, () => {
  console.log(`${global.gConfig.app_name} is listening on port: ${port}`);
});
