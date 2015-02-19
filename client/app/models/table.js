import DS from 'ember-data';

var tables = DS.Model.extend({
    tableName: DS.attr('string')
});

export default tables;