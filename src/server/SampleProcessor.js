"use strict"
const logger = require('log4js').getLogger(),
    assert = require('assert');

class SampleProcessor {
    constructor(opt) {
        logger.debug('SampleProcessor.constructor()');
        if (!opt.url)
            throw 'Missing key "url"';
    }
    close() {
    }
    static addSample(sample) {
        logger.debug(sample);
    }
}

module.exports = SampleProcessor;