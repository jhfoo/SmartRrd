"use strict"
const NodeCouchDb = require('node-couchdb');

class CouchDbConn {
    constructor(opt) {
        this.conn = new NodeCouchDb(opt.db);
        this.dbase = opt.table;
        console.log('CouchDbConn.constructor()');
    }
    getDatabases() {
        return this.conn.listDatabases();
    }
    addSample(sample) {
        if (!sample)
            sample = {};
        sample.DateTimeCreated = (new Date()).getTime();
        return this.conn.insert(this.dbase, sample);
    }
    deleteAll() {
        return this.conn.dropDatabase(this.dbase).then((resp) => {
            return this.conn.createDatabase(this.dbase);
        });
    }
}

module.exports = CouchDbConn;




