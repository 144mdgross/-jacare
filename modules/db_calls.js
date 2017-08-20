const knex = require('../knex')

const exists = (table, column, identifier) => {

return knex(table)
    .where(column, identifier)
    .then(result => {
      console.log('result in db mod', result);

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




module.exports = {
  exists,
  updateAlbum
}
