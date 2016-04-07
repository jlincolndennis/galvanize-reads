var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('index.html');
});

router.get('/books', function(req, res, next) {
  res.render('books');
});

router.get('/authors', function(req, res, next) {
  res.render('authors');
});

module.exports = router;
