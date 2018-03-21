module.exports = {
    service: {
        port: 8000,
    },
    log4js: {
        appenders: {
            screen: {
                type: 'console'
            }
        },
        categories: {
            default: {
                appenders: ['screen'],
                level: 'debug'
            }

        }
    },
    db: {
        CouchDb: {
            db: {
                host: 'localhost',
                protocol: 'http',
                port: 5984
            },
            table: 'test'
        }
    }
};