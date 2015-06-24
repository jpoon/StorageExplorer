import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(value) {
  return value === 0 || value === 1;
});
