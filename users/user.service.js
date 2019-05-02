const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');
const {secret}= require('../credentials/jwt-credentials');
const generateJWT = (payload, expiresIn) => jwt.sign(payload, secret, { expiresIn });

module.exports = {
    authenticate,
    create,
    get/*
    getAll,
    getById,
    update,
    delete: _delete
    */
};

async function authenticate({ id, password }) {
    const user = await db.getUser(id);
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({
            id: user.id,
            fname: user.firstName,
            lname: user.lastName,
            userRights: user.rights,
        }, secret, {expiresIn: 60 * 60 * 24});
        console.log(token);
        return {token};
    }
}

async function create(userParam) {
    // hash password
    if (userParam.password) {
        userParam.password = bcrypt.hashSync(userParam.password, 10);
    }

    console.log(userParam);

    return await db.createUser(userParam.email, userParam.password, userParam.fname, userParam.lname, userParam.eteamid);
}

async function get(userParam) {
    let data = JSON.parse(userParam);
    attrArray = [];
    for (let key in data) {
        if (data[key]) {
            attrArray.push(key);
        }
    }
    // TODO Set conditions
    return await db.getBy('EMPLOYEE', attrArray, []);
}
