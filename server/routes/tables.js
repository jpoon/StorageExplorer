var debug = require('debug')('tables')
    , tableService = require('../provider/tableService.js')
    , _ = require('lodash')
    , azure = require('azure')
    , express = require('express')
    , router = express.Router();

router.use(function(req, res, next) {
  var account = process.env.AZURE_STORAGE_ACCOUNT || req.query["account"] || req.headers["storage_account_name"];
  var key = process.env.AZURE_STORAGE_ACCESS_KEY || req.query["key"] || req.headers["storage_account_key"];

  tableService.create(account, key).then(function(tableServiceClient){
    req.tableService = new tableService(tableServiceClient);
    next();
  }).catch(function(err){
    return next({
      status: 401,
      message: err
    });
  });
});

router.get('/', function (req, res, next) {
    var id = req.query["id"];

    if (id) {
      return res.redirect('/tables/' + id);
    }

    req.tableService.list().then(function(tableNames){
      return res.status(200).json({
        tables: tableNames
      });
    }).catch(function(err){
      return next({
        status: 500,
        message: err
      });
    });
});

router.get('/:tableName', function (req, res, next) {
    var tableHeadersPeekWindow = 25;

    if (!req.params.tableName) {
        return next({ status: 400 });
    }

    var query = new azure.TableQuery().top(50);

    req.tableService.queryEntities(req.params.tableName, query, null, function (error, result, response) {
        if (error) {
            debug(error);
            return next({ status: 500, message: error });
        }

        var heading = [];
        _.take(result.entries, tableHeadersPeekWindow).forEach(function(row) {
            _.map(Object.keys(row), function(key) {
                if (!_.isEqual(key, '.metadata')) {
                    heading.push(key);
                }
            });
        });

        var uniqueHeadings = _.unique(heading);

        var rows = []
        _.forEach(result.entries, function(row) {
            var parsedRow = {};

            _.forEach(uniqueHeadings, function(header) {
                var propertyName = header;
                var propertyValue = row[header];

                if (propertyValue) {
                    parsedRow[propertyName] = propertyValue._;
                } else {
                    parsedRow[propertyName] = "";
                }
            });

            rows.push(parsedRow);
        });

        _.forEach(uniqueHeadings, function(element, index){
             uniqueHeadings[index] = element;
        });

        res.status(200).json({
            tables: {
                tableName: req.params.tableName,
                headings: uniqueHeadings,
                rows: rows
            }
        });
    });
});

module.exports = router;
