import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
	primaryKey: 'tableName',

	extractArray: function(store, type, payload) {
		console.log(payload);
		return this._super(store, type, payload);
	},

	attrs: {
		rows: { embedded: 'always' },
	}
});