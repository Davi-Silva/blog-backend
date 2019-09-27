const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Load User model
const User = require("../models/User");

module.exports = function(passport) {
	passport.use(
		new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
			// Match user
			User.findOne({
				email: email
			}).then(user => {
				console.log("Trying to find a user on mongodb");
				if (!user) {
					console.log("User not found!");
					return done(null, false, {
						message: "That email is not registered"
					});
				}

				// Match password
				bcrypt.compare(password, user.password, (err, isMatch) => {
					console.log("Comparing encrypted passwords");
					if (err) throw err;
					if (isMatch) {
						console.log("Password matched");
						return done(null, user);
					} else {
						console.log("Password did not matched");
						return done(null, false, {
							message: "Password incorrect"
						});
					}
				});
			});
		})
	);

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
};
