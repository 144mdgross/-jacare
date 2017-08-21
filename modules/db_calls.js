const knex = require('../knex')


const exists = (table, column, identifier) => {

return knex(table)
    .where(column, identifier)
    .then(result => {
      if(!result[0]) {
        return false
      } else {
        return result[0]
      }

    })
}

const updateAlbum = (id, body) => {

//NOTE: refactor to use exists function
return knex('albums')
    .where('id', id)
    .then(singleAlbum => {
      if (!singleAlbum[0]) {
        return new Error
      } else {
        return knex('albums')
          .where('id', singleAlbum[0].id)
          .update({
            album: body.album,
            genre: body.genre,
            year: body.year
          })
          .returning('*')
          .then(updated => {

            return updated
          })
      }

    })
}

const updateArtist = (albumId, artist) => {
  console.log('updateArtist called');

return exists('artists', 'artist', artist)
  .then(existence => {
      if(!existence) {

        return knex('artists')
          .insert([{
            artist: artist
          }], "*")
          .then(newArtist => {
            console.log('newArtist in db called', newArtist);

            return knex('albums_artists')
              .where('album_id', albumId)
              .update({
                artist_id: newArtist[0].id
              })
              .returning('*')
              .then(result => {
                console.log('result in updateArtist', result);
                return {
                  id: albumId,
                  // how to send album name, year, genre w/ this query...is it necessary
                  artist: newArtist[0].artist
                }
              })
          })
      } else {
        return knex('albums_artists')
          .where('album_id', albumId)
          .update({
            artist_id: existence.id
          })
          .returning('*')
          .then(artistsUpdated => {
            console.log('artistsUpdated', artistsUpdated);
            return {
              artist_id: artistsUpdated[0].artist_id,
              artist: existence.artist
            }
          })
      }
  })
}




module.exports = {
  exists,
  updateAlbum,
  updateArtist
}
