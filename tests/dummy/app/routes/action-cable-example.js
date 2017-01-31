import Ember from 'ember';
import SocketEventHandlerMixin from 'ember-socket-guru/mixins/socket-event-handler';

const { Route, inject: { service } } = Ember;

export default Route.extend(SocketEventHandlerMixin, {
  socketGuru: service('socket-guru-action-cable'),
  onSocketAction(action, data) {
    console.log('action cable action', data);
  },
});
