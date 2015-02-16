import Ember from 'ember';

var ErrorController = Ember.Controller.extend({
    code: function () {
        return this.get('content.status') > 200 ? this.get('content.status') : 500;
    }.property('content.status'),

    message: function () {
        return this.get('content.statusText') !== 'error' ? this.get('content.statusText') : 'Internal Server Error';
    }.property('content.statusText')
});

export default ErrorController;