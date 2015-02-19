import Ember from 'ember';

export default Ember.ArrayController.extend({
//  itemController: 'tableRow',

  showProgress: false,

  /*
  rowCount: function(){
    return this.get('table.length');
  }.property('table')
  
  rowHeader: function(){
    var header = {};

    this.get('rows').forEach(function(row) {
      Ember.$.map(row, function(value, key) {
        header[key] = key;
      });
    });

    return Object.keys(header);
  }.property('rows')

  /*
  rowData: function(){
    var rows = [];

    var rowHeader = this.get('rowHeader');

    this.get('rows').forEach(function(row) {
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
  }.property('rows', 'rowHeader')
*/
});