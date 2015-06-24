import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(columnIndex, columnLength) {
  return columnIndex !== (columnLength - 1);
});
