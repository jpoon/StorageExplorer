import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var name = this.controllerFor('application').get('storageAccountName');
        var key = this.controllerFor('application').get('storageAccountKey');

        if (!name || !key) {
            this.transitionTo('application');
        }
    },

    model: function(params) {
        this.controllerFor('tables').set('showProgress', true);
        return this.store.fetchById('table', params.tableName);
    },

    afterModel: function() {
        this.controllerFor("tables").set('showProgress', false);
    },
});