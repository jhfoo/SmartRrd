"use strict"

class CouchDbConn {
    constructor() {
        this.LastAverage = 0;
        this.TotalSamples = 0;
    }
    addSample(NewSample) {
        this.TotalSamples++;
        this.LastAverage = this.LastAverage - this.LastAverage / this.TotalSamples + NewSample / this.TotalSamples;
        return this.LastAverage;
    }
    result() {
        return this.LastAverage;
    }
    reset() {
        this.LastAverage = 0;
        this.TotalSamples = 0;
    }
}

const CLASS_COUCHDB = 'COUCHDB';

module.exports = {
    CLASS_COUCHDB: CLASS_COUCHDB,
    getDbConnClass: (className) => {
        if (className === CLASS_COUCHDB)
            return require('./CouchDbConn');
        throw 'Unsupported class: ' + className; 
    }
};




