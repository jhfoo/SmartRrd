const assert = require('assert'),
    Router = require('restify-router').Router,
    router = new Router(),
    errs = require('restify-errors'),
    log4js = require('log4js'),
    logger = log4js.getLogger(),
    DbConnFactory = require('../DbConnFactory'),
    Constant = require('../constants'),
    Config = require('../ConfigReader')('../conf/config.json'),
    SampleProcessor = require('../SampleProcessor');

let db = null;

router.get('/addSample', (req, res, next) => {
    try {
        logger.debug('Called: default.addSample()');
        SampleProcessor.addSample(assert(req.query.db));

        res.send({
            status: Constant.ApiResponse.OK,
        })
    }
    catch (err) {
        logger.error('ERROR: %s', err.message);
        next(err);
    }
});

router.get('/getDatabases', (req, res, next) => {
    try {
        logger.debug('Called: default.getDatabases()');
        getDb().getDatabases().then((resp) => {
            res.send({
                status: 'OK',
                data: resp.databases
            });
            next();
        }).catch((err) => {
            console.log(err);
            next(err);
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
});


router.post('/addSample', (req, res, next) => {
    logger.debug('Called: default.addSample()');
    logger.debug(req.body);
    res.send({
        status: Constant.ApiResponse.OK
    });
    next();
    // getDb().addSample(req.body).then((resp) => {
    //     logger.debug(resp);
    //     res.send('haha');
    //     next();
    // }).catch((err) => {
    //     logger.error(err);
    //     res.send(err);
    //     next();
    // });
});

router.get('/clearDatabase', (req, res, next) => {
    try {
        logger.debug('API call: default:/clearDatabase');
        logger.debug('Db: %s', getDb().conn);
        getDb().deleteAll().then((resp) => {
            res.send({
                status: Constant.ApiResponse.OK
            });
            next();
        }).catch((err) => {
            console.log(err);
            next(err);
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
});

router.get('/initDatabase', (req, res, next) => {
    getDb().getDatabases().then((data) => {
        console.log(data);
        if (data.databases.find((item) => {
            return item.name === 'smartrrd';
        })) {
            console.log('Database "smartrrd" exists');
        } else {
            console.log('Creating database "smartrrd"');
            return getDb().createDatabase('smartrrd');
        }
    }).then((resp) => {
        logger.debug('Database initialised');
    }).catch((err) => {
        logger.error(err);
    });
});

function getDb() {
    if (!db) {
        const DbConn = DbConnFactory.getDbConnClass(DbConnFactory.CLASS_MONGODB);
        db = new DbConn(Config.db.MongoDb);
    } 

    return db;
}

module.exports = router;