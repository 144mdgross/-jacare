const express = require('express');
const router = express.Router();
const knex = require('../knex')

// consider paginating results here
router.get('/', (req, res, next) => {
  knex('albums')
    .join('albums_artists', 'albums.id', 'albums_artists.album_id')
    .join('artists', 'artists.id', 'albums_artists.artist_id')
    .select('albums.id as album_id', 'albums.album', 'albums.year', 'albums.genre', 'artists.artist')
    .then(allAlbums => {
      let envelope = { allAlbums }
      res.json(envelope)
    })
});

router.get('/:id', (req, res, next) => {
  res.json('get one')
})

router.post('/', (req, res, next) => {
  res.json('post')
})

router.patch('/', (req, res, next) => {
  res.json('patch')
})

router.put('/', (req, res, next) => {
  res.json('put')
})

router.delete('/', (req, res, next) => {
  res.json('delete')
})



module.exports = router;
