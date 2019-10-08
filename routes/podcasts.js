const express = require("express");
const app = express();
const cors = require("cors");
const uuidv4 = require("uuid/v4");

app.use(cors());

// Load Podcast model
const Podcast = require("../models/podcast/Podcast");

app.get("/", (req, res) => {
	let podcast_list = [];
	Podcast.find()
		.then(podcasts => {
			podcasts.map(podcast => {
				podcast_list.push({
					id: podcast.id,
					type: podcast.type,
					title: podcast.title,
					description: podcast.description,
					tags: podcast.tags,
					filepath: podcast.filepath,
					length: podcast.length,
					uploaded_on: podcast.uploaded_on,
					updated_on: podcast.updated_on
				});
				console.log(podcast_list);
			});
			res.json(podcast_list);
		})
		.catch(err => {
			console.log(err);
		});
	console.log("Get all podcasts");
});

app.post("/upload", (req, res) => {
	const { title, description, tags, filepath, length } = req.body;
	let errors = [];
	if (!title || !description || !tags || !filepath || !length) {
		errors.push({
			errorMsg: "Please enter all fields."
		});
	}

	if (errors.length > 0) {
		console.log("Errors:", errors);
		res.json({
			error: errors
		});
	} else {
		id = uuidv4();
		const type = "podcast";
		const uploaded_on = Date.now();
		const updated_on = null;
		const newPodcast = new Podcast({
			id,
			type,
			title,
			description,
			tags,
			filepath,
			length,
			uploaded_on,
			updated_on
		});
		newPodcast
			.save()
			.then(podcast => {
				res.status(200).send({
					msg: "Podcast successfully uploaded!",
					id,
					type,
					title,
					description,
					tags,
					filepath,
					length,
					uploaded_on,
					updated_on
				});
			})
			.catch(err => {
				res.status(500).send({
					errorMsg: err
				});
			});
	}
});

app.put("update/:", (req, res) => {});

module.exports = app;
