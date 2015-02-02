import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
    beforeModel: function() {
        var name = this.controllerFor('application').get('storageAccountName');
        var key = this.controllerFor('application').get('storageAccountKey');

        if (!name || !key) {
            this.transitionTo('application');
        }
    },

    model: function(params) {
        var that = this;
        var storageAccountName = this.controllerFor("application").get('storageAccountName');
        var storageAccountKey = this.controllerFor("application").get('storageAccountKey');

        var url = config.APP.apiHost + '/tables/' + params.tableName + '?account=' + storageAccountName + '&key=' + storageAccountKey;
        Ember.Logger.info('url', url);
        
        var data = Ember.$.getJSON(url, function() { 
            that.controllerFor("table").set('showProgress', false);
        });

        Ember.run.later(function(){
            that.controllerFor("table").set('showProgress', false);
            data.abort();
        }, 5000);

        return data;
    },

    actions: {
        loading: function() {
            this.controllerFor("table").set('showProgress', true);
        },

        error: function(error, transition) {
            console.log(error);
            if (error && error.status === 400) {
                // error substate and parent routes do not handle this error
                return this.transitionTo('modelNotFound');
            }
        }
    }
});