exports.up = function(knex) {
  return knex.schema.createTable('albums', table => {

    table.increments()

    table.string('album')
      .notNullable()
      .defaultTo('')

    table.string('genre')
      .notNullable()
      .defaultTo('')

    table.integer('year')
      .notNullable()
      .defaultTo(2000)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('albums')
};
