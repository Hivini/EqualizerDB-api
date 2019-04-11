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
    createSetting
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
    let query = "SELECT * FROM EMPLOYEES WHERE id=" + id;
    let user = await runQuery(query);
    if (!user.rows.length > 0) {
        return [];
    }

    return {
        id: user.rows[0][0],
        firstName: user.rows[0][1],
        lastName: user.rows[0][2],
        password: user.rows[0][3]
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
        queryInfo.setSpecificInsert('email', 'password', 'fname', 'lname');
        queryInfo.setInsertValues(email, hash, fname, lname);
        queryInfo.setInsertValuesType('CHAR', 'CHAR', 'CHAR', 'CHAR');
    } else {
        queryInfo.setSpecificInsert('email', 'password', 'fname', 'lname', 'eteamid');
        queryInfo.setInsertValues(email, hash, fname, lname, eteamid);
        queryInfo.setInsertValuesType('CHAR', 'CHAR', 'CHAR', 'CHAR', 'NUMBER');
    }
    return await runQueryInfo(queryInfo);
}

async function createTeam(tname, organization, tmanager) {
    let queryInfo = new Query('INSERT', 'TEAM');
    queryInfo.setSpecificInsert('tname', 'organization', 'tmanager');
    queryInfo.setInsertValues('tname', organization, tmanager);
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
    console.log(query);
    return await runQuery(query);
}
