import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
    beforeModel: function() {
        var name = this.controllerFor('application').get('storageAccountName');
        var key = this.controllerFor('application').get('storageAccountKey');

        if (!name || !key) {
            this.transitionTo('application');
        }

        this.controllerFor('tables').set('showProgress', true);
    },

    model: function(params) {
        var storageAccountName = this.controllerFor("application").get('storageAccountName');
        var storageAccountKey = this.controllerFor("application").get('storageAccountKey');
        var url = config.APP.apiHost + '/tables/' + params.tableName + '?account=' + storageAccountName + '&key=' + storageAccountKey;
        Ember.Logger.info('url', url);

        return Ember.$.getJSON(url)     
                    .fail(function(error) {
                        throw new Error(error);
                    });
        //return this.store.fetchById('table', params.tableName);
    },

    afterModel: function() {
        this.controllerFor("tables").set('showProgress', false);
    },
});