import Ember from 'ember';

export default Ember.ObjectController.extend({
  glyphiconDirection: function() {
    if (this.get('sortAscending')) {
       return "glyphicon-chevron-down";
    } else {
       return "glyphicon-chevron-up";
    }
  }.property("sortAscending"),

  sortedRows: function(){
    var array = this.get('model.rows').sortBy(this.get('sortProperty'));

    if (this.get('sortAscending')) {
      array.reverse();
    }

    return array;
  }.property('model.rows', 'sortProperty', 'sortAscending'),

  rowCount: function(){
    return this.get('model.rows').length;
  }.property('model.rows'),

  actions: {
    sortBy: function(property) {
      this.set('sortProperty', property);
      this.set('sortAscending', !this.get('sortAscending'));
    }
  }
});