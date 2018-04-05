"use strict"
const axios = require('axios'),
    moment = require('moment');

class SmartRrdClient {
    constructor(opt) {
        console.log('SmartRrdClient.constructor()');
        if (!opt.dbase) {
            throw 'Missing key "dbase"';
        }
        this.GroupId = opt.GroupId ? opt.GroupId : null;
        this.MetricId = opt.MetricId ? opt.MetricId : null; 
        this.dbase = opt.dbase;
        this.url = opt.url;
    }
    addSampleAsync(sample) {
        if (!sample.DateTimeCreated)
            sample.DateTimeCreated = parseInt(moment().format('X'));
        if (!sample.GroupId)
            sample.GroupId = this.GroupId;
        if (!sample.MetricId)
            sample.MetricId = this.MetricId;
        return axios.post('http://localhost:8000/api/addSample', sample);
    }
    getSamples(DateTimeStart, DateTimeEnd) {}
    drawChart(opt) {
        console.log('SmartRrdClient.drawChart()');
        return axios.post('http://localhost:8000/api/drawChart', opt);
    }
    clearDatabase(dbase) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve("done!"), 1000)
          });

        if (!dbase)
            dbase = this.dbase;
        return axios.get('http://localhost:8000/api/clearDatabase?name=' + dbase);
    }
}

module.exports = SmartRrdClient;