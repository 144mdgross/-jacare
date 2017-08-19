const data = require('../albums.json')

let albums = data.map((item, index) => {
  return { album: item.album, genre: item.genre, year: item.year }
})

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('albums').del()
    .then(function () {
      // Inserts seed entries
      return knex('albums').insert(
        albums
      );
    });
};
