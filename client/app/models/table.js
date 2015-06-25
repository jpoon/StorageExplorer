import DS from 'ember-data';

var table = DS.Model.extend({
  headings: DS.attr(),
  rows: DS.hasMany('row')
});

export default table;
