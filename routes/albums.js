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

// NOTE: think about enveloping the knex result. do I want to take it out of an array?
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

// consider how to handle partial data. Or should I force client to send all data and only do a put.
// do a query to check that info exists where params exist. Then update info that has changed.
router.patch('/:id', (req, res, next) => {

  knex('albums')
    .where('id', req.params.id)
    .then(singleAlbum => {
        knex('albums')
          .where('id', req.params.id)
          .update(req.body)
          .returning('*')
          .then(updated => {
            res.json({ updated })
          })
    })
})

// decide if put is necessary. probably b/c a client may want to put.
// router.put('/', (req, res, next) => {
//   res.json('put')
// })

router.delete('/:id', (req, res, next) => {
  // so when I delete I need to delete from albums, albums_artists and also artists if there are no more albums belonging to them
  knex('albums')
    .where('id', req.params.id)
    .del()
    .returning('*')
    .then(albumGone => {

      knex('albums_artists')
        .where('id', req.params.id)
        .del()
        .returning('*')
        .then(joinGone => {
          if (joinGone.length === 1) {
            knex('artists')
              .where('id', joinGone[0].artist_id)
              .del()
              .returning('*')
              .then(artistGone => {

                res.json({ id: albumGone[0].id, album: albumGone[0].album, artist: artistGone[0].artist, genre: albumGone[0].genre, year: albumGone[0].year })  

              })

          }

        })
    })
})



module.exports = router;
