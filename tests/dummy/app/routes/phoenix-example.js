import Ember from 'ember';
import SocketEventHandler from 'ember-socket-guru/mixins/socket-event-handler';

const { Route, inject: { service } } = Ember;

export default Route.extend(SocketEventHandler, {
  socketGuru: service('socket-guru-phoenix'),
  onSocketAction(name, data) {
    console.log('socket action', name, data);
  },
});
