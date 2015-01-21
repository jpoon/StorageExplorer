import Ember from 'ember';

export default Ember.ObjectController.extend({
  tablesCount: function(){
    return this.get('tables.length');
  }.property('tables')
});