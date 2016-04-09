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

  router.get('/:id/edit', function(req, res, next){
    return knex('authors')
    .where('authors.id', req.params.id)
    .innerJoin('bibliography', 'authors.id', 'bibliography.author_id')
    .innerJoin('books', 'bibliography.book_id', 'books.id')
    .select('books.title', 'books.id','authors.first_name', 'authors.last_name', 'authors.biography', 'authors.portrait_url')
    .then(function(data){
      var books=[];
      for (var i = 0; i < data.length; i++) {
        books.push({title: data[i].title, id: data[i].id})
      }
      return knex('books').pluck('title')
      .then(function(bookys){
        console.log(books)
        res.render('authoredit', {authorbooks: books, books: bookys, author: data[0]})

      })
    })
  })

  router.get('/add', function(req, res, next){
    return knex('books')
    .then(function(bookys){
      var booksList = []
      for (var i = 0; i < bookys.length; i++) {
        booksList.push({id: bookys[i].id, title: bookys[i].title})
      }
      res.render('authoradd', {books: bookys})
    })
  })

  router.post('/add', function(req, res, next){
    var books = req.body.book_id;
    var booksArr = books instanceof Array ? books : [books];

    knex('authors')
    .insert({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      portrait_url: req.body.portrait_url,
      biography: req.body.biography
    })
    .returning('id')
    .then(function(id){
      var anotherBooksArrFullOfObject =
      booksArr.map(function(theBookIdFromTheCheckBox){
        return ({author_id: id[0], book_id: theBookIdFromTheCheckBox})
      })
      return knex('bibliography')
              .insert(anotherBooksArrFullOfObject)
              .then(function(data){
                res.redirect('/authors')
              })
    })
  })


  router.get('/:id', function (req, res, next){
    return knex('authors')
    .where('authors.id', req.params.id)
    .innerJoin('bibliography', 'authors.id', 'bibliography.author_id')
    .innerJoin('books', 'bibliography.book_id', 'books.id')
    .select('books.title', 'authors.first_name', 'authors.last_name', 'authors.biography', 'authors.portrait_url', 'authors.id')
    .then(function(data){
      var books=[];
      for (var i = 0; i < data.length; i++) {
        books.push(data[i].title)
      }
      res.render('authordetail',{books: books, author: data[0]});
    })
  })

module.exports = router;
