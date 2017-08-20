const knex = require('../knex')

const exists = (table, column, identifier) => {

return knex(table)
    .where(column, identifier)
    .then(result => {
      console.log('result in db mod', result);

    return result[0]
    })

}




module.exports = {
  exists
}
