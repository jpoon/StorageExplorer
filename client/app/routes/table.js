import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({
    model: function() {
        var tablesParams = this.controllerFor('tables').params;
        return Ember.$.getJSON(config.APP.apiHost + '/tables/' + params.table_name + '?account=' + tablesParams.storageAccountName + '&key=' + tablesParams.storageAccountKey);
    }
});