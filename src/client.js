const axios = require('axios'),
    moment = require('moment');

axios.post('http://localhost:8000/api/addSample', {
    GroupId: 'test',
    MetricId: 'count',
    DateTimeCreated: parseInt(moment('20180318 000800', 'YYYYMMDD hhmmss').format('X')),
    value: 10
}).then((resp) => {
    console.log(resp);
}).catch((err) => {
    console.log(err);
});