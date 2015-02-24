import DS from 'ember-data';

var row = DS.Model.extend({
    partitionKey: DS.attr('string'),
    rowKey: DS.attr('string'),
    table: DS.belongsTo('table'),
    columns: DS.hasMany('column')
});

export default row;