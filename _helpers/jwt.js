const expressJwt = require('express-jwt');
const userService = require('../users/user.service');
const jwt_credentials = require('../credentials/jwt-credentials');
const db = require('../_helpers/db');

module.exports = {
    jwt
};

function jwt() {
    const secret = jwt_credentials.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/login',
            '/users/register'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await db.getUser(payload.id);
    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
}
