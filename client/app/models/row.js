import DS from 'ember-data';

var row = DS.Model.extend({
    table: DS.belongsTo('table'),
    PartitionKey: DS.attr('string'),
    RowKey: DS.attr('string'),
    timestamp: DS.attr('string'),
    columns: DS.hasMany('column', { embedded: 'always'})
});

export default row;