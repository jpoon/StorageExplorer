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

    if (!req.params.tableName) {
        return next({ status: 400 });
    }

    var query = new azure.TableQuery();

    req.tableService.queryEntities(req.params.tableName, query, null, function (error, result, response) {
        if (error) {
            debug(error);
            return next({ status: 500, message: error });
        }

        // column heading
        var peekSize = 30;

        var heading = [];
        _(result.entries).slice(0, peekSize).forEach(function(row) {
            _.map(Object.keys(row), function(key) {
                if (!_.isEqual(key, '.metadata')) {
                    heading.push(_.camelCase(key));
                }
            });
        }).value();

        var uniqueHeadings = _.unique(heading);

        var rows = []
        result.entries.forEach(function (row) {
            var parsedRow = {};

            uniqueHeadings.forEach(function(header) {
                parsedRow[header] = "";
            });

            for (var propertyName in row) {
                var propertyValue = row[propertyName]._;

                if (propertyName && propertyValue) {
                    parsedRow[_.camelCase(propertyName)] = propertyValue;
                }
            }

            rows.push(parsedRow);
        });

        res.status(200).json({
            tables: {
                tableName: req.params.tableName,
                rows: rows
            }
        });
    });
});

module.exports = router;