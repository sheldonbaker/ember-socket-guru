import Ember from 'ember';
import SocketEventHandler from 'ember-socket-guru/mixins/socket-event-handler';

const { Route } = Ember;

export default Route.extend(SocketEventHandler, {
  onPusherAction(action, data) {
    console.log('asd', action, data);
  },
});
