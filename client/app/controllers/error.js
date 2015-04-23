import Ember from 'ember';

export default Ember.Controller.extend({
    code: function () {
        return this.get('content.status') > 200 ? this.get('content.status') : 500;
    }.property('content.status'),

    response: function() {
        return this.get('content.responseText') || this.get('content.statusText');
    }.property('content.responseText', 'content.statusText'),
});
