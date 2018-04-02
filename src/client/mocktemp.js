const axios = require('axios'),
    SmartRrdClient = require('./SmartRrdClient'),
    Promise = require('bluebird');

const OpenWeatherMapConfig = {
        AppId: '46203418bcd2e2cbad9dcf4002fbc27b',
        unit: 'metric',
        ZipCode: '75023'
    },
    SmartRrdServiceConfig = {
        ServiceUrlBase: 'http://localhost:8000',
        dbase: 'test',
        MetricId: 'count',
        GroupId: 'test'
    },
    client = new SmartRrdClient(SmartRrdServiceConfig);


function getWeatherInfo() {
    return axios.get('http://api.openweathermap.org/data/2.5/weather?zip=' + OpenWeatherMapConfig.ZipCode +
        ',us&appid=' + OpenWeatherMapConfig.AppId + '&units=' + OpenWeatherMapConfig.unit);
}

function getDataNUpdate() {
    getWeatherInfo().then((resp) => {
        console.log(resp.data);
        return client.addSampleAsync({
            value: resp.data.main.temp
        });
    }).then((resp) => {
        console.log(resp.data);
        console.log('OK');
        setTimeout(() => {
            getDataNUpdate();
        }, 20 * 1000);
    }).catch((err) => {
        console.error(err);
        setTimeout(() => {
            getDataNUpdate();
        }, 20 * 1000);
    });
}

getDataNUpdate();