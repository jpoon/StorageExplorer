import Ember from 'ember';
import DS from 'ember-data';
import config from '../config/environment';

export default DS.RESTAdapter.extend({
  host: config.APP.apiHost,

  headers: {
    "storage_account_name": localStorage.storageAccountName,
    "storage_account_key": localStorage.storageAccountKey,
  }
});
