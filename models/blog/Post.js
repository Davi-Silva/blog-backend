const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	smallContent: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	created_on: {
		type: Date,
		default: Date.now
	},
	updated_on: {
		type: Date,
		default: null
	}
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
