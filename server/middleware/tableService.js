var debug = require('debug')('tableService')
    , azure = require('azure');

module.exports = function (req, res, next) {
    var account = process.env.AZURE_STORAGE_ACCOUNT || req.query["account"] || req.headers["storage_account_name"];
    var key = process.env.AZURE_STORAGE_ACCESS_KEY || req.query["key"] || req.headers["storage_account_key"];

    if (account === undefined && key === undefined) {
        debug('400');
        return next({ status: 400 });
    }
    
    try {
        req.tableService = azure.createTableService(account, key);
    }
	catch (err) {
        debug(err);
        return next({ status: 403, message: err });
    }

    next();
}