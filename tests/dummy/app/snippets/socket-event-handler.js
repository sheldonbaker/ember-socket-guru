import Ember from 'ember';
import SocketEventHandler from 'ember-socket-guru/mixins/socket-event-handler';

const { Route } = Ember;

export default Route.extend(SocketEventHandler, {
  socketActions: {
    onEvent1(data) {
      // catch all
    },
  },

  onSocketAction(eventName, eventData) {
    // handle the event
  },
});
