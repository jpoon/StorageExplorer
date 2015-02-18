import Ember from 'ember';

var ErrorController = Ember.Controller.extend({
    code: function () {
        return this.get('content.status') > 200 ? this.get('content.status') : 500;
    }.property('content.status'),

    response: function() {
        return this.get('content.responseText');
    }.property('content.responseText'),
});

export default ErrorController;