﻿var debug = require('debug')('tables')
    , tableServiceMiddleware = require('../middleware/tableService.js')
    , camelize = require('../helpers/camelize')
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

        var tableNames = [];
        
        var id = 0;
        result.entries.sort().forEach(function (tableName) {
            tableNames.push({ tableName: tableName });
        });

        res.status(200).json({
            tables: tableNames
        });
    });
});

router.get('/:tableName', function (req, res, next) {
    if (!req.params.tableName) {
        return next({ status: 400 });
    }

    var query = new azure.TableQuery()
                         .top(100);

    req.tableService.queryEntities(req.params.tableName, query, null, function (error, result, response) {
        if (error) {
            debug(error);
            return next({ status: 500, message: error });
        }
        
        var rows = []
        
        result.entries.forEach(function (row) {
            var parsedRow = {};
            for (var propertyName in row) {
                var propertyValue = row[propertyName]._;
                
                if (propertyName && propertyValue) {
                    parsedRow[camelize(propertyName)] = propertyValue;
                }
            }

            rows.push(parsedRow);
        });

        res.status(200).json(rows);        
    });
});

module.exports = router;