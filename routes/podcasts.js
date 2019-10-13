const express = require("express");
const app = express();
const cors = require("cors");
const uuidv4 = require("uuid/v4");
const multer = require("multer");
const multerConfig = require("../config/multer")

app.use(cors());

// Load Podcast model
const Podcast = require("../models/podcast/Podcast");
const PodcastFile = require("../models/podcast/PodcastFile");

// Get All Podcasts
app.get("/", (req, res) => {
	let podcast_list = [];
	Podcast.find()
		.then(podcasts => {
			podcasts.map(podcast => {
				podcast_list.push({
					id: podcast.id,
					type: podcast.type,
					slug: podcast.slug,
					category: podcast.category,
					title: podcast.title,
					description: podcast.description,
					tags: podcast.tags,
					uploaded_on: podcast.uploaded_on,
					updated_on: podcast.updated_on
				});
				console.log(podcast_list);
			});
			res.status(302).send(podcast_list);
		})
		.catch(err => {
			console.log(err);
		});
	console.log("Getting all podcasts...");
});

// Get Podcast by id
app.get("/:id", (req, res) => {
	const id = req.params.id;
	Podcast.findOne({
			id
		})
		.then(podcast => {
			res.status(302).send({
				msg: "Requested Podcast has been found.",
				id: podcast.id,
				type: podcast.type,
				category: podcast.category,
				title: podcast.title,
				description: podcast.description,
				tags: podcast.tags,
				uploaded_on: podcast.uploaded_on,
				updated_on: podcast.updated_on
			});
		})
		.catch(err => {
			res.json(err);
		});
});

// Get Podcast by slug
app.get("/get/:slug", (req, res) => {
	const slug = req.params.slug;
	let podcast_list = [];
	Podcast.find({
			slug
		})
		.then(podcasts => {
			podcasts.map(podcast => {
				podcast_list.push({
					id: podcast.id,
					type: podcast.type,
					slug: podcast.slug,
					category: podcast.category,
					title: podcast.title,
					description: podcast.description,
					tags: podcast.tags,
					uploaded_on: podcast.uploaded_on,
					updated_on: podcast.updated_on
				});
			});
			res.status(302).send(podcast_list);
		})
		.catch(err => {
			console.log(err);
		});
});

// Check if Podcast slug is valid
app.get("/validation/slug/:slug", (req, res) => {
	const slug = req.params.slug;
	let podcast_list = [];
	Podcast.find({
			slug
		})
		.then(podcasts => {
			podcasts.map(podcast => {
				podcast_list.push({
					id: podcast.id,
					type: podcast.type,
					slug: podcast.slug,
					category: podcast.category,
					title: podcast.title,
					description: podcast.description,
					tags: podcast.tags,
					uploaded_on: podcast.uploaded_on,
					updated_on: podcast.updated_on
				});
			});
			let valid = true;
			if (podcast_list.length > 0) {
				valid = false;
				res.json({
					valid
				});
			} else if (podcast_list.length == 0) {
				res.json({
					valid
				});
			}
		})
		.catch(err => {
			console.log(err);
		});
});

// Update Podcast
app.post("/upload", (req, res) => {
	const {
		isSlugValid,
		category,
		title,
		description,
		tags
	} = req.body;
	let errors = [];
	if (!isSlugValid || !category || !title || !description || !tags) {
		errors.push({
			errorMsg: "Please enter all fields."
		});
	}

	console.log("errors.length:", errors.length)

	if (errors.length > 0) {
		console.log("Errors:", errors);
		res.json({
			error: errors
		});
	} else {
		const id = uuidv4();
		const type = "podcast";
		const uploaded_on = Date.now();
		const updated_on = null;

		console.log("Before if");
		if (isSlugValid) {
			const slug = title
				.toLowerCase()
				.split(" ")
				.join("-");
			const newPodcast = new Podcast({
				id,
				slug,
				type,
				category,
				title,
				description,
				tags,
				uploaded_on,
				updated_on
			});
			newPodcast
				.save()
				.then(podcast => {
					res.status(201).send({
						msg: "Podcast successfully uploaded!",
						id,
						slug,
						type,
						category,
						title,
						description,
						tags,
						uploaded_on,
						updated_on,
						uploaded: true
					});
				})
				.catch(err => {
					res.json({
						errorMsg: err
					});
				});
		} else {
			res.json({
				errorMsg: "Slug is invalid"
			})
		}
	}
});

app.post("/upload/cover", multer(multerConfig).single("file"), async (req, res) => {
	const {
		originalname: name,
		size,
		key,
		location: url = ""
	} = req.file;

	const cover = await PodcastFile.create({
		name,
		size,
		key,
		url
	});

	return res.json(cover);
})

app.post("/upload/audio-file", multer(multerConfig).single("file"), async (req, res) => {
	const {
		originalname: name,
		size,
		key,
		location: url = ""
	} = req.file;

	const audio_file = await PodcastFile.create({
		name,
		size,
		key,
		url
	});

	return res.json(audio_file);
})

// Update Podcast Info
app.put("/update/:id", (req, res) => {
	const {
		category,
		title,
		description,
		tags,

	} = req.body;
	const id = req.id;
	Podcast.updateOne({
			id
		}, {
			category,
			title,
			description,
			tags,
		}, {
			runValidators: true
		})
		.then(() => {
			res.json({
				msg: "Podcast details has been successfully updated.",
				id,
				category,
				title,
				description,
				tags,
			});
		})
		.catch(err => {
			res.json({
				errorMsg: err
			});
		});
});

// Delete Podcast
app.delete("/delete", (req, res) => {
	const {
		id
	} = req.body;
	Podcast.deleteOne({
		id
	}).then(() => {
		res
			.json({
				msg: "Podcast deleted successfully!"
			})
			.catch(err => {
				res.json({
					errorMsg: err
				});
			});
	});
});

app.delete("/delete/audio-file/:id", async (req, res) => {
	const audio_file = await PodcastFile.findById(req.params.id);

	await audio_file.remove();

	return res.send();
});


module.exports = app;