const MovingAvg = require('./MovingAvg'),
    moment = require('moment'),
    DbConnFactory = require('./DbConnFactory'),
    DrawChart = require('./DrawChart');

const DbConn = DbConnFactory.getDbConnClass(DbConnFactory.CLASS_COUCHDB);


if (process.argv.length < 3) {
    console.log('To test the algorithm try:\n' +
        ' npm test\n' +
        ' or\n' +
        ' node src/server.js test <sample size>\n');

    const db = new DbConn({
        db: {
            host: 'localhost',
            protocol: 'http',
            port: 5984
        },
        table: 'test'
    });

    db.getDatabases().then((resp) => {
        console.log('Databases: %s', resp.join(','));
        return db.addSample({});

        // db.mango('test',{},{}).then((data) => {
        //     console.log(data);
        // }).catch((err) => {
        //     console.log(err);
        // });
    }).then((resp) => {
        return db.deleteAll();
    }).then((resp) => {
        let chart = new DrawChart();
        console.log('epoch: %s', moment('20180318000000','YYYYMMDDhhmmss').format('X'));
        let DateTimeStart = moment('20180318 000000','YYYYMMDD hhmmss');

        chart.draw({
            title: 'Minute-level traffic for Pi',
            YAxisName: 'Hits',
            XAxisName: 'Time',
            DateTimeStart: parseInt(DateTimeStart.format('X')),
            DateTimeEnd: parseInt(DateTimeStart.add(1,'h').add(2,'s').format('X')),
            DataPointIntervalSec: 60,
            data: [{
                DateTimeCreated: parseInt(moment('20180318 000100','YYYYMMDD hhmmss').format('X')),
                value: 10
            }, {
                DateTimeCreated: parseInt(moment('20180318 000500','YYYYMMDD hhmmss').format('X')),
                value: 15
            }]
        });
    }).then((resp) => {
        console.log('Done');
    }).catch((err) => {
        console.log(err);
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