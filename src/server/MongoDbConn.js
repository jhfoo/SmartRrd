"use strict"
const MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

class MongoDbConn {
    constructor(opt) {
        console.log('MongoDbConn.constructor()');
        if (!opt.url)
            throw 'Missing key "url"';

        var self = this;
        MongoClient.connect(opt.url, (err, db) => {
            if (err)
                throw err;

            console.log('Connected to Mongo server');
            self.conn = db;
            self.url = opt.url;
            self.dbase = 'smartrrd';
        });
    }
    close() {
        self.conn.close();
        self.conn = null;
    }
    createDatabase(dbname) {
        return new Promise((resolve, reject) => {
            console.log(this.url + '/' + dbname);
            MongoClient.connect(this.url + '/' + dbname, (err, db) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(db);
                    // close connection
                    db.close();
                    resolve();
                }
            });
        });
    }
    getDatabases() {
        return new Promise((resolve, reject) => {
            this.conn.db('admin').command({
                listDatabases: 1
            }, (err, data) => {
                if (err)
                    reject(err);

                // OK
                resolve(data);
            });
        });
    }
    addSample(sample) {
        // this is the right way to promisify a method involving a promised execution
        return new Promise((resolve, reject) => {
            // is this the right way to validate expected keys?
            // assert.strictEqual(sample, undefined);
            if (!sample)
                throw 'Missing input object';
            if (!sample.value)
                throw 'Missing value key';
            if (!sample.GroupId)
                throw 'Missing GroupId key';
            if (!sample.MetricId)
                throw 'Missing MetricId key';

            try {
                if (!sample.DateTimeCreated)
                    sample.DateTimeCreated = (new Date()).getTime();
                this.conn.db(this.dbase).collection('smartrrd').insertOne(sample);
                resolve();
            } catch (err) {
                console.error(err);
                reject(err);
            }
        });
    }
    getSamples(DateTimeStart, DateTimeEnd) {
        return new Promise((resolve, reject) => {
            console.log('getSamples: %s, %s', DateTimeStart, DateTimeEnd);
            return this.conn.db(this.dbase).collection('smartrrd').find({
                DateTimeCreated: {
                    $gte: DateTimeStart,
                    $lte: DateTimeEnd
                }
            }).toArray((err, data) => {
                if (err)
                    return reject(err);
                
                // else
                console.log(data);
                resolve(data);
            });

        });
    }
    deleteAll() {
        return this.conn.dropDatabase(this.dbase).then((resp) => {
            return this.conn.createDatabase(this.dbase);
        });
    }
}

module.exports = MongoDbConn;