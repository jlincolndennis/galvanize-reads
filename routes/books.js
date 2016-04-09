var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')[process.env.DB_ENV]);

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

router.get('/:id/delete', function(req, res, next){
  console.log(req.params.id);
  knex('books')
  .where({id: req.params.id})
  .first()
  .del()
  .then(function(){
    res.redirect('/books')
  })
})


router.get('/add', function(req, res, next){
  return knex('authors')
  .then(function(peeps){
    var peepsList = []
    for (var i = 0; i < peeps.length; i++) {
      peepsList.push({id: peeps[i].id, author: (peeps[i].first_name+" "+peeps[i].last_name)})
    }
    res.render('booksadd', {authors: peepsList})
  })
});



router.post('/add', function(req, res, next){
  var authors = req.body.author_id;
  var authorsArr = authors instanceof Array ? authors : [authors];

  knex('books')
  .insert({
          title: req.body.title,
          genre: req.body.genre,
          cover_url: req.body.cover_url,
          description: req.body.description
  })
  .returning('id')
  .then(function(id){
    var anotherAuthorsArrFullOfObjects = authorsArr.map(function(author_id){
      return ({book_id: id[0], author_id: author_id})
    })
    return knex('bibliography')
            .insert(anotherAuthorsArrFullOfObjects)
            .then(function(data){
              res.redirect('/books')
            })
  })
})



router.get('/:id/edit', function(req, res, next){
  return knex('books')
  .where('books.id', req.params.id)
  .innerJoin('bibliography', 'books.id', 'bibliography.book_id')
  .innerJoin('authors', 'bibliography.author_id', 'authors.id')
  .select('books.title', 'authors.id','authors.first_name', 'authors.last_name', 'books.genre', 'books.description', 'books.cover_url')
  .then(function(data){

    var authors=[];
    for (var i = 0; i < data.length; i++) {
      authors.push({id: data[i].id,
                    author: data[i].first_name+" "+data[i].last_name,
                    book_id: req.params.id})

    }
    return knex('authors').select('id','first_name', 'last_name')
    .then(function(peeps){
      res.render('booksedit', {bookID: req.params.id, book: data[0], bookauthors: peeps, authors: authors})

    })
  })
})

router.post('/:id/edit', function(req, res, next){
  var authors = req.body.author_id;
  var authorsArr = authors instanceof Array ? authors : [authors];

  knex('books')
  .where({id: req.params.id})
  .update({
          title: req.body.title,
          genre: req.body.genre,
          cover_url: req.body.cover_url,
          description: req.body.description
  })
  .returning('id')
  .then(function(id){
    var anotherAuthorsArrFullOfObjects = authorsArr.map(function(author_id){
      return ({book_id: id[0], author_id: author_id})
    })
    return knex('bibliography')
            .insert(anotherAuthorsArrFullOfObjects)
            .then(function(data){
              res.redirect('/books')
            })
  })

})


router.get('/:id', function (req, res, next){
  console.log(req.params.id);
  return knex('books')
  .where({'books.id': req.params.id})
  .innerJoin('bibliography', 'books.id', 'bibliography.book_id')
  .innerJoin('authors', 'bibliography.author_id', 'authors.id')
  .select('books.title', 'authors.first_name', 'authors.last_name', 'books.description', 'books.cover_url', 'books.id')
  .then(function(data){

    var authors=[];
    for (var i = 0; i < data.length; i++) {
      authors.push(data[i].first_name +" "+ data[i].last_name)
    }

    res.render('booksdetail',{books: data[0], authors: authors});
  })
})

router.get("/:idAuthor/:idBook/removeAuthor", function(req, res, next){
  knex('bibliography')
  .where({author_id: req.params.idAuthor, book_id: req.params.idBook})
  .first()
  .del()
  .then(function(){
    res.redirect('/books/'+req.params.idBook+'/edit')
  })
})

module.exports = router;
