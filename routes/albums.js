const express = require('express');
const router = express.Router();
const knex = require('../knex')

// consider paginating results here
//consider creating module for knex calls
router.get('/', (req, res, next) => {
  knex('albums')
    .join('albums_artists', 'albums.id', 'albums_artists.album_id')
    .join('artists', 'artists.id', 'albums_artists.artist_id')
    .select('albums.id as album_id', 'albums.album', 'albums.year', 'albums.genre', 'artists.artist')
    .then(allAlbums => {

      res.json({ allAlbums })
    })
});

router.get('/:id', (req, res, next) => {
  knex('albums')
    .join('albums_artists', 'albums.id', 'albums_artists.album_id')
    .join('artists', 'artists.id', 'albums_artists.artist_id')
    .select('albums.id as album_id', 'albums.album', 'albums.year', 'albums.genre', 'artists.artist')
    .where('albums.id', req.params.id)
    .then(oneAlbum => {

      res.json({ oneAlbum })
    })
})

//validate data here
// plug function into substack to check if data already exists
// if album exists artist will exist
// if album doesn't exist artist may exist
// as long as some peice of information is new albums_artists needs to be updated
router.post('/', (req, res, next) => {

  knex('albums')
    .insert([{
      album: req.body.album,
      genre: req.body.genre,
      year: req.body.year
    }], '*')
    .then(addedAlbum => {
      knex('artists')
        .insert([{
          artist: req.body.artist
        }], '*')
        .then(addedArtist => {
          knex('albums_artists')
            .insert([{
              album_id: addedAlbum[0].id,
              artist_id: addedArtist[0].id
            }], '*')
              .then(addedAll => {
                res.json( { album: addedAlbum[0].album, artist: addedArtist[0].artist, genre: addedAlbum[0].genre, year: addedAlbum[0].year })
              })
        })
    })
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
