const express = require('express');
const router = express.Router();
const interfaceService = require('./interface.service');

// routes
router.post('/register', register);

module.exports = router;

function register(req, res, next) {
    interfaceService.register(req.body)
        .then(() => res.json({message: 'Success'}))
        .catch(err => console.log(err));
}
