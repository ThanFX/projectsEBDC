var express = require('express');
var router = express.Router();
var log = require("../libs/log")(module);
var Project = require("../models/project").Project;
var User = require("../models/user").User;


var userName = "Than";


router.get('/', function(req, res) {

    res.render('projects', { title: 'Проекты', projectName: 'EBDC for projects' });
});

router.get('/new', function(req, res) {
    res.render('new_project', { title: 'Проекты', projectName: 'EBDC for projects' });
});

router.post('/new', function(req, res, next) {
    console.log(req.body);
    Project.createOrUpdateProject(req.body, function(err, project){
        if(err){
            log.error(err);
            return next(err);
        }
        log.info("Успешно!");
        var userProject = {
            projectId: project._id,
            accessType: "owner"
        };
        User.saveProject(userName, userProject, function(err, user){
            if(err){
                log.error(err);
                return next(err);
            }
            log.info("Проект упешно записали в юзера: " + user);
        });
    });
    res.redirect('/');
});

module.exports = router;