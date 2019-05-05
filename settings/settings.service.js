const db = require('../_helpers/db');

module.exports = {
    register,
    getInterfaceSettings,
    getInterfaceSettingsOwner,
    getSettingsByOwner,
    updateOwner,
    createSetting,
    updateFields
};

function register(settingsParam) {
    db.createSetting(settingsParam.registerField, settingsParam.interfaceName, settingsParam.registerValue,
        settingsParam.bitNumber, settingsParam.sOwner)
        .then((data) => console.log(data))
        .catch(err => console.log(err));
}

function getInterfaceSettings({iname}) {
    return db.searchInterfaceSettings(iname);
}

function getInterfaceSettingsOwner({iname}) {
    return db.searchInterfaceSettingsOwner(iname);
}

function updateOwner({iname, registerfield, powner}) {
    return db.updateSettingsOwner(iname, registerfield, powner);
}

function getSettingsByOwner({sowner}) {
    return db.getSettingByOwner(sowner);
}

function createSetting({registerField, registerValue, sOwner}) {
    return db.createQuickSetting(registerField, registerValue, sOwner);
}
function updateFields({registerField, newRegisterField, newRegisterValue, sOwner}) {
    return db.updateSettingsField(registerField, newRegisterField, newRegisterValue, sOwner);
}
