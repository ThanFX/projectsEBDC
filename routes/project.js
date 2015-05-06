var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('index', { title: 'Проекты', projectName: 'EBDC for projects' });
});

router.get('/new', function(req, res) {
    res.render('new_project', { title: 'Проекты', projectName: 'EBDC for projects' });
});

module.exports = router;