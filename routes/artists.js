const express = require('express');
const router = express.Router();
const knex = require('../knex')

router.get('/', (req, res, next) => {
  knex('artists')
    .orderBy('artist', 'asc')
    .then(index => {
      // envelope data for a layer of data security
      let envelope = { index }
      res.json(envelope)
    })
});

router.get('/:id', (req, res, next) => {
  knex('artists')
    .join('albums_artists', 'artists.id', 'albums_artists.artist_id')
    .join('albums', 'albums.id', 'albums_artists.album_id')
    .select('artists.artist', 'albums.album')
    .where('albums_artists.artist_id', req.params.id)
    .then(data => {
      console.log(data);
      res.json(data)
    })
})

module.exports = router;
