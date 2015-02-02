var debug = require('debug')('tableService')
    , azure = require('azure');

module.exports = function (req, res, next) {
    var account = process.env.AZURE_STORAGE_ACCOUNT || req.query["account"];
    var key = process.env.AZURE_STORAGE_ACCESS_KEY || req.query["key"];

    if (account === undefined && key === undefined) {
        debug('400');
        return next({ status: 400 });
    }
    
    try {
        req.tableService = azure.createTableService(account, key);
    }
	catch (err) {
        debug(err.message);
        return next({ status: 403 });
    }
    
    next();
}