import Ember from 'ember';

export default Ember.ObjectController.extend({
  /*
  sortedRows: (function() {
    return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
      sortProperties: 'rowKey',
      sortAscending: true,
      content: this.get('content.rows')
    });
  }).property('content.rows'),*/

  rowCount: function(){
    return this.get('content.rows').length;
  }.property('content.rows')
 
 /* 
  rowHeader: function(){
    var header = {};

    this.get('content').forEach(function(row) {
      Ember.$.map(row, function(value, key) {
        header[key] = key;
      });
    });

    return Object.keys(header);
  }.property('content'),

  rowData: function(){
    var rows = [];

    var rowHeader = this.get('rowHeader');
    this.get('content').forEach(function(row) {
        rows.push(Ember.$.map(rowHeader, function(header) {
            var value = row[header];
            if (value === undefined) {
              value = '';
            }
            return value;
        }));
    });

    return rows;
  }.property('content', 'rowHeader')
*/
});