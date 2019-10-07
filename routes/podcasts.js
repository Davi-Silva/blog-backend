const express = require("express");
const router = express.Router();
const uuidv4 = require("uuid/v4");

// Load Podcast model
const Podcast = require("../models/podcast/Podcast");

router.get("/", (req, res) => {
  let podcast_list = [];
  Podcast.find()
    .then(podcasts => {
      podcasts.map(podcast => {
        podcast_list.push({
          id: podcast.id,
          title: podcast.title,
          description: podcast.description,
          tags: podcast.tags,
          path: podcast.path,
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

router.post("/upload", (req, res) => {
  const { title, description, tags, path, length } = req.body;
  let errors = [];
  if (!title || !description || !tags || !path || !length) {
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
    const uploaded_on = Date.now();
    const updated_on = null;
    const newPodcast = new Podcast({
      id,
      title,
      description,
      tags,
      path,
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
          title,
          description,
          tags,
          path,
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

router.put("update/:", (req, res) => {});

module.exports = router;
