import DS from 'ember-data';

var table = DS.Model.extend({
  tableName: DS.attr('string'),
  headings: DS.attr(),
  rows: DS.hasMany('row')
});

export default table;
