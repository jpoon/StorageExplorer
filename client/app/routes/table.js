import Ember from 'ember';

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
        return this.store.find('table', params.tableName);
    },

    afterModel: function() {
        this.controllerFor("tables").set('showProgress', false);
    },
});