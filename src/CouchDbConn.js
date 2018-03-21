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
        // this is the right way to promisify a method involving a promised execution
        return Promise.resolve().then(() => {
            if (!sample)
                throw 'Missing input object';
            if (!sample.value)
                throw 'Missing value key';
            if (!sample.GroupId)
                throw 'Missing GroupId key';
            if (!sample.MetricId)
                throw 'Missing MetricId key';

            if (!sample.DateTimeCreated)
                sample.DateTimeCreated = (new Date()).getTime();
            return this.conn.insert(this.dbase, sample);
        });
    }
    getSamples(DateTimeStart, DateTimeEnd) {
        console.log('getSamples: %s, %s', DateTimeStart, DateTimeEnd);
        return this.conn.mango(this.dbase, {
            selector: {
                DateTimeCreated: {
                    $gte: DateTimeStart,
                    $lte: DateTimeEnd
                }
            }
        });
    }
    deleteAll() {
        return this.conn.dropDatabase(this.dbase).then((resp) => {
            return this.conn.createDatabase(this.dbase);
        });
    }
}

module.exports = CouchDbConn;