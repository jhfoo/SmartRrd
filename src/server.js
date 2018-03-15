const MovingAvg = require('./MovingAvg');

if (process.argv.length < 3) {
    console.log('To test the algorithm try:\n'
    + ' npm test\n'
    + ' or\n'
    + ' node src/server.js test <sample size>\n');
    process.exit(0);
}

if (process.argv[2].toLowerCase() === 'test')
    runSmaTest(process.argv[3]);


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