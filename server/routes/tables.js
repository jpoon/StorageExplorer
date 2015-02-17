var debug = require('debug')('tables')
    , tableServiceMiddleware = require('../middleware/tableService.js')
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

        var tables = [];
        
        result.entries.forEach(function (tableName) {
            tables.push(tableName);
        });

        res.status(200).json({
            name: req.tableService.storageAccount,
            tables: tables,
            meta: {
                total: result.entries.length
            }
        });
    });
});

router.get('/:tableName', function (req, res, next) {
    if (!req.params.tableName) {
        return next({ status: 400 });
    }

    var query = new azure.TableQuery()
                         .top(50);

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
                    parsedRow[propertyName] = propertyValue;
                }
            }
            
            rows.push(parsedRow);
        });

        res.status(200).json({
            name: req.params.tableName,
            rows: rows
        });
    });
});

module.exports = router;