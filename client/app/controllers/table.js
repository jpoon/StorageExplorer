import Ember from 'ember';

export default Ember.ObjectController.extend({
    sortProperty: '',
    sortAscending: true,

    rowCount: function(){
      return this.get('rows').length;
    }.property('rows'),

    actions: {
        setSortProperty: function(property) {
            this.set('sortProperty', property);
        },

        setSortAscending: function(sortAscending) {
            this.set('sortAscending', sortAscending);
        }
    }
});