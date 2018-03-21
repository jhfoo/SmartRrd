const MovingAvg = require('./MovingAvg'),
    moment = require('moment'),
    DbConnFactory = require('./DbConnFactory'),
    DrawChart = require('./DrawChart'),
    restify = require('restify'),
    Config = require('./conf/Config'),
    log4js = require('log4js');

// primary init: setup logger
log4js.configure(Config.log4js);
const logger = log4js.getLogger();

// secondary init
const DbConn = DbConnFactory.getDbConnClass(DbConnFactory.CLASS_COUCHDB),
    db = new DbConn(Config.db.CouchDb),
    server = restify.createServer();

// config REST service
server.use(restify.plugins.bodyParser());
server.post('/api/addSample', (req, res, next) => {
    logger.debug(req.body);
    db.addSample(req.body).then((resp) => {
        resp.send('haha');
        return next();
    }).catch((err) => {
        res.send(err);
        return next();
    });
});

// start REST service
server.listen(Config.service.port, () => {
    logger.debug('Listening on %s', server.url);
});

if (process.argv.length < 3) {
    console.log('To test the algorithm try:\n' +
        ' npm test\n' +
        ' or\n' +
        ' node src/server.js test <sample size>\n');


    db.deleteAll().then((resp) => {
        return db.getDatabases();
    }).then((resp) => {
        logger.debug('Databases: %s', resp.join(','));
        return db.addSample({
            GroupId: 'test',
            MetricId: 'count',
            DateTimeCreated: parseInt(moment('20180318 000800', 'YYYYMMDD hhmmss').format('X')),
            value: 10
        });
    }).then(() => {
        return db.addSample({
            GroupId: 'test',
            MetricId: 'count',
            DateTimeCreated: parseInt(moment('20180318 000100', 'YYYYMMDD hhmmss').format('X')),
            value: 15
        });
    }).then(() => {
        return db.addSample({
            GroupId: 'test',
            MetricId: 'count',
            DateTimeCreated: parseInt(moment('20180318 000500', 'YYYYMMDD hhmmss').format('X')),
            value: 18
        });
        // db.mango('test',{},{}).then((data) => {
        //     console.log(data);
        // }).catch((err) => {
        //     console.log(err);
        // });
    }).then((resp) => {
        let DateTimeStart = moment('20180318 000000', 'YYYYMMDD hhmmss');
        return db.getSamples(parseInt(DateTimeStart.format('X')),
            parseInt(DateTimeStart.add(1, 'h').add(2, 's').format('X')));
    }).then((resp) => {
        logger.debug(JSON.stringify(resp));
        let chart = new DrawChart();
        logger.debug('epoch: %s', moment('20180318000000', 'YYYYMMDDhhmmss').format('X'));
        let DateTimeStart = moment('20180318 000000', 'YYYYMMDD hhmmss');

        chart.draw({
            title: 'Minute-level traffic for Pi',
            YAxisName: 'Hits',
            XAxisName: 'Time',
            DateTimeStart: parseInt(DateTimeStart.format('X')),
            DateTimeEnd: parseInt(DateTimeStart.add(1, 'h').add(2, 's').format('X')),
            DataPointIntervalSec: 60,
            data: resp.data.docs
        });
    }).then((resp) => {
        logger.debug('Done');
    }).catch((err) => {
        logger.error(err);
    });

} else {
    if (process.argv[2].toLowerCase() === 'test')
        runSmaTest(process.argv[3]);

}


function calculateAverage(LastAverage, TotalSamples, NewSample) {
    return LastAverage - LastAverage / TotalSamples + NewSample / TotalSamples;
}



function runSmaTest(SampleCount) {
    var samples = [],
        SampleCount = SampleCount || 100000,
        calc = new MovingAvg();

    // generate random samples
    console.log('Generating ' + SampleCount + ' samples');
    for (var i = 0; i < SampleCount; i++) {
        samples.push(Math.ceil(Math.random() * 100));
    }

    var LastAvg = 0;
    for (var i = 0; i < SampleCount; i++) {
        LastAvg = (LastAvg * i + samples[i]) / (i + 1);
        // SMA add
        calc.addSample(samples[i]);
        //    console.log(LastAvg);
    }
    var FinalHPAvg = LastAvg;

    console.log('SMA calculation: ' + calc.result());
    console.log('High-precision average: ' + FinalHPAvg);

    if (SampleCount < 10) {
        console.log('Samples: %s', samples.join(','));
    }
}