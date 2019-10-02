const FacebookStrategy = require("passport-facebook").Strategy;
const AmazonStrategy = require("passport-amazon").Strategy;
const GithubStrategy = require("passport-github").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const InstagramStrategy = require("passport-instagram").Strategy;
const SpotifyStrategy = require("passport-spotify").Strategy;
const TwitchStrategy = require("passport-twitch.js").Strategy;
export let user = {};

// Facebook Strategy
passport.use(
	new FacebookStrategy(
		{
			clientID: keys.FACEBOOK.clientID,
			clientSecret: keys.FACEBOOK.clientSecret,
			callbackURL:
				"https://davi-silva-blog-backend.herokuapp.com/auth/facebook/callback"
		},
		(accessToken, refreshToken, profile, cb) => {
			console.log(chalk.blue(JSON.stringify(profile)));
			user = { ...profile };
			return cb(null, profile);
		}
	)
);

// Amazon Strategy
passport.use(
	new AmazonStrategy(
		{
			clientID: keys.AMAZON.clientID,
			clientSecret: keys.AMAZON.clientSecret,
			callbackURL:
				"https://davi-silva-blog-backend.herokuapp.com/auth/amazon/callback"
		},
		(accessToken, refreshToken, profile, cb) => {
			console.log(chalk.blue(JSON.stringify(profile)));
			user = { ...profile };
			return cb(null, profile);
		}
	)
);

// Github Strategy
passport.use(
	new GithubStrategy(
		{
			clientID: keys.GITHUB.clientID,
			clientSecret: keys.GITHUB.clientSecret,
			callbackURL:
				"https://davi-silva-blog-backend.herokuapp.com/auth/github/callback"
		},
		(accessToken, refreshToken, profile, cb) => {
			console.log(chalk.blue(JSON.stringify(profile)));
			user = { ...profile };
			return cb(null, profile);
		}
	)
);

// Google Strategy
passport.use(
	new GoogleStrategy(
		{
			clientID: keys.GOOGLE.clientID,
			clientSecret: keys.GOOGLE.clientSecret,
			callbackURL:
				"https://davi-silva-blog-backend.herokuapp.com/auth/google/callback"
		},
		(accessToken, refreshToken, profile, cb) => {
			console.log(chalk.blue(JSON.stringify(profile)));
			console.log("accessToken: ", accessToken);
			console.log("refreshToken:", refreshToken);
			user = { ...profile };
			return cb(null, profile);
		}
	)
);

// Instagram Strategy
passport.use(
	new InstagramStrategy(
		{
			clientID: keys.INSTAGRAM.clientID,
			clientSecret: keys.INSTAGRAM.clientSecret,
			callbackURL:
				"https://davi-silva-blog-backend.herokuapp.com/auth/instagram/callback"
		},
		(accessToken, refreshToken, profile, cb) => {
			console.log(chalk.blue(JSON.stringify(profile)));
			user = { ...profile };
			return cb(null, profile);
		}
	)
);

// Spotify Strategy
passport.use(
	new SpotifyStrategy(
		{
			clientID: keys.SPOTIFY.clientID,
			clientSecret: keys.SPOTIFY.clientSecret,
			callbackURL:
				"https://davi-silva-blog-backend.herokuapp.com/auth/spotify/callback"
		},
		(accessToken, refreshToken, profile, cb) => {
			console.log(chalk.blue(JSON.stringify(profile)));
			user = { ...profile };
			return cb(null, profile);
		}
	)
);

// Twitch Strategy
passport.use(
	new TwitchStrategy(
		{
			clientID: keys.TWITCH.clientID,
			clientSecret: keys.TWITCH.clientSecret,
			callbackURL:
				"https://davi-silva-blog-backend.herokuapp.com/auth/twitch/callback"
		},
		(accessToken, refreshToken, profile, cb) => {
			console.log(chalk.blue(JSON.stringify(profile)));
			user = { ...profile };
			return cb(null, profile);
		}
	)
);
