import Ember from 'ember';

export default Ember.Controller.extend({
  init: function() {
    this._super();
    this.set('storageAccountName', localStorage.storageAccountName);
    this.set('storageAccountKey', localStorage.storageAccountKey);
  },

  showProgress: false,

  loadDisabled: function() {
    var account = this.get('storageAccountName'),
      key = this.get('storageAccountKey');

    if (account && key) {
      return false;
    }

    return true;
  }.property('storageAccountName', 'storageAccountKey'),

  storageAccountNameChanged: function() {
    localStorage.storageAccountName = this.get('storageAccountName');
  }.observes('storageAccountName'),

  storageAccountKeyChanged: function() {
    localStorage.storageAccountKey = this.get('storageAccountKey');
  }.observes('storageAccountKey'),

  actions: {
    load: function() {
      this.transitionToRoute('tables');
    }
  }
});
