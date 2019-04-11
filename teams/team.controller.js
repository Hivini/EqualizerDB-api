const express = require('express');
const router = express.Router();
const teamService = require('./team.service');

// routes
router.post('/register', register);
router.get('/getBy', getBy);

module.exports = router;

function register(req, res, next) {
    teamService.register(req.body)
        .then(() => res.json({message: 'Inserted successfully'}))
        .catch(err => console.log(err));
}

function getBy(req, res, next) {
    teamService.get(req.query.userdata)
        .then(data => res.send(data))
        .catch(err => console.log(err));
}
