const data = require('./albums.json')

// NOTE: there are currently duplicate artists being inserted into the database.
let artists = data.map((element, index) => {
  return {
    artist: element.artist,
    id: index + 1
  }
})

let duplicates = []

let sorted = artists.sort((a, b) => {
  return (a.artist.toLowerCase() > b.artist.toLowerCase()) ? 1: ((b.artist.toLowerCase() > a.artist.toLowerCase()) ? -1 : 0)
})

let screen = sorted.filter((item, index, arr) => {
  if (index < arr.length -1) {
    if (item.artist == arr[index + 1].artist) {
      duplicates.push(item.artist)
      return false
    } else {
      return true
    }
  }
})

// let finalData = artists.filter((item, index, arr) => {
//   return artists[index].artist == item[index].artist ? false : filtered['artist'] = item.artist
// })

console.log('sorted', sorted, sorted.length, artists.length);
console.log('screen', screen, screen.length, artists.length, sorted.length);
console.log('duplicates', duplicates, duplicates.length);
// console.log('finalData', finalData, finalData.length);
