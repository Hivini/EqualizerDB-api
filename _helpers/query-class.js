class Query {
    constructor(selector, table) {
        this.queryInfo = {
            'selector': selector,
            'attributes': [],
            'table': table,
            'whereConditions': [],
            'specificInsert': [],
            'insertValues': [],
            'insertValuesType': [],
            'updateAttributes': [],
            'updateValues': []
        }
    }

    constructQuery() {
        let query = '';
        switch (this.queryInfo.selector) {
            case 'SELECT':
                query += 'SELECT ';
                let attributeLength = this.queryInfo.attributes.length;
                for (let i = 0; i < attributeLength - 1; i++) {
                    query += this.queryInfo.attributes[i] + ", ";
                }
                // Add the last
                query += this.queryInfo.attributes[attributeLength-1] + " ";
                query += "FROM " + this.queryInfo.table;


                // Add the where statement if it exists
                if (this.queryInfo.whereConditions[0].length > 0) {
                    query += ' WHERE ';
                    let arrayLength = this.queryInfo.whereConditions.length;
                    for (let i = 0; i < arrayLength; i++) {
                        query += this.queryInfo.whereConditions[i] + ",";
                    }
                    query.trimRight();
                    query = query.substring(0, query.length-1); // Eliminate the last comma
                }
                return query;
            case 'INSERT':
                query += `INSERT INTO ${this.queryInfo.table} `;
                if (this.queryInfo.specificInsert.length > 0) {
                    query += '(';
                    let arrayLength = this.queryInfo.specificInsert.length;
                    for (let i = 0; i < arrayLength - 1; i++) {
                        query += this.queryInfo.specificInsert[i] + ", ";
                    }
                    // Add the last
                    query += this.queryInfo.specificInsert[arrayLength-1] + ") ";
                }
                query += 'VALUES (';
                let valuesLength = this.queryInfo.insertValues.length;
                for (let i = 0; i < valuesLength; i++) {
                    if (this.queryInfo.insertValuesType[i] === 'NUMBER') {
                        query += (this.queryInfo.insertValues[i] + ",");
                    } else {
                        query += `'${this.queryInfo.insertValues[i]}',`;
                    }
                }
                query.trimRight();
                query = query.substring(0, query.length-1); // Eliminate the last comma
                query += ')';
                return query;
            case "UPDATE":
                query += 'UPDATE ' + this.queryInfo.table + ' SET ';
                let attrLength = this.queryInfo.updateAttributes.length;
                for (let i = 0; i < attrLength - 1; i++) {
                    query += this.queryInfo.updateAttributes[i] + ", ";
                }
                // Add the last
                query += this.queryInfo.updateAttributes[attributeLength-1] + " ";
                query += "WHERE ";
                if (this.queryInfo.whereConditions[0].length > 0) {
                    query += ' WHERE ';
                    let arrayLength = this.queryInfo.whereConditions.length;
                    for (let i = 0; i < arrayLength; i++) {
                        query += this.queryInfo.whereConditions[i] + ",";
                    }
                    query.trimRight();
                    query = query.substring(0, query.length-1); // Eliminate the last comma
                }
                return query;
            case "DELETE":
                query += `DELETE FROM ${this.queryInfo.table} WHERE `;
                if (this.queryInfo.whereConditions[0].length > 0) {
                    query += ' WHERE ';
                    let arrayLength = this.queryInfo.whereConditions.length;
                    for (let i = 0; i < arrayLength; i++) {
                        query += this.queryInfo.whereConditions[i] + ",";
                    }
                    query.trimRight();
                    query = query.substring(0, query.length-1); // Eliminate the last comma
                }
                return query;
            default:
                return null;
        }
    }
    
    setAttributes(...args) {
        this.queryInfo.attributes = Query.generateArray(args);
    }

    setAttributesArray(attributes) {
        this.queryInfo.attributes = attributes;
    }

    setWhereConditions(...args) {
        this.queryInfo.whereConditions = Query.generateArray(args);
    }

    setWhereConditionsArray(conditions) {
        this.queryInfo.whereConditions = conditions[0];
    }

    setSpecificInsert(...args) {
        this.queryInfo.specificInsert = Query.generateArray(args);
    }

    setInsertValues(...args) {
        this.queryInfo.insertValues = Query.generateArray(args);
    }

    setInsertValuesType(...args) {
        this.queryInfo.insertValuesType = Query.generateArray(args);
    }

    static generateArray(...args) {
        let array = [];
        for (let i = 0; i < args[0].length; i++) {
            array.push(args[0][i]);
        }
        return array;
    }
}

module.exports = {
    Query
};
