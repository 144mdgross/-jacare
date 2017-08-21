const knex = require('../knex')


const exists = (table, column, identifier) => {

return knex(table)
    .where(column, identifier)
    .then(result => {
      return result[0]
    })
}

// joins and returns all table and returns them ordered by ascending id
const getAll = () => {
return  knex('albums')
          .join('albums_artists', 'albums.id', 'albums_artists.album_id')
          .join('artists', 'artists.id', 'albums_artists.artist_id')
          .select('albums.id as album_id', 'albums.album', 'albums.year', 'albums.genre', 'artists.artist', 'albums_artists.artist_id')
          .orderBy('albums.id', 'asc')
            .then(all => {
              return all
            })
}

const post = (body) => {
return  exists('artists', 'artist', body.artist)
    .then(found => {
      if(!found) {
        return knex('albums')
                .insert([{
                  album: body.album,
                  genre: body.genre,
                  year: body.year
                }], '*')
                .then(addedAlbum => {

                  return knex('artists')
                    .insert([{
                      artist: body.artist
                    }], '*')
                    .then(addedArtist => {

                      return knex('albums_artists')
                        .insert([{
                          album_id: addedAlbum[0].id,
                          artist_id: addedArtist[0].id
                        }], '*')
                        .then(addedAll => {

                          return [{
                            album: addedAlbum[0].album,
                            id: addedAlbum[0].id,
                            artist: addedArtist[0].artist,
                            artist_id: addedArtist[0].id,
                            genre: addedAlbum[0].genre,
                            year: addedAlbum[0].year
                          }]
                        })
                    })
                })
        }
          else {

            return knex('albums')
                    .insert([{
                      album: body.album,
                      genre: body.genre,
                      year: body.year
                    }], '*')
                    .then(added => {
                      console.log('addedAlbum', added);

                          return knex('albums_artists')
                            .insert([{
                              album_id: added[0].id,
                              artist_id: found.id
                            }], '*')
                            .then(addedIt => {
                              return [{
                                album: added[0].album,
                                id: added[0].id,
                                artist: found.artist,
                                artist_id: found.id,
                                genre: added[0].genre,
                                year: added[0].year
                              }]
                            })
                        })
          }
      })
}

const updateAlbum = (id, body) => {

        return knex('albums')
          .where('id', id)
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

const updateArtist = (albumId, artist) => {

return exists('artists', 'artist', artist)
  .then(existence => {
      if(!existence) {

        return knex('artists')
          .insert([{
            artist: artist
          }], "*")
          .then(newArtist => {

            return knex('albums_artists')
              .where('album_id', albumId)
              .update({
                artist_id: newArtist[0].id
              })
              .returning('*')
              .then(result => {

                return {
                  id: albumId,
                  artist: newArtist[0].artist
                }
              })
          })
      }
        else {

          return knex('albums_artists')
            .where('album_id', albumId)
            .update({
              artist_id: existence.id
            })
            .returning('*')
            .then(artistsUpdated => {

              return {
                artist_id: artistsUpdated[0].artist_id,
                artist: existence.artist
              }
            })
        }
  })
}

// called remove to avoid colissions with JavaScript and Knex
const remove = (id) => {
console.log('id in remove', id);
return  knex('albums_artists')
    .where('album_id', id)
    .del()
    .returning('*')
    .then(joinGone => {

      return knex('albums')
        .where('id', id)
        .del()
        .returning('*')
        .then(albumGone => {

          if (joinGone.length === 1) {

          return  knex('artists')
              .where('id', joinGone[0].artist_id)
              .del()
              .returning('*')
              .then(artistGone => {

                return {
                  id: albumGone[0].id,
                  album: albumGone[0].album,
                  artist: artistGone[0].artist,
                  artist_id: artistGone[0].id,
                  genre: albumGone[0].genre,
                  year: albumGone[0].year
                }

              })
          }
            else {

            return  knex('artists')
                .where('id', joinGone[0].artist_id)
                .then(sendComplete => {

                  return {
                    id: albumGone[0].id,
                    album: albumGone[0].album,
                    artist: 'fill in artist info',
                    genre: albumGone[0].genre,
                    year: albumGone[0].year
                  }
                })
            }
        })
    })
}

module.exports = {
  exists,
  getAll,
  post,
  updateAlbum,
  updateArtist,
  remove
}
