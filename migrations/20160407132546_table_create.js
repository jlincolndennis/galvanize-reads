
exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', function(table){
    table.increments('id');
    table.string('title');
    table.string('genre');
    table.text('description');
    table.string('cover_url');
  })
  .createTable('authors', function(table){
    table.increments('id');
    table.string('first_name');
    table.string('last_name');
    table.string('portrait_url');
    table.text('biography');
  })
  .createTable('bibliography', function(table){
    table.integer('book_id').unsigned().references('books.id').onUpdate('CASCADE').onDelete('CASCADE');
    table.integer('author_id').unsigned().references('authors.id').onUpdate('CASCADE').onDelete('CASCADE');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('bibliography')
                    .dropTable('authors')
                    .dropTable('books')
};
