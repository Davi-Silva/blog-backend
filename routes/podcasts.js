const express = require("express");
const app = express();
const cors = require("cors");
const uuidv4 = require("uuid/v4");
const multer = require("multer");
const multerConfig = require("../config/multer")

app.use(cors());

// Load Podcast model
const Podcast = require("../models/podcast/Podcast");
const PodcastAudioFile = require("../models/podcast/PodcastAudioFile");
const PodcastCover = require("../models/podcast/PodcastCover");

const configMulter = require("../config/multerConfig");

// Get All Podcasts
app.get("/", (req, res) => {
	console.log("Listing all podcasts")
	console.log("global.gConfigMulter.folderName:", global.gConfigMulter.folderName);
	global.gConfigMulter.folderName = "Novo destinado"
	console.log("global.gConfigMulter.folderName:", global.gConfigMulter.folderName);
	let podcast_list = [];
	Podcast.find().populate("audio_file").populate("cover")
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
					audio_file: podcast.audio_file,
					cover: podcast.cover,
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

app.get("/audio", async (req, res) => {
	const {
		title
	} = req.params.title;

	const podcastFile = await PodcastAudioFile.find({
		title
	});

	return res.json(podcastFile);
});

app.get("/cover", async (req, res) => {
	const {
		title
	} = req.params.title;

	const podcastCover = await PodcastCover.find({
		title
	});

	return res.json(podcastCover);
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
	console.log("Getting podcast by slug")
	const slug = req.params.slug;
	console.log("slug:", slug)
	let podcast_list = [];
	Podcast.find({
			slug
		}).populate("audio_file").populate("cover")
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
			res.status(302).send(podcasts);
		})
		.catch(err => {
			res.json({
				found: false
			});
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
		tags,
		audio_file,
		cover
	} = req.body;
	console.log("audio_file:", audio_file)
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
		const type = "Podcast";
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
				audio_file,
				cover,
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
						audio_file,
						cover,
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

	const cover = await PodcastCover.create({
		name,
		size,
		key,
		url
	});

	return res.json(cover);
})

app.post("/upload/audio", multer(multerConfig).single("file"), async (req, res) => {

	const {
		originalname: name,
		size,
		key,
		location: url = ""
	} = req.file;

	const audio_file = await PodcastAudioFile.create({
		name,
		size,
		key,
		url
	});

	return res.json(audio_file);
})

app.post("/set/global-variable", async (req, res) => {
	let {
		type,
		title
	} = req.body;
	global.gConfigMulter.type = type;
	global.gConfigMulter.podcast_title = title;
	global.gConfigMulter.folder_name = global.gConfigMulter.podcast_title
	global.gConfigMulter.destination = `${global.gConfigMulter.type}/${global.gConfigMulter.folder_name}`
	console.log("global.gConfigMulter.type:", global.gConfigMulter.type);
	console.log("global.gConfigMulter.podcast_title:", global.gConfigMulter.podcast_title)
	console.log("global.gConfigMulter.destination:", global.gConfigMulter.destination);
	res.status(200).send({
		ok: true
	});
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
app.delete("/delete/:id", (req, res) => {
	const id = req.params.id;
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

app.delete("/delete/audio/:id", async (req, res) => {
	const audio_file = await PodcastAudioFile.findById(req.params.id);

	await audio_file.remove();

	return res.send();
});

app.delete("/delete/cover/:id", async (req, res) => {
	const cover_file = await PodcastCover.findById(req.params.id);

	await cover_file.remove();

	return res.send();
});


module.exports = app;