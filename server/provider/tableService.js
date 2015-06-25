var debug = require('debug')('tableService'),
  Promise = require('songbird'),
  _ = require('lodash'),
  azure = require('azure');

function tableService(tableServiceClient) {
  this.client = tableServiceClient;
}

tableService.create = function(storageAccountName, storageAccountKey) {
  return new Promise(function(resolve, reject) {
    if (storageAccountName === undefined && storageAccountKey === undefined) {
      return reject('no credentials found');
    }

    try {
      var tableServiceClient = azure.createTableService(storageAccountName, storageAccountKey);
      return resolve(tableServiceClient);
    } catch (err) {
      debug(err);
      return reject(err);
    }
  });

}

tableService.prototype = {
  list: function() {
    var that = this;

    return new Promise(function(resolve, reject)
    {
      that.client.listTablesSegmented(null, function (error, result, response) {
        if (error) {
          debug(error);
          return reject(error);
        }

        var tableNames = _.map(result.entries.sort(), function (tableName) {
            return { tableName: tableName };
        });

        return resolve(tableNames);
      });
    });
  }
}

module.exports = tableService;
