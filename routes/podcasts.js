const express = require("express");
const app = express();
const cors = require("cors");
const uuidv4 = require("uuid/v4");

app.use(cors());

// Load Podcast model
const Podcast = require("../models/podcast/Podcast");

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
					filepath: podcast.filepath,
					length: podcast.length,
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
	Podcast.findOne({ id })
		.then(podcast => {
			res.status(302).send({
				msg: "Requested Podcast has been found.",
				id: podcast.id,
				type: podcast.type,
				category: podcast.category,
				title: podcast.title,
				description: podcast.description,
				tags: podcast.tags,
				filepath: podcast.filepath,
				length: podcast.length,
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
	Podcast.find({ slug })
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
					filepath: podcast.filepath,
					length: podcast.length,
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

// Update Podcast
app.post("/upload", (req, res) => {
	const {
		slug_exists,
		category,
		title,
		description,
		tags,
		filepath,
		length
	} = req.body;
	let errors = [];
	if (!category || !title || !description || !tags || !filepath || !length) {
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
		const id = uuidv4();
		const type = "podcast";
		const uploaded_on = Date.now();
		const updated_on = null;
		const slug = title
			.toLowerCase()
			.split(" ")
			.join("-");

		console.log("Before if");
		if (slug_exists) {
			res.json({
				slug_exists
			});
			return;
		}
		console.log("After if");
		const newPodcast = new Podcast({
			id,
			slug,
			type,
			category,
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
				res.status(201).send({
					msg: "Podcast successfully uploaded!",
					id,
					slug,
					type,
					category,
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
				res.json({
					errorMsg: err
				});
			});
	}
});

// Update Podcast Info
app.put("/update/:id", (req, res) => {
	const { category, title, description, tags, filepath, length } = req.body;
	const id = req.id;
	Podcast.updateOne(
		{
			id
		},
		{
			category,
			title,
			description,
			tags,
			filepath,
			length
		},
		{
			runValidators: true
		}
	)
		.then(() => {
			res.json({
				msg: "Podcast details has been successfully updated.",
				id,
				category,
				title,
				description,
				tags,
				filepath,
				length
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
	const { id } = req.body;
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

module.exports = app;
