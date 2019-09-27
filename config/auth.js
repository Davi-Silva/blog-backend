module.exports = {
	ensureAuthenticated: function(req, res, next) {
		if (req.isAuthenticated()) {
			console.log("Is Authencated");
			return next();
		}
		// console.log("Is NOT Authencated")
		req.flash("error_msg", "Please log in to view that resource");
		res.redirect("/users/login");
	},
	forwardAuthenticated: function(req, res, next) {
		if (!req.isAuthenticated()) {
			console.log("Is NOT Authencated");
			return next();
		}
		res.redirect("/dashboard");
	}
};
