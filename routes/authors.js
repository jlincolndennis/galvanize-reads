var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);

/* GET users listing. */
router.get('/', function(req, res, next) {
  knex('authors')
  .then(function(authors){
    console.log(authors);
    res.render('authors', {authors: authors});
  })
});

module.exports = router;
