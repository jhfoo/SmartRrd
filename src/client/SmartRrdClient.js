"use strict"
const axios = require('axios');

class SmartRrdClient {
    constructor(opt) {
        console.log('SmartRrdClient.constructor()');
        if (!opt.dbase) {
            throw 'Missing key "dbase"';
        }
        this.dbase = opt.dbase;
        this.url = opt.url;
    }
    addSampleAsync(sample) {
        return axios.post('http://localhost:8000/api/addSample', sample);
    }
    getSamples(DateTimeStart, DateTimeEnd) {}
    clearDatabase(dbase) {
        let resp = await this.clearDatabaseAsync(dbase);
        return resp;
    }
    clearDatabaseAsync(dbase) {
        return axios.get('http://localhost:8000/api/clearDatabase?name=' + dbase);
    }
}

module.exports = SmartRrdClient;