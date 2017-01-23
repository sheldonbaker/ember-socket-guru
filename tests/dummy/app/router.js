import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

/* eslint-disable array-callback-return */
Router.map(function() {
  this.route('pusher-example');
  this.route('socket-example');
  this.route('phoenix-example');
});
/* eslint-enable */

export default Router;
