import Ember from 'ember';
import SocketEventHandler from 'ember-socket-guru/mixins/socket-event-handler';

const { Route, inject: { service } } = Ember;

export default Route.extend(SocketEventHandler, {
  socketGuru: service('socket-guru-socketio'),
  onSocketAction(action, data) {
    console.log('socket action', action, data);
  },
});
