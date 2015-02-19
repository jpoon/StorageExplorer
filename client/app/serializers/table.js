import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
	primaryKey: 'tableName',

	attrs: {
		rows: { embedded: 'always' },
	}
});