import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	primaryKey: 'tableName',

    extractSingle: function(store, type, payload, id, requestType){
        console.log("!!!!");
        console.log(payload);

        return this._super(store, type, payload, id, requestType);
    }
});