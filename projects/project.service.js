const db = require('../_helpers/db');

module.exports = {
    register,
    get,
    getAll,
    createProject
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

async function getAll() {
    let query = 'SELECT PROJECTID, PNAME FROM PROJECT ORDER BY PROJECTID';
    return await db.runQuery(query);
}

async function createProject({projectName, powner}) {
    return await db.createQuickProject(projectName, powner);
}
