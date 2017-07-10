function calculateAverage (LastAverage, TotalSamples, NewSample) {
    return LastAverage - LastAverage / TotalSamples + NewSample / TotalSamples;
}

module.exports = {
    calculateAverage: calculateAverage
}