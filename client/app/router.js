import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
    this.resource("tables", { path: '/' }, function() {
        this.resource("table", { path: "/:table_name" });
    });
});

export default Router;
