import Ember from 'ember';
import DS from 'ember-data';
import config from '../config/environment';

export default DS.RESTAdapter.extend({
	host: config.APP.apiHost,

	ajax: function (url, type, hash) {
		if (Ember.isEmpty(hash)) {
			hash = {};
		}

	    if (Ember.isEmpty(hash.data)) {
	    	hash.data = {};
	    }
	    
	    hash.data.account = localStorage.storageAccountName;
	    hash.data.key = localStorage.storageAccountKey;

        return this._super(url, type, hash);
    }

	/*
	headers: function() {
		return {
			"storage_account_name": localStorage.storageAccountName,
	        "storage_account_key": localStorage.storageAccountKey
		};
	}.property().volatile()
	*/
});