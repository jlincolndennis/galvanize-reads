var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);

/* GET users listing. */
router.get('/', function(req, res, next) {
  knex('books')
  .then(function(books) {
  res.render('books', {books: books});
  })



});

module.exports = router;
