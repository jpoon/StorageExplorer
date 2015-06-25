import DS from 'ember-data';

var tables = DS.Model.extend({
  tableName: DS.attr(),
});

export default tables;
