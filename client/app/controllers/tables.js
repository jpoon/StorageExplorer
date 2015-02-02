import Ember from 'ember';

export default Ember.ObjectController.extend({
    showProgress: false,

    tablesCount: function(){
        return this.get('tables.length');
    }.property('tables')
});