const db = require('../_helpers/db');

module.exports = {
    register,
    get
};

async function register(projectParam) {
    db.createProject(projectParam.pname, projectParam.powner)
        .then(data => console.log(data))
        .catch(err => console.log(err))
}

async function get(userParam) {
    let data = JSON.parse(userParam);
    attrArray = [];
    for (let key in data) {
        if (data[key]) {
            attrArray.push(key);
        }
    }
    // TODO Set conditions But what conditions???
    return await db.getBy('PROJECT', attrArray, []);
}
