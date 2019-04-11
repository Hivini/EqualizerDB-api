const express = require('express');
const router = express.Router();
const settingsService = require('./settings.service');

// routes
router.post('/register', register);

module.exports = router;

function register(req, res, next) {
    settingsService.register(req.body)
        .then(() => res.status(200))
        .catch(err => console.log(err));
}
