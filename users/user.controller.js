const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/login', login);
router.post('/register', register);
router.get('/getBy', getBy);

module.exports = router;

function login(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user): res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => res.send(err));
}

function register(req, res, next) {
    // TODO Return the ID of the employee
    userService.create(JSON.parse(req.query.fieldsVal))
        .then(() => res.json({message: "Successful"}))
        .catch(err => console.log(err));
}

function getBy(req, res, next) {
    console.log(req.query);
    userService.get(req.query.userdata)
        .then(data => res.send(data))
        .catch(err => console.log(err));
}
