const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const keys = require("./config/providers");
const chalk = require("chalk");
const session = require("express-session");
const process = require("process");

// environment variables
process.env.NODE_ENV = "development";
// process.env.NODE_ENV = "staging";
// process.env.NODE_ENV = "testing";
// process.env.NODE_ENV = "production";

// config variables
const config = require("./config/config.js");

require("dotenv").config();

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once("open", () => {
	console.log("MongoDB Atlas database connection established successfully.");
});

passport.serializeUser((user, cb) => {
	cb(null, user);
});

passport.deserializeUser((user, cb) => {
	cb(null, user);
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
	session({
		secret: "secret",
		resave: true,
		saveUninitialized: true
	})
);

// Routes
// app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
// app.use("/auth", require("./routes/auth/auths"));

// const port = process.env.PORT || 5000;
const port = global.gConfig.node_port;

app.listen(port, () => {
	console.log(`${global.gConfig.app_name} is listening on port: ${port}`);
});
