const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Load User model
const User = require("../models/User");
const { forwardAuthenticated } = require("../config/auth");

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

// Login Page
router.get("/login", forwardAuthenticated, () => {
	console.log("Login Page GET");
});

// Register Page
router.get("/register", forwardAuthenticated, () =>
	console.log("Register Page GET")
);

// Register
router.post("/register", (req, res) => {
	const { name, email, password, password2 } = req.body;
	let errors = [];

	if (!name || !email || !password || !password2) {
		errors.push({ msg: "Please enter all fields" });
	}

	if (password != password2) {
		errors.push({ msg: "Passwords do not match" });
	}

	if (password.length < 6) {
		errors.push({ msg: "Password must be at least 6 characters" });
	}

	if (errors.length > 0) {
		console.log("Errors: ", errors);
		res.json({
			errors: errors
		});
	} else {
		User.findOne({ email: email }).then(user => {
			if (user) {
				errors.push({ msg: "Email already exists" });
				res.json(errors);
			} else {
				const newUser = new User({
					name,
					email,
					password
				});

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if (err) throw err;
						newUser.password = hash;
						newUser
							.save()
							.then(user => {
								req.flash(
									"success_msg",
									"You are now registered and can log in"
								);
								res.status(200).send({
									msg: "User successfully registered",
									name: user.name,
									email: user.email,
									password: user.password,
									password2: user.password2
								});
							})
							.catch(err => console.log(err));
					});
				});
			}
		});
	}
});

// Login
router.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/dashboard",
		failureRedirect: "/users/login",
		failureFlash: true
	})(req, res, next);
	// passport.authenticate("local", (err, user, info) => {
	//     console.log("err:", err);
	//     console.log("user:", user);
	//     console.log("info:", info);
	// })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success_msg", "You are logged out");
	res.redirect("/users/login");
});

module.exports = router;
