var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('openai', { title: 'Express' });
});

router.get('/picture', function(req, res, next) {
  res.render('picture', { title: '入院陪护证'} )
})

module.exports = router;
