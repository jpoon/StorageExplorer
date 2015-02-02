import Ember from 'ember';

export default Ember.Controller.extend({
    init: function() {
      this._super(); 
    },

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

      return encodeURIComponent(this.get('accountName'));
    }.property('accountName'),

    storageAccountKey: function() {
      var key = this.get('accountKey');

      if (!key) {
        return;
      }

      return encodeURIComponent(key);
    }.property('accountKey'),

    actions: {
        load: function () {
            this.transitionToRoute('tables'); 
        }
    }
});