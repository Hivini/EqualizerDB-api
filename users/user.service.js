const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/db');

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
    console.log(user);
    if (user && bcrypt.compareSync(password, user.password)) {
        const { password, ...userWithoutPassword } = user;
        const token = jwt.sign({ sub: user.id }, "lol");
        return {
            ...userWithoutPassword,
            token
        };
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
