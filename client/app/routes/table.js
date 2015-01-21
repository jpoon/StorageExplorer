import Ember from 'ember';

export default Ember.Route.extend({
    model: function(params) {
        return Ember.$.getJSON(config.APP.apiHost + '/tables/' + params.table_name + '?account=' + params.storageAccountName + '&key=' + params.storageAccountKey);
    }
});