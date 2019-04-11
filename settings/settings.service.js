const db = require('../_helpers/db');

module.exports = {
    register
};

function register(settingsParam) {
    db.createSetting(settingsParam.registerField, settingsParam.interfaceName, settingsParam.registerValue,
        settingsParam.bitNumber, settingsParam.sOwner)
        .then((data) => console.log(data))
        .catch(err => console.log(err));
}
