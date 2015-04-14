var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'EBDC', projectName: 'EBDC for projects' });
});

module.exports = router;
