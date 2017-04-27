import Ember from 'ember';

const { Route } = Ember;

export default Route.extend(SocketEventHandler, {
  onSocketAction(eventName) {
    // do something
  },
});
