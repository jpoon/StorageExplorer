import Ember from 'ember';

export default Ember.Controller.extend({
    init: function() {
      this._super(); 
    },

    showProgress: false,

    loadDisabled: function() {
      var account = this.get('accountName'),
          key = this.get('accountKey');

      if (account && key) {
        return false;
      }

      return true;
    }.property('accountName', 'accountKey'),

    storageAccountName: function() {
      var name = this.get('accountName');

      if (!name) {
        return;
      }

      localStorage.storageAccountName = name;
      return encodeURIComponent(name);
    }.property('accountName'),

    storageAccountKey: function() {
      var key = this.get('accountKey');

      if (!key) {
        return;
      }

      localStorage.storageAccountKey = key;
      return encodeURIComponent(key);
    }.property('accountKey'),

    actions: {
        load: function () {
            this.transitionToRoute('tables'); 
        }
    }
});