import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
	normalize: function(type, hash) {
  		hash.id = hash.partitionKey + '/' + hash.rowKey;
		return this._super(type, hash);
	},

	attrs: {
		columns: { embedded: 'always' },
	}	
});