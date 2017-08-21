const knex = require('../knex')

const exists = (table, column, identifier) => {

return knex(table)
    .where(column, identifier)
    .then(result => {

    return result[0]
    })
}

const updateAlbum = (id, body) => {

return knex('albums')
    .where('id', id)
    .then(singleAlbum => {

      return knex('albums')
        .where('id', singleAlbum[0].id)
        .update(body)
        .returning('*')
        .then(updated => {

          return updated
        })
    })
}

const updateArtist = (albumId, reqBody) => {
  console.log('updateArtist called');

return exists('artists', 'artist', reqBody.artist)
  .then(existence => {
      if(!existence) {

        return knex('artists')
          .insert([{
            artist: reqBody.artist
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
            return artistsUpdated
          })
      }
  })
}




module.exports = {
  exists,
  updateAlbum,
  updateArtist
}
