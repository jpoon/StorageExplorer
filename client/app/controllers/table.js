import Ember from 'ember';

export default Ember.ObjectController.extend({
  rowCount: function(){
    return this.get('rows.length');
  }.property('rows'),

  rowHeader: function(){
    return Ember.$.map(this.get('rows')[0], function(value, key) {
        return [key];
    });
  }.property('rows'),

  rowData: function(){
    var rows = [];

    this.get('rows').forEach(function(row) {
        rows.push(Ember.$.map(row, function(value, key) {
            return [value];
        }));
    });

    return rows;
  }.property('rows')

});