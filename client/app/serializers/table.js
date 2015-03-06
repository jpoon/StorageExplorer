import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    normalize: function(type, hash) {
        hash.id = hash.tableName;
        return this._super(type, hash);
    },

	attrs: {
		rows: { embedded: 'always' }
	}
});