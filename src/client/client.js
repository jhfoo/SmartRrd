const axios = require('axios'),
    moment = require('moment'),
    Config = require('../conf/Config'),
    log4js = require('log4js'),
    SmartRrdClient = require('./SmartRrdClient');

// primary init: setup logger
log4js.configure(Config.log4js);
const logger = log4js.getLogger();

// async function doAsync() {
//     let resp = await new Promise((resolve, reject) => {
//         setTimeout(() => resolve("done!"), 1000)
//       });
//     console.log(resp);
//     return resp;
// }

// console.log(doAsync().then((resp) => {
//     console.log(resp);
// }));

let client = new SmartRrdClient({
    url: 'http://localhost:8000',
    dbase: 'test'
});

testClient();

async function testClient() {
    let resp = await client.clearDatabase('test');
    logger.debug('Sync resp: ' + resp);
    let data = [{
        GroupId: 'test',
        MetricId: 'count',
        DateTimeCreated: parseInt(moment('20180318 000800', 'YYYYMMDD hhmmss').format('X')),
        value: 11
    }, {
        GroupId: 'test',
        MetricId: 'count',
        DateTimeCreated: parseInt(moment('20180318 000100', 'YYYYMMDD hhmmss').format('X')),
        value: 15
    }, {
        GroupId: 'test',
        MetricId: 'count',
        DateTimeCreated: parseInt(moment('20180318 000500', 'YYYYMMDD hhmmss').format('X')),
        value: 18
    }];
    while (data.length > 0) {
        let item = data.shift();
        logger.debug('client.addSampleAsync');
        let result = await client.addSampleAsync(item);
        logger.debug(resp);
    }

    // draw chart
    logger.debug('epoch: %s', moment('20180318000000', 'YYYYMMDDhhmmss').format('X'));
    let DateTimeStart = moment('20180318 000000', 'YYYYMMDD hhmmss');
    client.drawChart({
        DateTimeStart: DateTimeStart.format('X'),
        DateTimeEnd: DateTimeStart.add(1, 'h').add(2, 's').format('X'),
        DataPointIntervalSec: 60
    }).then((resp) => {
        logger.debug(resp);
    }).catch((err) => {
        logger.error(err);
    });
}