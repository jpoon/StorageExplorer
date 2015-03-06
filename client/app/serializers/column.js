import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, {
    normalize: function(type, hash) {
        hash.id = hash.parentId + '/' + hash.key;
        return this._super(type, hash);
    }
});