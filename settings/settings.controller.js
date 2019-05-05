const express = require('express');
const router = express.Router();
const settingsService = require('./settings.service');

// routes
router.post('/register', register);
router.post('/getSettings', getSettings);
router.post('/getSettingsOwner', getSettingsOwner);
router.put('/updateOwner', updateOwner);

module.exports = router;

function register(req, res, next) {
    settingsService.register(req.body)
        .then(() => res.status(200))
        .catch(err => console.log(err));
}

function getSettings(req, res, next) {
    settingsService.getInterfaceSettings(req.body)
        .then(data => res.send(data))
        .catch(err => console.log(err));
}

function getSettingsOwner(req, res, next) {
    settingsService.getInterfaceSettingsOwner(req.body)
        .then(data => res.send(data))
        .catch(err => console.log(err));
}

function updateOwner(req, res, next) {
    settingsService.updateOwner(req.body)
        .then(data => res.send(data))
        .catch(err => console.log(err));
}
