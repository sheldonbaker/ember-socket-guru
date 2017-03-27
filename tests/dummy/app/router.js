import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

/* eslint-disable array-callback-return */
Router.map(function() {
  this.route('technology', { path: '/:technology' }, function() {
    this.route('installation');
    this.route('getting-started');
    this.route('observed-channels-structure');
    this.route('socket-clients');
  });
});
/* eslint-enable */

export default Router;
