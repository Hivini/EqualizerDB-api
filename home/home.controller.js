const express = require('express');
const router = express.Router();
const homeService = require('./home.service');
// routes
router.get('/search', search);

module.exports = router;

function search(req, res, next) {
    homeService.search(req.query.query)
        .then(data => res.send(data))
        .catch(err => console.log(err));
}
