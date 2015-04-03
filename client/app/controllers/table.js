import Ember from 'ember';

export default Ember.ObjectController.extend({
  sortProperty: 'partitionKey',
  sortAscending: 'true',

  glyphiconDirection: function() {
    if (this.get('sortAscending')) {
       return "glyphicon-chevron-down";
    } else {
       return "glyphicon-chevron-up";
    }
  }.property("sortAscending"),

  sortedRows: function(){
    var array = this.get('content.rows').sortBy(this.get('sortProperty'));
    if (this.get('sortAscending')) {
      array.reverse();
    }

    return array;
  }.property('content.rows', 'sortProperty', 'sortAscending'),  

  rowCount: function(){
    return this.get('content.rows').length;
  }.property('content.rows'),

  actions: {
    sortBy: function(property) {
      this.set('sortProperty', property);
      this.set('sortAscending', !this.get('sortAscending'));
    }
  }
});