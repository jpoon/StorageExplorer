import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
	normalize: function(type, hash) {
  		hash.id = hash.partitionKey + '/' + hash.rowKey;
		return this._super(type, hash);
	},

    normalizeRelationships: function(type, hash) {
        var store = this.store;
     
        this._super(type, hash);
     
        type.eachRelationship(function(attr, relationship) {
            var relatedTypeKey = relationship.type.typeKey;
    
            if (relationship.options.embedded) {
                if (relationship.kind === 'hasMany') {
                    hash[attr] = Object.keys(hash).map(function (key) {
                        // Normalize the record with the correct serializer for the type
                        var normalized = store.serializerFor(relatedTypeKey).normalize(relationship.type, { parentId: hash.id, key: key, value: hash[key] }, attr);

                        // Push the record into the store
                        store.push(relatedTypeKey, normalized);

                        // Return just the id, and the relation manager will take care of the rest
                        return normalized.id;
                    });
                }
            }
        });
    }
});