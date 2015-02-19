import DS from 'ember-data';

var table = DS.Model.extend({
    tableName: DS.attr('string')
});

export default table;