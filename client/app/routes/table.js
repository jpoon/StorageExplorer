import Ember from 'ember';

export default Ember.Route.extend({
    model: function(params) {
        this.controllerFor('tables').set('showProgress', true);
        return this.store.fetchById('table', params.tableName);
    },

    afterModel: function() {
        this.controllerFor("tables").set('showProgress', false);
    },
});