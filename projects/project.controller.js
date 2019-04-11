const express = require('express');
const router = express.Router();
const projectService = require('./project.service');

// routes
router.post('/register', register);
router.get('/getBy', getBy);

module.exports = router;

function register(req, res, next) {
    projectService.register(req.body)
        .then(() => res.json({message: 'Successfully'}))
        .catch(err => console.log(err));
}

function getBy(req, res, next) {
    projectService.get(req.query.userdata)
        .then(data => res.send(data))
        .catch(err => console.log(err));
}

function workRegister(req, res, next) {
    // TODO Add a record to the table
}
