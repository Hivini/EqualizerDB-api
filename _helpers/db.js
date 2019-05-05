const oracledb = require('oracledb');
oracledb.autoCommit = true;
const dbconfig = require('../config/dbconfig');
const {Query} = require("./query-class");

module.exports = {
    sqlSearch,
    getUser,
    createUser,
    getBy,
    createTeam,
    createProject,
    createWorkRelation,
    createInterface,
    createSetting,
    searchUserProjects,
    runQuery,
    searchUsersByInterface,
    searchInterfaceSettings,
    searchTeamMembers,
    searchInterfaceSettingsOwner,
    updateSettingsOwner,
    getSettingByOwner,
    createQuickSetting,
    updateSettingsField,
    createQuickProject
};

async function runQuery(query) {
    let connection;
    let result;

    try {
        connection = await oracledb.getConnection(  {
            user          : dbconfig.user,
            password      : dbconfig.password,
            connectString : dbconfig.connectString
        });

        result = await connection.execute(
            query
        );

    } catch (err) {
        return err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }

    return result;
}

async function sqlSearch(query) {

    return await runQuery(query);
}

async function getUser(id) {
    let query = "SELECT * FROM EMPLOYEE WHERE wwid=" + id;
    let user = await runQuery(query);
    if (!user.rows.length > 0) {
        return [];
    }
    // TODO This can be improved in a more dynamic way reading the metadata info provided by the oracle db
    return {
        id: user.rows[0][0],
        password: user.rows[0][1],
        firstName: user.rows[0][3],
        lastName: user.rows[0][4],
        teamid: user.rows[0][6],
        rights: user.rows[0][7]
    };
}

async function getBy(table, attributes, conditions) {
    let queryInfo = new Query('SELECT', table);
    queryInfo.setAttributesArray(attributes);
    queryInfo.setWhereConditions(conditions);
    return await runQueryInfo(queryInfo);
}

async function createUser(email, hash, fname, lname, eteamid) {
    let queryInfo = new Query('INSERT', 'EMPLOYEE');
    if (eteamid === 'null') {
        queryInfo.setSpecificInsert('email', 'epassword', 'fname', 'lname');
        queryInfo.setInsertValues(email, hash, fname, lname);
        queryInfo.setInsertValuesType('CHAR', 'CHAR', 'CHAR', 'CHAR');
    } else {
        queryInfo.setSpecificInsert('email', 'epassword', 'fname', 'lname', 'eteamid');
        queryInfo.setInsertValues(email, hash, fname, lname, eteamid);
        queryInfo.setInsertValuesType('CHAR', 'CHAR', 'CHAR', 'CHAR', 'NUMBER');
    }
    return await runQueryInfo(queryInfo);
}

async function createTeam(tname, organization, tmanager) {
    let queryInfo = new Query('INSERT', 'TEAM');
    queryInfo.setSpecificInsert('tname', 'organization', 'tmanager');
    queryInfo.setInsertValues(tname, organization, tmanager);
    queryInfo.setInsertValuesType('CHAR', 'CHAR', 'NUMBER');
    // TODO Update employee accordingly
    return await runQueryInfo(queryInfo);
}

async function createProject(pname, powner) {
    let queryInfo = new Query('INSERT', 'PROJECT');
    queryInfo.setSpecificInsert('pname', 'powner');
    queryInfo.setInsertValues(pname, powner);
    queryInfo.setInsertValuesType('CHAR', 'NUMBER');
    return await runQueryInfo(queryInfo);
}

async function createWorkRelation(wprojectid, wteamid) {
    let queryInfo = new Query('INSERT', 'WORKS_ON');
    queryInfo.setSpecificInsert('wprojectid', 'wteamid');
    queryInfo.setInsertValues(wprojectid, wteamid);
    queryInfo.setInsertValuesType('NUMBER', 'NUMBER');
    return await runQueryInfo(queryInfo);
}

async function createInterface(iname, iteam, iprojectid) {
    let queryInfo = new Query('INSERT', 'INTERFACE');
    if (iteam === 'null') {
        queryInfo.setSpecificInsert('iname', 'iprojectid');
        queryInfo.setInsertValues(iname, iprojectid);
        queryInfo.setInsertValuesType('CHAR', 'NUMBER');
    } else {
        queryInfo.setInsertValues(iname, iteam, iprojectid);
        queryInfo.setInsertValuesType('CHAR', 'NUMBER', 'NUMBER');
    }

    return await runQueryInfo(queryInfo);
}

async function createSetting(registerField, interfaceName, registerValue, bitNumber, sOwner) {
    let queryInfo = new Query('INSERT', 'SETTINGS');
    if (registerValue === 'null' && bitNumber === 'null') {
        queryInfo.setSpecificInsert('registerField', 'interfaceName', 'sOwner');
        queryInfo.setInsertValues(registerField, interfaceName, sOwner);
        queryInfo.setInsertValuesType('CHAR', 'CHAR', 'NUMBER');
    } else if (registerValue === 'null') {
        queryInfo.setSpecificInsert('registerField', 'interfaceName', 'registerValue', 'sOwner');
        queryInfo.setInsertValues(registerField, interfaceName, registerValue, sOwner);
        queryInfo.setInsertValuesType('CHAR', 'CHAR', 'CHAR', 'NUMBER');
    } else if (bitNumber === 'null') {
        queryInfo.setSpecificInsert('registerField', 'interfaceName', 'bitNumber', 'sOwner');
        queryInfo.setInsertValues(registerField, interfaceName, bitNumber, sOwner);
        queryInfo.setInsertValuesType('CHAR', 'CHAR', 'NUMBER', 'NUMBER');
    } else {
        queryInfo.setInsertValues(registerField, interfaceName, registerValue, bitNumber, sOwner);
        queryInfo.setInsertValuesType('CHAR', 'CHAR', 'CHAR', 'NUMBER', 'NUMBER');
    }
    return await runQueryInfo(queryInfo);
}

