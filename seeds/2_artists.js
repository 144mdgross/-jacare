const data = require('../albums.json')

let artists = data.map((element, index) => {
  return { artist: element.artist, id: index + 1 }
})

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('artists').del()
    .then(function () {
      // Inserts seed entries
      return knex('artists').insert(
        artists
      );
    });
};
