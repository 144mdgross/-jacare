const data = require('../albums.json')

let artists = data.map((element, index) => {
  return { artist: element.artist}
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

// this array will hold data for ablum_artists table
let matchedItemIDs = []

for (let i = 0; i < screen.length; i++) {
    data.forEach((elem, pos, arry) => {
      if (elem.artist === screen[i].artist) {
        console.log(pos + 1, i + 1);
        matchedItemIDs.push({ album_id: pos + 1, artist_id: i + 1 })
      }
    })
}

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('albums_artists').del()
    .then(function () {
      // Inserts seed entries
      return knex('albums_artists').insert(
        matchedItemIDs
      );
    });
};
