import DS from 'ember-data';

var table = DS.Model.extend({
    tableName: DS.attr('string'),
    rows: DS.hasMany('row')
});

export default table;