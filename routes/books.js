var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);

/* GET users listing. */
router.get('/', function(req, res, next) {
  var bookz = []

  return knex('books')
  .then(function(books) {
    for (var i = 0; i < books.length; i++) {
      bookz.push({
        id: books[i].id,
        title: books[i].title,
        url: books[i].cover_url,
        desc: books[i].description,
        authors: []});
    }

    return knex('books')
    .innerJoin('bibliography', 'books.id', 'bibliography.book_id')
    .innerJoin('authors', 'bibliography.author_id', 'authors.id')
    .select('authors.first_name', 'authors.last_name', 'bibliography.book_id')
  })
  .then(function(data){
    for (var i = 0; i < bookz.length; i++) {
      for (var j = 0; j < data.length; j++) {
        if (bookz[i].id == data[j].book_id){
          bookz[i].authors.push(data[j].first_name+" "+data[j].last_name)
        }
      }
    }
    res.render('books', {books: bookz, authors: bookz})
  })
});

router.get('/:id', function (req, res, next){
  return knex('books')
  .where('books.id', req.params.id)
  .innerJoin('bibliography', 'books.id', 'bibliography.book_id')
  .innerJoin('authors', 'bibliography.author_id', 'authors.id')
  .select('books.title', 'authors.first_name', 'authors.last_name', 'books.description', 'books.cover_url')
  .then(function(data){
    console.log(data);
    var authors=[];
    for (var i = 0; i < data.length; i++) {
      authors.push(data[i].first_name +" "+ data[i].last_name)
    }
    console.log('>>>>>>>>>>',authors);
    res.render('booksdetail',{books: data[0], authors: authors});
  })
})

module.exports = router;
