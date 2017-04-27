import Ember from 'ember';

const { Route } = Ember;

export default Route.extend(SocketEventHandler, {
  socketActions: {
    singleEvent(data) {
      // do something
    },
  },
});
