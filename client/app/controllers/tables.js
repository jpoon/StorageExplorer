import Ember from 'ember';

export default Ember.ObjectController.extend({
  params: null,

  tablesCount: function(){
    return this.get('tables.length');
  }.property('tables')
});