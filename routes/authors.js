var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);

/* GET users listing. */
router.get('/', function(req, res, next) {
var fuckMyLife = {};
  knex('authors')
  .innerJoin('bibliography', 'authors.id', 'bibliography.author_id')
  .innerJoin('books', 'bibliography.book_id', 'books.id')
  .then(function(authors) {
    fuckMyLife.killMeNow = authors;
    console.log(fuckMyLife.killMeNow);
    fuckMyLife.killMeNow.forEach(function(e){

    })

  res.render('authors', {authors: authors});
  })

});

router.get('/:id', function(req, res, next){
  return knex('authors').where({'authors.id': req.params.id}).first()
  .then(function(author){
    return knex('bibliography')
    .where({'bibliography.author_id': req.params.id})
    .pluck('book_id')
    .then(function(booksId){
      return knex('books')
      .whereIn('books.id', booksId)
      .then(function(books){
      console.log(author);
      console.log(books);
      res.render('authordetail', {author: author, books: books})
    })
    })
  })
})

module.exports = router;
