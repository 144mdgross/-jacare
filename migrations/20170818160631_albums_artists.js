
exports.up = function(knex) {
  return knex.schema.createTable('albums_artists', table => {

    table.integer('album_id')
      .references('albums.id')
      .onDelete('CASCADE')

    table.integer('artist_id')
      .references('artists.id')
      .onDelete('CASCADE')
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('albums_artists')
};
