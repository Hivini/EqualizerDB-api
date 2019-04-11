const db = require('../_helpers/db');

module.exports = {
    register
};

function register(interfaceParam) {
    db.createInterface(interfaceParam.iname, interfaceParam.iteam, interfaceParam.iprojectid)
        .then(data => console.log(data))
        .catch(err => console.log(err))
}
