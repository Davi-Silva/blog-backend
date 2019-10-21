const mongoose = require("mongoose");

const PodcastSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	tags: {
		type: String,
		required: false
	},
	audio_file: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "PodcastAudioFile",
		required: true
	},
	// cover: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	ref: "PodcastCover",
	// 	required: true
	// },
	uploaded_on: {
		type: Date,
		default: Date.now,
		required: true
	},
	updated_on: {
		type: Date,
		default: null,
		required: false
	}
});

const Podcast = mongoose.model("Podcast", PodcastSchema);

module.exports = Podcast;