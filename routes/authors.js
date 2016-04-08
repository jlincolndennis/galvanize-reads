var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);

/* GET users listing. */
router.get('/', function(req, res, next) {

  knex('authors')
  .then(function(authors) {
    console.log(authors);
  res.render('authors', {authors: authors});
  })

});

router.get('/:id', function(req, res, next){
  knex('authors')
  .where({'author.id': req.params.id}).first()
  .innerJoin('bibliography', 'authors.id', 'bibliography.author_id')
  .then(function(author){
    console.log(author);
    res.render('authordetail', author)
  })
})

module.exports = router;
