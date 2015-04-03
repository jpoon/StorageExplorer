import DS from 'ember-data';

var row = DS.Model.extend({
    partitionKey: DS.attr('string'),
    rowKey: DS.attr('string'),
    timestamp: DS.attr('string'),
    table: DS.belongsTo('table'),
    columns: DS.hasMany('column', { embedded: 'always'})
});

export default row;