const express = require('express');
const router = express.Router();
const knex = require('../knex')
const exists = require('../modules/db_calls').exists

// consider paginating results here
//consider creating module for knex calls
router.get('/', (req, res, next) => {
  knex('albums')
    .join('albums_artists', 'albums.id', 'albums_artists.album_id')
    .join('artists', 'artists.id', 'albums_artists.artist_id')
    .select('albums.id as album_id', 'albums.album', 'albums.year', 'albums.genre', 'artists.artist', 'albums_artists.artist_id')
    .then(all => {

      res.json({
        all
      })
    })
});

router.get('/:id', (req, res, next) => {
  knex('albums')
    .join('albums_artists', 'albums.id', 'albums_artists.album_id')
    .join('artists', 'artists.id', 'albums_artists.artist_id')
    .select('albums.id as album_id', 'albums.album', 'albums.year', 'albums.genre', 'artists.artist')
    .where('albums.id', req.params.id)
    .then(album => {

      // NOTE: think about enveloping the knex result. do I want to take it out of an array?
      //NOTE: be consisent about how data sent is structured.
      res.json({
        abum
      })
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
              res.json({
                album: addedAlbum[0].album,
                artist: addedArtist[0].artist,
                genre: addedAlbum[0].genre,
                year: addedAlbum[0].year
              })
            })
        })
    })
})

// validate!
router.patch('/:id', (req, res, next) => {

  knex('albums')
    .where('id', req.params.id)
    .then(singleAlbum => {
      knex('albums')
        .where('id', req.params.id)
        .update(req.body)
        .returning('*')
        .then(updated => {
          res.json({
            updated
          })
        })
    })
})

// to define rules if client wants to put. That means they want to give me all information i have for albums in db
// validate that all data needed from client is present before doing put
router.put('/:id', (req, res, next) => {
  let stateOfTheArtist = exists('artists', 'artist', req.body.artist).then(existenceKnown => {

    knex('albums')
      .where('id', req.params.id)
      .update({
        album: req.body.album,
        genre: req.body.genre,
        year: req.body.year
      })
      .returning('*')
      .then(updated => {
        if (!existenceKnown) {
          knex('artists')
            .insert([{
              artist: req.body.artist
            }], '*')
            .then(newArtist => {
              knex('albums_artists')
                .where('album_id', req.params.id)
                .update({
                  artist_id: newArtist[0].id
                })
                .returning('*')
                .then(result => {
                  res.json({
                    id: updated[0].id,
                    album: updated[0].album,
                    genre: updated[0].genre,
                    year: updated[0].year,
                    artist: newArtist[0].artist
                  })
                })
            })
        } else {

          knex('albums_artists')
            .where('album_id', req.params.id)
            .update({
              artist_id: existenceKnown.id
            })
            .then(allUpdated => {

              res.json({
                id: updated[0].id,
                album: updated[0].album,
                genre: updated[0].genre,
                year: updated[0].year,
                artist: existenceKnown.artist
              })
            })
        }
      })
  })
})

router.delete('/:id', (req, res, next) => {

  knex('albums_artists')
    .where('album_id', req.params.id)
    .del()
    .returning('*')
    .then(joinGone => {

      knex('albums')
        .where('id', req.params.id)
        .del()
        .returning('*')
        .then(albumGone => {

          if (joinGone.length === 1) {

            knex('artists')
              .where('id', joinGone[0].artist_id)
              .del()
              .returning('*')
              .then(artistGone => {

                res.json({
                  id: albumGone[0].id,
                  album: albumGone[0].album,
                  artist: artistGone[0].artist,
                  genre: albumGone[0].genre,
                  year: albumGone[0].year
                })

              })
          } else {

            knex('artists')
              .where('id', joinGone[0].artist_id)
              .then(sendComplete => {

                res.json({
                  id: albumGone[0].id,
                  album: albumGone[0].album,
                  artist: 'fill in artist info',
                  genre: albumGone[0].genre,
                  year: albumGone[0].year
                })
              })
          }
        })
    })
})

module.exports = router;
