const MovingAvg = require('./MovingAvg'),
    moment = require('moment'),
    DrawChart = require('./DrawChart'),
    restify = require('restify'),
    // Config = require('../conf/Config'),
    log4js = require('log4js'),
    errs = require('restify-errors'),
    Router = require('restify-router').Router,
    router = new Router(),
    Config = require('./ConfigReader')('../conf/config.json');
    
// primary init: setup logger
log4js.configure(Config.log4js);
const logger = log4js.getLogger();

// secondary init
const server = restify.createServer({
    formatters: {
        'text/plain': (req, res, body) => {
            logger.debug('In formatters');
            if (body instanceof Error) {
                return body.message;
            }        
        }
    }
});

// config REST service
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser({
    mapParams: false
}));

server.get('/api/.*', (req, res, next) => {
    res.send({
        status: 'ERROR',
        message: 'Invalid URI'
    });
});


server.post('/api/drawChart', async (req, res, next) => {
    logger.debug('API call: /api/drawChart');

    try {
        let chart = new DrawChart();

        let DateTimeStart = parseInt(req.body.DateTimeStart),
            DateTimeEnd = parseInt(req.body.DateTimeEnd),
            docs = await db.getSamples(DateTimeStart, DateTimeEnd);
        
        // sanitise data
        if (docs.data)
            docs = docs.data.docs;

        logger.debug(docs);
        chart.draw({
            title: 'Minute-level traffic for Pi',
            YAxisName: 'Hits',
            XAxisName: 'Time',
            DateTimeStart: DateTimeStart,
            DateTimeEnd: DateTimeEnd,
            DataPointIntervalSec: parseInt(req.body.DataPointIntervalSec),
            data: docs
        });

        res.send('OK');
        next();
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

// server.get('/api/.*', (req, res, next) => {
//     res.send({
//         status: 'ERROR',
//         message: 'Invalid URI'
//     });
//     next();
// });

server.on('InternalServer', (req, res, err, next) => {
    logger.error('InternalServer');
    next(new errs.InternalServerError('argh!'));
});

// server.on('restifyError', function (req, res, err, next) {
//     logger.error(err.message);

//     err = new errs.InternalServerError('argh!');
//     // err.toJSON = function customToJSON() {
//     //     logger.error('toJSON');
//     //     return {
//     //         status: 'ERROR',
//     //         name: err.name,
//     //         message: err.message
//     //     };
//     // };
//     // // err.toString = function customToString() {
//     // //     logger.error('toString');
//     // //     logger.error('ERR.NAME: %s', err.name);
//     //     // {
//     //     //     status: 'ERROR',
//     //     //     name: err.name,
//     //     //     message: err.message
//     //     // };
//     // // };
//     // err.toString = function customToString() {
//     //     return 'i just want a string';
//     // };
//     return next(err);
// });

// register routes
router.add('/api', require('./ApiPlugins/default.js'));
router.applyRoutes(server);


// start REST service
server.listen(Config.server.port, () => {
    logger.debug('%s listening on %s', server.name, server.url);
});

if (process.argv.length < 3) {
    console.log('To test the algorithm try:\n' +
        ' npm test\n' +
        ' or\n' +
        ' node src/server.js test <sample size>\n');

    // initDatabase();

    // db.deleteAll().then((resp) => {
    //     return db.getDatabases();
    // }).then((resp) => {
    //     logger.debug('Databases: %s', resp.join(','));
    //     return db.addSample({
    //         GroupId: 'test',
    //         MetricId: 'count',
    //         DateTimeCreated: parseInt(moment('20180318 000800', 'YYYYMMDD hhmmss').format('X')),
    //         value: 10
    //     });
    // }).then(() => {
    //     return db.addSample({
    //         GroupId: 'test',
    //         MetricId: 'count',
    //         DateTimeCreated: parseInt(moment('20180318 000100', 'YYYYMMDD hhmmss').format('X')),
    //         value: 15
    //     });
    // }).then(() => {
    //     return db.addSample({
    //         GroupId: 'test',
    //         MetricId: 'count',
    //         DateTimeCreated: parseInt(moment('20180318 000500', 'YYYYMMDD hhmmss').format('X')),
    //         value: 18
    //     });
    //     // db.mango('test',{},{}).then((data) => {
    //     //     console.log(data);
    //     // }).catch((err) => {
    //     //     console.log(err);
    //     // });
    // }).then((resp) => {
    //     let DateTimeStart = moment('20180318 000000', 'YYYYMMDD hhmmss');
    //     return db.getSamples(parseInt(DateTimeStart.format('X')),
    //         parseInt(DateTimeStart.add(1, 'h').add(2, 's').format('X')));
    // }).then((resp) => {
    //     logger.debug(JSON.stringify(resp));
    // }).then((resp) => {
    //     logger.debug('Done');
    // }).catch((err) => {
    //     logger.error(err);
    // });

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