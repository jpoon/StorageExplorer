import Ember from 'ember';

export default Ember.ObjectController.extend({
  showProgress: false,

  rowCount: function(){
    return this.get('tables.rows.length');
  }.property('tables.rows'),
  
  rowHeader: function(){
    var header = {};

    this.get('tables.rows').forEach(function(row) {
      Ember.$.map(row, function(value, key) {
        header[key] = key;
      });
    });

    return Object.keys(header);
  }.property('tables.rows'),

  rowData: function(){
    var rows = [];

    var rowHeader = this.get('rowHeader');
    this.get('tables.rows').forEach(function(row) {
        console.log(row);
        rows.push(Ember.$.map(rowHeader, function(header) {
            var value = row[header];
            if (value === undefined) {
              value = '';
            }
            return value;
        }));
    });

    return rows;
  }.property('tables.rows', 'rowHeader')

});