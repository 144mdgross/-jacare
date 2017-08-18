exports.up = function(knex) {
  return knex.schema.createTable('artists', table => {

    table.increments()

    table.string('artist')
      .notNullable()
      .defaultTo("")
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('artists')
};