async function runQueryInfo(queryInfo) {
    let query = queryInfo.constructQuery();
    // TODO Remove this
    console.log(query);
    return await runQuery(query);
}

async function searchUserProjects(teamid) {
    let query = 'SELECT PROJECT.PROJECTID, PROJECT.PNAME \n' +
        'FROM TEAM\n' +
        'INNER JOIN WORKS_ON\n' +
        'ON TEAM.TEAMID = WORKS_ON.WTEAMID\n' +
        'INNER JOIN PROJECT\n' +
        'ON WORKS_ON.WPROJECTID = PROJECT.PROJECTID\n' +
        'WHERE TEAM.TEAMID = ' + teamid;

    return await runQuery(query);
}
async function searchUsersByInterface(iname) {
    let query = 'SELECT ETEAMID, WWID, FNAME, LNAME, EMAIL ' +
        'FROM EMPLOYEE ' +
        'INNER JOIN TEAM ' +
        'ON EMPLOYEE.ETEAMID = TEAM.TEAMID ' +
        'INNER JOIN INTERFACE ' +
        'ON TEAM.TEAMID = INTERFACE.ITEAM ' +
        'WHERE INTERFACE.INAME = \'' + iname + '\'';
    return await runQuery(query);
}

async function searchInterfaceSettings(iname) {
    let query = 'SELECT REGISTERFIELD, REGISTERVALUE ' +
        'FROM SETTINGS ' +
        'INNER JOIN INTERFACE ' +
        'ON SETTINGS.INTERFACENAME = INTERFACE.INAME ' +
        'WHERE INAME = \'' + iname + '\'';

    return await runQuery(query);
}

async function searchTeamMembers(teamid) {
    let query = 'SELECT WWID, EMAIL, FNAME, LNAME FROM EMPLOYEE WHERE ETEAMID = ' + teamid;
    return await runQuery(query);
}

async function searchInterfaceSettingsOwner(iname) {
    let query = 'SELECT REGISTERFIELD, SOWNER ' +
        'FROM SETTINGS ' +
        'INNER JOIN INTERFACE ' +
        'ON SETTINGS.INTERFACENAME = INTERFACE.INAME ' +
        'WHERE INAME = \'' + iname + '\'';

    console.log(query);
    return await runQuery(query);
}

async function updateSettingsOwner(iname, registerField, owner) {
    let query = 'UPDATE SETTINGS SET SOWNER = ' + owner + ' WHERE REGISTERFIELD=\'' + registerField + '\' AND ' +
        'INTERFACENAME=\'' + iname + '\'';
    console.log(query);
    return await runQuery(query);
}

async function getSettingByOwner(sowner) {
    let query = 'SELECT REGISTERFIELD, REGISTERVALUE FROM SETTINGS WHERE SOWNER=' + sowner;
    console.log(query);
    return await runQuery(query);
}

async function createQuickSetting(registerField, registerValue, sowner) {
    // FIXME If manager tries to add it crashes because it can't find a owner
    let interfaceInfo = await getInterfaceNameByOwner(sowner);
    console.log(interfaceInfo);
    let query = 'INSERT INTO SETTINGS VALUES (\'' + registerField + '\',\'' + interfaceInfo.rows[0][0] +
        '\',\'' + registerValue + '\',16,' + sowner + ')';
    console.log(query);
    return await runQuery(query);
}

async function getInterfaceNameByOwner(sowner) {
    let query = 'SELECT INAME ' +
        'FROM SETTINGS ' +
        'INNER JOIN INTERFACE ' +
        'ON SETTINGS.INTERFACENAME = INTERFACE.INAME ' +
        'WHERE SETTINGS.SOWNER = ' + sowner;

    return await runQuery(query);
}

async function updateSettingsField(registerField, newRegisterField, newRegisterValue, sOwner) {
    let interfaceName = await getInterfaceNameByOwner(sOwner);
    let query = 'UPDATE SETTINGS SET REGISTERFIELD=\'' + newRegisterField + '\'' +
        ', REGISTERVALUE=\'' + newRegisterValue + '\' WHERE REGISTERFIELD=\'' + registerField + '\' AND ' +
        'INTERFACENAME=\'' + interfaceName.rows[0][0] + '\'';
    console.log(query);
    return await runQuery(query);
}

async function createQuickProject(projectName, powner) {
    let query = 'INSERT INTO PROJECT (PNAME, POWNER) VALUES (\'' + projectName + '\', ' + powner + ')';
    console.log(query);
    return await runQuery(query);
}
