var debug = require('debug')('tables')
    , tableServiceMiddleware = require('../middleware/tableService.js')
    , camelize = require('../helpers/camelize')
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
        var headerList = _(result.entries).slice(0, 25).map(function(row) {
            return Object.keys(row);
        });

        var uniqueHeaders = headerList.flatten().unique().reject(function(header) {
            return _.startsWith(header, '.metadata');
        });

        console.log(uniqueHeaders.value());
        var rows = []
        result.entries.forEach(function (row) {
            var parsedRow = {};
            for (var propertyName in row) {
                var propertyValue = row[propertyName]._;

                if (propertyName && propertyValue) {
                    parsedRow[camelize(propertyName)] = propertyValue;
                }
            }

            uniqueHeaders.difference(Object.keys(row)).forEach(function (nullHeader) {
                parsedRow[nullHeader] = "";
            }).value();

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