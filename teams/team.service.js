const db = require('../_helpers/db');

module.exports = {
    register,
    get
};

async function register(teamParam) {
    db.createTeam(teamParam.tname, teamParam.organization, teamParam.tmanager)
        .then(data => console.log(data))
        .catch(err => console.log(err));
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
    return await db.getBy('TEAM', attrArray, []);
}
