const express = require('express');
const router = express.Router();
const projectService = require('./project.service');

// routes
router.post('/register', register);
router.post('/createProject', createProject);
router.get('/getBy', getBy);
router.get('/getAll', getAll);

module.exports = router;

function register(req, res, next) {
    projectService.register(JSON.parse(req.query.fieldsVal))
        .then(() => res.json({message: 'Successfully'}))
        .catch(err => console.log(err));
}

function getBy(req, res, next) {
    projectService.get(req.query.userdata)
        .then(data => res.send(data))
        .catch(err => console.log(err));
}

function getAll(req, res, next) {
    projectService.getAll()
        .then(data => res.send(data))
        .catch(err => console.log(err));
}

function workRegister(req, res, next) {
    // TODO Add a record to the table
}

function createProject(req, res, next) {
    projectService.createProject(req.body)
        .then(data => res.send(data))
        .catch(err => console.log(err));
}
