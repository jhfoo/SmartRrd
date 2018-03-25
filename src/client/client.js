const axios = require('axios'),
    moment = require('moment'),
    Config = require('../conf/Config'),
    log4js = require('log4js'),
    SmartRrdClient = require('./SmartRrdClient');

// primary init: setup logger
log4js.configure(Config.log4js);
const logger = log4js.getLogger();

client = new SmartRrdClient({
    url: 'http://localhost:8000',
    dbase: 'x'
});

let resp = client.clearDatabase();
logger.debug(resp);
client.addSampleAsync({
    GroupId: 'test',
    MetricId: 'count',
    DateTimeCreated: parseInt(moment('20180318 000800', 'YYYYMMDD hhmmss').format('X')),
    value: 11
}).then((resp) => {
    logger.debug(resp);
}).catch((err) => {
    logger.error(err);
});
