const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/getBy', getBy);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(JSON.parse(req.query.fieldsVal))
        .then(() => res.status(200))
        .catch(err => console.log(err));
}

function getBy(req, res, next) {
    console.log(req.query);
    userService.get(req.query.userdata)
        .then(data => res.send(data))
        .catch(err => console.log(err));
}
