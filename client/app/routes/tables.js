import Ember from 'ember';

export default Ember.Route.extend({
    model: function(param) {
        this.controllerFor("application").set('storageAccountName', param.storageAccountName);
        this.controllerFor("application").set('storageAccountKey', param.storageAccountKey);

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
