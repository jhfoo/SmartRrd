"use strict"

class MovingAverage {
    constructor() {
        this.LastAverage = 0;
        this.TotalSamples = 0;
    }
    addSample(NewSample) {
        this.TotalSamples++;
        this.LastAverage = this.LastAverage - this.LastAverage / this.TotalSamples + NewSample / this.TotalSamples;
        return this.LastAverage;
    }
    result() {
        return this.LastAverage;
    }
    reset() {
        this.LastAverage = 0;
        this.TotalSamples = 0;
    }
}

module.exports = MovingAverage;




