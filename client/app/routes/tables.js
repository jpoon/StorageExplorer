import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
        var name = this.controllerFor('application').get('storageAccountName');
        var key = this.controllerFor('application').get('storageAccountKey');

        if (!name || !key) {
            this.transitionTo('application');
        }
    },

    model: function() {
        this.controllerFor("application").set('showProgress', true);
        return this.store.find('table');
    },

    afterModel: function() {
        this.controllerFor("application").set('showProgress', false);
    },

    actions: {
        error: function() {
            this.controllerFor("application").set('showProgress', false);
            return true;
        }
    }
});
