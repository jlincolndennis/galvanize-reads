var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);

router.get('/', function(req, res, next){
  var authorz =[]

  return knex('authors')
  .then(function(authors){
    for (var i = 0; i < authors.length; i++) {
      authorz.push({
        id: authors[i].id,
        last_name: authors[i].last_name,
        first_name: authors[i].first_name,
        url: authors[i].portrait_url,
        bio: authors[i].biography,
        titles: []});
      }

      return knex('authors')
      .innerJoin('bibliography', 'authors.id', 'bibliography.author_id')
      .innerJoin('books', 'bibliography.book_id', 'books.id')
      .select('books.title', 'bibliography.author_id')
    })
    .then(function(data){
      for (var i = 0; i < authorz.length; i++) {
        for (var j = 0; j < data.length; j++) {
          if (authorz[i].id == data[j].author_id){
            authorz[i].titles.push(data[j].title)
          }
        }
      }
      res.render('authors', {authors: authorz, books: authorz});
    })
  })


  router.get('/:id', function (req, res, next){
    return knex('authors')
    .where('authors.id', req.params.id)
    .innerJoin('bibliography', 'authors.id', 'bibliography.author_id')
    .innerJoin('books', 'bibliography.book_id', 'books.id')
    .select('books.title', 'authors.first_name', 'authors.last_name', 'authors.biography', 'authors.portrait_url')
    .then(function(data){
      var books=[];
      for (var i = 0; i < data.length; i++) {
        books.push(data[i].title)
      }
      res.render('authordetail',{books: books, author: data[0]});
    })
  })


module.exports = router;
