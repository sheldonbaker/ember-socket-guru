import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  actions: {
    onGetStartedClick() {
      this.transitionTo('technology.installation', 'socketio');
    },
  },
});
