const express = require("express");
const router = express.Router();

import user from "./strategies";

app.get("/facebook", passport.authenticate("facebook"));
app.get("/facebook/callback", passport.authenticate("facebook"), (req, res) => {
	// res.redirect("http://localhost:3000/profile");
	res.redirect("https://davi-silva-blog-frontend.herokuapp.com/profile");
});

app.get(
	"/amazon",
	passport.authenticate("amazon", {
		scope: ["profile"]
	})
);
app.get("/amazon/callback", passport.authenticate("amazon"), (req, res) => {
	// res.redirect("http://localhost:3000/profile");
	res.redirect("https://davi-silva-blog-frontend.herokuapp.com/profile");
});

app.get("/github", passport.authenticate("github"));
app.get("/github/callback", passport.authenticate("github"), (req, res) => {
	// res.redirect("http://localhost:3000/profile");
	res.redirect("https://davi-silva-blog-frontend.herokuapp.com/profile");
});

app.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "email"]
	})
);
app.get("/google/callback", passport.authenticate("google"), (req, res) => {
	console.log("Google Profile Info", req.profile);
	// res.redirect("http://localhost:3000/profile");
	res.redirect("https://davi-silva-blog-frontend.herokuapp.com/profile");
});

app.get("/instagram", passport.authenticate("instagram"));
app.get(
	"/instagram/callback",
	passport.authenticate("instagram"),
	(req, res) => {
		// res.redirect("http://localhost:3000/profile");
		res.redirect("https://davi-silva-blog-frontend.herokuapp.com/profile");
	}
);

app.get("/spotify", passport.authenticate("spotify"));
app.get("/spotify/callback", passport.authenticate("spotify"), (req, res) => {
	// res.redirect("http://localhost:3000/profile");
	res.redirect("https://davi-silva-blog-frontend.herokuapp.com/profile");
});

app.get("/twitch", passport.authenticate("twitch.js"));
app.get("/twitch/callback", passport.authenticate("twitch.js"), (req, res) => {
	// res.redirect("http://localhost:3000/profile");
	res.redirect("https://davi-silva-blog-frontend.herokuapp.com/profile");
});

app.get("/user", (req, res) => {
	console.log("getting user data!");
	console.log("user:", user);
	res.send(user);
});

app.get("/logout", (req, res) => {
	console.log("logging out!");
	user = {};
	// res.redirect("http://localhost:3000");
	res.redirect("https://davi-silva-blog-frontend.herokuapp.com");
});
