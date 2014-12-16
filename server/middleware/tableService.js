var azure = require('azure');

module.exports = function (req, res, next) {
    var account = process.env.AZURE_STORAGE_ACCOUNT || req.query["account"];
    var key = process.env.AZURE_STORAGE_ACCESS_KEY || req.query["key"];

    if (account === undefined && key === undefined) {
        return res.send(400);
    }
    
    try {
        req.tableService = azure.createTableService(account, key);
    }
	catch (err) {
        return res.send(403);
    }
    
    next();
}