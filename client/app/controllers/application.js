import Ember from 'ember';

export default Ember.Controller.extend({
    init: function() {
      this._super(); 
    },

    loadDisabled: function() {
      var account = this.get('storageAccountName'),
          key = this.get('storageAccountKey');

      if (account && key) {
        return false;
      }

      return true;
    }.property('storageAccountName', 'storageAccountKey'),

    actions: {
        load: function () {
            var account = this.get('storageAccountName'),
                key = this.get('storageAccountKey');
        }
    }
});