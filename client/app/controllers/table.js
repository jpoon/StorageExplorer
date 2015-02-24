import Ember from 'ember';

export default Ember.ArrayController.extend({
  showProgress: false,

  rowCount: function(){
    return this.get('content').length;
  }.property('content'),
  
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

});