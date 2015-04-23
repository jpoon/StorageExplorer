import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortProperties: ['partitionKey'],
  sortAscending: false,
});