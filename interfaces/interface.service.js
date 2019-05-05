const db = require('../_helpers/db');

module.exports = {
    register,
    getByProject
};

function register(interfaceParam) {
    db.createInterface(interfaceParam.iname, interfaceParam.iteam, interfaceParam.iprojectid)
        .then(data => console.log(data))
        .catch(err => console.log(err))
}

function getByProject({projectid}) {
    console.log(projectid);
    let query = 'SELECT INAME ' +
        'FROM INTERFACE ' +
        'INNER JOIN PROJECT ' +
        'ON INTERFACE.IPROJECTID=PROJECT.PROJECTID ' +
        'WHERE PROJECTID=' + projectid;

    return db.runQuery(query);
}
