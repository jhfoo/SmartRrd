const fs = require('fs'),
    path = require('path');

module.exports = (ConfigFile, RunMode) => {
    const ConfigFilePath = path.resolve(__dirname + '/' + ConfigFile);
    console.log('path: %s', ConfigFilePath);
    const config = JSON.parse(fs.readFileSync(ConfigFilePath));
    // keywords: production, staging, development, default
    if (!RunMode) {
        RunMode = process.env.NODE_ENV ? process.env.NODE_ENV : 'default';
    }

    if (config[RunMode]) {
        // copy keys from RunMode as root keys
        Object.keys(config[RunMode]).forEach((key) => {
            config[key] = config[RunMode][key];
        });
    }

    return config;
};
