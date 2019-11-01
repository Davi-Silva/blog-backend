const express = require('express');

const app = express();
const cors = require('cors');
const uuidv4 = require('uuid/v4');
const multer = require('multer');
const multerConfig = require('../config/multer');

app.use(cors());

// Load Podcast model
const Podcast = require('../models/podcast/Podcast');
const PodcastAudioFile = require('../models/podcast/PodcastAudioFile');
const PodcastCover = require('../models/podcast/PodcastCover');

// const configMulter = require('../config/multerConfig');

// Get All Podcasts
app.get('/', (req, res) => {
  global.gConfigMulter.folderName = 'Novo destinado';
  const podcastList = [];
  Podcast.find().populate('audio_file').populate('cover')
    .then((podcasts) => {
      podcasts.map((podcast) => podcastList.push({
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
        updated_on: podcast.updated_on,
      }));
      res.status(302).send(podcastList);
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
});

app.get('/audio', async (req, res) => {
  const {
    title,
  } = req.params.title;

  const podcastFile = await PodcastAudioFile.find({
    title,
  });

  return res.json(podcastFile);
});

app.get('/cover', async (req, res) => {
  const {
    title,
  } = req.params.title;

  const podcastCover = await PodcastCover.find({
    title,
  });

  return res.json(podcastCover);
});

// Get Podcast by id
app.get('/:id', (req, res) => {
  const { id } = req.params;
  Podcast.findOne({
    id,
  })
    .then((podcast) => {
      res.status(302).send({
        msg: 'Requested Podcast has been found.',
        id: podcast.id,
        type: podcast.type,
        category: podcast.category,
        title: podcast.title,
        description: podcast.description,
        tags: podcast.tags,
        uploaded_on: podcast.uploaded_on,
        updated_on: podcast.updated_on,
      });
    })
    .catch((err) => {
      res.json(err);
    });
});

// Get Podcast by slug
app.get('/get/:slug', (req, res) => {
  const { slug } = req.params;
  const podcastList = [];
  Podcast.find({
    slug,
  }).populate('audio_file').populate('cover')
    .then((podcasts) => {
      podcasts.map((podcast) => podcastList.push({
        id: podcast.id,
        type: podcast.type,
        slug: podcast.slug,
        category: podcast.category,
        title: podcast.title,
        description: podcast.description,
        tags: podcast.tags,
        uploaded_on: podcast.uploaded_on,
        updated_on: podcast.updated_on,
      }));
      res.status(302).send(podcasts);
    })
    .catch((err) => {
      res.json({
        found: false,
        err,
      });
    });
});

// Check if Podcast slug is valid
app.get('/validation/slug/:slug', (req, res) => {
  const { slug } = req.params;
  const podcastList = [];
  Podcast.find({
    slug,
  })
    .then((podcasts) => {
      podcasts.map((podcast) => podcastList.push({
        id: podcast.id,
        type: podcast.type,
        slug: podcast.slug,
        category: podcast.category,
        title: podcast.title,
        description: podcast.description,
        tags: podcast.tags,
        uploaded_on: podcast.uploaded_on,
        updated_on: podcast.updated_on,
      }));
      let valid = true;
      if (podcastList.length > 0) {
        valid = false;
        res.json({
          valid,
        });
      } else if (podcastList.length === 0) {
        res.json({
          valid,
        });
      }
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
});

// Update Podcast
app.post('/upload', (req, res) => {
  const {
    isSlugValid,
    category,
    title,
    description,
    tags,
    audioFile,
    cover,
  } = req.body;
  const errors = [];
  if (!isSlugValid || !category || !title || !description || !tags) {
    errors.push({
      errorMsg: 'Please enter all fields.',
    });
  }


  if (errors.length > 0) {
    res.json({
      error: errors,
    });
  } else {
    const id = uuidv4();
    const type = 'Podcast';
    const uploadedOn = Date.now();
    const updatedOn = null;
    if (isSlugValid) {
      const slug = title
        .toLowerCase()
        .split(' ')
        .join('-');
      const newPodcast = new Podcast({
        id,
        slug,
        type,
        category,
        title,
        description,
        tags,
        audioFile,
        cover,
        uploadedOn,
        updatedOn,
      });
      newPodcast
        .save()
        .then(() => res.status(201).send({
          msg: 'Podcast successfully uploaded!',
          id,
          slug,
          type,
          category,
          title,
          description,
          tags,
          audioFile,
          cover,
          uploadedOn,
          updatedOn,
          uploaded: true,
        }))
        .catch((err) => {
          res.json({
            errorMsg: err,
          });
        });
    } else {
      res.json({
        errorMsg: 'Slug is invalid',
      });
    }
  }
});

app.post('/upload/cover', multer(multerConfig).single('file'), async (req, res) => {
  const {
    originalname: name,
    size,
    key,
    location: url = '',
  } = req.file;
  const id = uuidv4();

  const cover = await PodcastCover.create({
    id,
    name,
    size,
    key,
    url,
  });

  return res.json(cover);
});

app.post('/upload/audio', multer(multerConfig).single('file'), async (req, res) => {
  const {
    originalname: name,
    size,
    key,
    location: url = '',
  } = req.file;
  const id = uuidv4();

  const audioFile = await PodcastAudioFile.create({
    id,
    name,
    size,
    key,
    url,
  });

  return res.json(audioFile);
});

app.post('/set/global-variable', async (req, res) => {
  const {
    type,
    title,
  } = req.body;
  global.gConfigMulter.type = type;
  global.gConfigMulter.title = title;
  global.gConfigMulter.folder_name = global.gConfigMulter.title;
  global.gConfigMulter.destination = `${global.gConfigMulter.type}/${global.gConfigMulter.folder_name}`;
  res.status(200).send({
    ok: true,
  });
});

// Update Podcast Info
app.put('/update/:id', (req, res) => {
  const {
    category,
    title,
    description,
    tags,

  } = req.body;
  const { id } = req;
  Podcast.updateOne({
    id,
  }, {
    category,
    title,
    description,
    tags,
  }, {
    runValidators: true,
  })
    .then(() => {
      res.json({
        msg: 'Podcast details has been successfully updated.',
        id,
        category,
        title,
        description,
        tags,
      });
    })
    .catch((err) => {
      res.json({
        errorMsg: err,
      });
    });
});

// Delete Podcast
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  Podcast.deleteOne({
    id,
  }).then(() => {
    res.json({
      msg: 'Podcast deleted successfully!',
    });
  }).catch((err) => {
    res.json({
      errorMgs: err,
    });
  });
});

app.delete('/delete/audio/:id', async (req, res) => {
  const audioFile = await PodcastAudioFile.findById(req.params.id);

  await audioFile.remove();

  return res.send({
    msg: 'Pocast audio file successfully deleted.',
  });
});

app.delete('/delete/cover/:id', async (req, res) => {
  const coverFile = await PodcastCover.findById(req.params.id);

  await coverFile.remove();

  return res.send({
    msg: 'Podcast cover file successfully deleted',
  });
});


module.exports = app;
