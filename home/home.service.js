const db = require('../_helpers/db');

module.exports = {
    search
};

async function search(query) {
    return db.sqlSearch(query);
}
