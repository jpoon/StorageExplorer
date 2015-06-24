import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(value, options) {
  return value == 0 || value == 1;
});
