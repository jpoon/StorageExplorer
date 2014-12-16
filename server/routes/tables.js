var tableServiceMiddleware = require('../middleware/tableService.js'),
    azure = require('azure'),
    express = require('express'),
    router = express.Router();

router.use(tableServiceMiddleware);

router.get('/', function (req, res) {
    req.tableService.listTablesSegmented(null, function (error, result, response) {
        if (error) {
            console.log(error);
            res.send(500);
        }

        var tables = [];

        for (var index = 0; index < result.entries.length; index++) {
            var tableName = result.entries[index];
            tables.push(tableName);
        }

        res.json({
            name: req.tableService.storageAccount,
            tables: tables,
        });
    });
});

router.get('/:tableName', function (req, res, next) {
    req.tableService.queryEntities(req.params.tableName, null, null, function (error, result, response) {
        if (error) {
            console.log(error);
            res.send(500);
        }
        
        var rows = []
        
        for (var index = 0; index < result.entries.length; index++) {
            var row = result.entries[index];
            
            var parsedRow = {};
            for (var propertyName in row) {
                var propertyValue = row[propertyName]._;
                
                if (propertyName && propertyValue) {
                    parsedRow[propertyName] = propertyValue;
                }
            }

            rows.push(parsedRow);
        }

        res.json({
            name: req.params.tableName,
            rows: rows
        });
    });
});

module.exports = router;