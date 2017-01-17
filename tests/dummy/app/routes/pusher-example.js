import Ember from 'ember';
import SocketEventHandlerMixin from 'ember-socket-guru/mixins/socket-event-handler';

const { Route } = Ember;

export default Route.extend(SocketEventHandlerMixin, {
});
