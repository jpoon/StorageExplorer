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

        var tableNames = [];
        
        var id = 0;
        result.entries.sort().forEach(function (tableName) {
            tableNames.push({ tableName: tableName });
        });

        res.status(200).json({
           // name: req.tableService.storageAccount,
            tables: tableNames
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
        
        var id = 0;
        result.entries.forEach(function (row) {
            var parsedRow = {};
            for (var propertyName in row) {
                var propertyValue = row[propertyName]._;
                
                if (propertyName && propertyValue) {
                    parsedRow[propertyName] = propertyValue;
                }
            }

            parsedRow['id'] = id++;
            rows.push(parsedRow);
        });

        var response = {};
        response[req.params.tableName] = rows;

        res.status(200).json({
           // name: req.tableService.storageAccount,
            table: rows
        });        

        //res.status(200).json(response);
    });
});

module.exports = router;