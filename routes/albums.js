const express = require('express');
const router = express.Router();
const knex = require('../knex')
const query = require('../modules/db_calls')
const Boom = require('boom')
const ev = require('express-validation')
const validations = require('../validations/album_requests')

// consider paginating results here
router.get('/', (req, res, next) => {
  query.getAll()
    .then(data => {
      res.json({ data })
    })
});

//NOTE: Boom is what I typically use for error handling.
// At the moment Boom only seems to be sending 500 errors.
router.get('/:id', (req, res, next) => {
  query.exists('albums', 'id', req.params.id)
    .then(album => {
      if (!album) {
        return next(Boom.notFound(`Album ${req.params.id} does not exist.`))
      }
       else {
        res.json({ album })
      }
    })
})

router.post('/', ev(validations.post), (req, res, next) => {
  query.post(req.body)
    .then(data => {
      res.json({ data })
    })
})

// patch can behave as patch or put
router.patch('/:id', ev(validations.post), (req, res, next) => {
  // check for existing resource before modifying database
  query.exists('albums', 'id', req.params.id)
    .then(albumExists => {
      console.log('albumExists', albumExists);
      if (!albumExists) {
        // sends error to client for missing resource
        return next(Boom.notFound(`Album ${req.params.id} does not exist.`))
      }
      else {
        if (req.body.artist && !req.body.album) {
          query.updateArtist(req.params.id, req.body.artist)
            .then(updatedArtist => {
              console.log('updatedArtist', updatedArtist);
              res.json({
                updatedArtist
              })
            })
        }
        else if (req.body.album && !req.body.artist) {
          query.updateAlbum(req.params.id, req.body)
            .then(data => {
              res.json({
                data
              })
            })
        }
        else if (req.body.album && req.body.artist) {
          query.updateAlbum(req.params.id, req.body)
            .then(upToDate => {
              query.updateArtist(req.params.id, req.body.artist)
                .then(updatedAll => {
                  // sends json object in consistent format w/ other data
                  res.json({ data: [{
                    id: upToDate[0].id,
                    album: upToDate[0].album,
                    genre: upToDate[0].genre,
                    year: upToDate[0].year,
                    artist_id: updatedAll.artist_id,
                    artist: updatedAll.artist
                  }
                ]})
                })
            })
        }
      }
    })
})

router.put('/:id', ev(validations.post), (req, res, next) => {

  query.exists('artists', 'artist', req.body.artist)
    .then(existenceKnown => {
      query.updateAlbum(req.params.id, req.body)
        .then(upToCode => {
          query.updateArtist(req.params.id, req.body.artist)
            .then(updatedArtistInfo => {
              res.json({ data: [{
                id: upToCode[0].id,
                album: upToCode[0].album,
                genre: upToCode[0].genre,
                year: upToCode[0].year,
                artist_id: updatedArtistInfo.artist_id,
                artist: updatedArtistInfo.artist
              }
            ]})
          })
        })
  })
})

router.delete('/:id', (req, res, next) => {
  query.exists('albums', 'id', req.params.id)
    .then(existenceDiscovered => {
      if(!existenceDiscovered) {
        return next(Boom.notFound(`Album ${req.params.id} does not exist.`))
      } else {
        query.remove(req.params.id)
          .then(gone => {
            res.json({ data: [gone]})
          })
      }
    })
})

module.exports = router;
