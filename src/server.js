const MovingAvg = require('./MovingAvg');

console.log('To test the algorithm try:\n'
    + ' npm test\n'
    + ' or\n'
    + ' node src/server.js test <sample size>\n');

if (process.argv[2].toLowerCase() === 'test')
    runSmaTest(process.argv[3]);





function runSmaTest(SampleCount) {
    var samples = [],
        SampleCount = SampleCount || 100000;

    // generate random samples
    console.log('Generating ' + SampleCount + ' samples');
    for (var i = 0; i < SampleCount; i++) {
        samples.push(Math.ceil(Math.random() * 100));
    }

    var LastAvg = 0;
    for (var i = 0; i < SampleCount; i++) {
        LastAvg = (LastAvg * i + samples[i]) / (i + 1);
        //    console.log(LastAvg);
    }
    var FinalHPAvg = LastAvg;

    console.log('SMA algorithm');
    LastAvg = 0;
    for (var i = 0; i < SampleCount; i++) {
        LastAvg = MovingAvg.calculateAverage(LastAvg, i + 1, samples[i]);
        //    console.log(LastAvg);
    }
    console.log('SMA calculation: ' + LastAvg);
    console.log('High-precision average: ' + FinalHPAvg);
}