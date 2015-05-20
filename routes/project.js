var express = require('express');
var router = express.Router();
var log = require("../libs/log")(module);
var Project = require("../models/project").Project;
var User = require("../models/user").User;


var userName = "Than";
//project = "Личный кабинет компании" and component = Frontend and createdDate > startOfMonth()

router.get('/', function(req, res, next) {
    User.isUserCreated(userName, function(err, user){
        if(err){
            log.error(err);
            return next(err);
        }
        if(user) {
            Project.getProjectsShortInfo(user.projects, function (err, projects) {
                if(err){
                    log.error(err);
                    return next(err);
                }
                res.render('projects', {
                    title: 'Проекты',
                    projectName: 'EBDC for projects',
                    projectsInfo: projects
                });
            });
        } else {
            log.warn("Error 401: Пользователь " + userName + " не найден");
            res.status(401).send("Пользователь " + userName + " не найден!");
        }

    });
});

router.get('/:shortName/edit', function(req, res, next) {
    var shortName = req.params.shortName;
    Project.isProjectCreated(shortName, function(err, project){
        if(err){
            log.error(err);
            return next(err);
        }
        if(project){
            res.render('edit_project', {project: project});
        } else {
            log.warn("Error 404: Проект " + shortName + " не найден");
            res.status(404).send("Проект " + shortName + " не найден");
        }
    });

});

router.get('/new', function(req, res) {
    res.render('new_project', { title: 'Проекты', projectName: 'EBDC for projects' });
});

router.post('/new', function(req, res, next) {
    Project.createOrUpdateProject(req.body, function(err, project){
        if(err){
            log.error(err);
            return next(err);
        }
        var userProject = {
            projectName: project.shortName,
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