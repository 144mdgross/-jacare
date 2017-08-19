const data = require('../albums.json')
//
// // NOTE: there are currently duplicate artists being inserted into the database.
let artists = data.map((element, index) => {
  return { artist: element.artist, id: index + 1 }
})

// sorts artists to prepare for data normalization
let sorted = artists.sort((a, b) => {
  return (a.artist.toLowerCase() > b.artist.toLowerCase()) ? 1: ((b.artist.toLowerCase() > a.artist.toLowerCase()) ? -1 : 0)
})

// filters duplicate artists out of data
let screen = sorted.filter((item, index, arr) => {
  if (arr[index + 1] !== undefined) {
    if (item.artist == arr[index + 1].artist) {
      return false
    } else {
      return true
    }
  } else if (arr[index]) {
    return true
  }
})

// screen.push(sorted[sorted.length - 1])

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('artists').del()
    .then(function () {
      // Inserts seed entries
      return knex('artists').insert(
        screen
      );
    });
};
