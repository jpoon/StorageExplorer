import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
    model: function(params) {
        this.set('params', params);
        return Ember.$.getJSON(config.APP.apiHost + '/tables?account=' + params.storageAccountName + '&key=' + params.storageAccountKey);
    },

    setupController: function(controller, model) {
        controller.set('params', this.get('params'));
        this._super(controller, model);
    }
});
