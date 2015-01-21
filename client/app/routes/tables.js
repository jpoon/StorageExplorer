import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
    model: function(params) {
        return Ember.$.getJSON(config.APP.apiHost + '/tables?account=' + params.storageAccountName + '&key=' + params.storageAccountKey);
    }
});
