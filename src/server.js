const MovingAvg = require('./MovingAvg');

var samples = [],
    SampleCount = 10000;

// generate random samples
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