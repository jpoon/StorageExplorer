import Ember from 'ember';

export default Ember.ObjectController.extend({
    sortProperty: '',
    sortAscending: true,

    glyphiconDirection: function() {
      if (this.get('sortAscending')) {
         return "glyphicon-chevron-down";
      } else {
         return "glyphicon-chevron-up";
      }
    }.property("sortAscending"),

    rowCount: function(){
      return this.get('model.rows').length;
    }.property('model.rows'),

    actions: {
      sortBy: function(property) {
        this.set('sortProperty', property);
        this.set('sortAscending', !this.get('sortAscending'));
      },

      toggleColumnVisibility: function(heading, index) {
        console.log(heading);
        console.log(index);
        console.log(this.get('model').get(heading));
      },
    }
});