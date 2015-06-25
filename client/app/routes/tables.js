import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    this.controllerFor("application").set('showProgress', true);
    return this.store.find('tables');
  },

  afterModel: function() {
    this.controllerFor("application").set('showProgress', false);
  },

  actions: {
    error: function() {
      this.controllerFor("application").set('showProgress', false);
      return true;
    }
  }
});
