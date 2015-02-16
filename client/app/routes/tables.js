import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
    beforeModel: function() {
        var name = this.controllerFor('application').get('storageAccountName');
        var key = this.controllerFor('application').get('storageAccountKey');

        if (!name || !key) {
            this.transitionTo('application');
        }

        this.controllerFor("application").set('showProgress', true);
    },

    model: function() {
        var storageAccountName = this.controllerFor("application").get('storageAccountName');
        var storageAccountKey = this.controllerFor("application").get('storageAccountKey');

        var url = config.APP.apiHost + '/tables?account=' + storageAccountName + '&key=' + storageAccountKey;
        Ember.Logger.info('url', url);
       
        var promise =  new Ember.RSVP.Promise(function(resolve,reject) {
            Ember.$.getJSON(url).then(resolve, reject);
        });

        return promise;
    },

    afterModel: function() {
        this.controllerFor("application").set('showProgress', false);
    },

    actions: {
        error: function(error) {
            Ember.Logger.error(error);
            this.controllerFor("application").set('showProgress', false);
            return true;
        }
    }
});
