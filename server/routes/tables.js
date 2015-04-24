var debug = require('debug')('tables')
    , tableServiceMiddleware = require('../middleware/tableService.js')
    , _ = require('lodash')
    , azure = require('azure')
    , express = require('express')
    , router = express.Router();

router.use(tableServiceMiddleware);

router.get('/', function (req, res, next) {
    req.tableService.listTablesSegmented(null, function (error, result, response) {
        if (error) {
            debug(error);
            return next({ status: 500, message: error });
        }

        var tableNames = _.map(result.entries.sort(), function (tableName) {
            return { tableName: tableName };
        });

        res.status(200).json({
            tables: tableNames
        });
    });
});

router.get('/:tableName', function (req, res, next) {
    var tableHeadersTop = 25;
    // column heading
    var peekSize = 25;

    if (!req.params.tableName) {
        return next({ status: 400 });
    }

    var query = new azure.TableQuery().top(25);

    req.tableService.queryEntities(req.params.tableName, query, null, function (error, result, response) {
        if (error) {
            debug(error);
            return next({ status: 500, message: error });
        }

        var heading = [];
        _.take(result.entries, tableHeadersTop).forEach(function(row) {
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

            console.log(row);
            _.forEach(uniqueHeadings, function(header) {
                var propertyName = header;
                var propertyValue = row[header];

                console.log(header);
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