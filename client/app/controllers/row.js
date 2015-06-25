import Ember from 'ember';

export default Ember.ArrayController.extend({
  needs: ['table'],

  sortProperties: ['partitionKey'],
  sortAscending: true,

  _sortProperties: function() {
    this.set('sortProperties', [this.get('controllers.table.sortProperty')]);
  }.observes('controllers.table.sortProperty'),

  _sortAscending: function() {
    this.set('sortAscending', this.get('controllers.table.sortAscending'));
  }.observes('controllers.table.sortAscending'),
});
