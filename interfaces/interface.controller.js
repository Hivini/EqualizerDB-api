const express = require('express');
const router = express.Router();
const interfaceService = require('./interface.service');

// routes
router.post('/register', register);
router.post('/getByProject', getByProject);

module.exports = router;

function register(req, res, next) {
    interfaceService.register(req.body)
        .then(() => res.json({message: 'Success'}))
        .catch(err => console.log(err));
}

function getByProject(req, res, next) {
    interfaceService.getByProject(req.body)
        .then(data => res.send(data))
        .catch(err => console.log(err));
}
