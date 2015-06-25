import DS from 'ember-data';

var column = DS.Model.extend({
  key: DS.attr('string'),
  value: DS.attr('string'),
  row: DS.belongsTo('row')
});

export default column;
