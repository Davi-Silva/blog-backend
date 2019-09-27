const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	lessons: {
		type: Array
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

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
