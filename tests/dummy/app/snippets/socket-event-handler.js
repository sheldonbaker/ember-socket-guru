import SocketEventHandler from 'ember-socket-guru/mixins/socket-event-handler';

export default Route.extend(SocketEventHandler, {
  onSocketAction(eventName, eventData) {
  },

  socketActions: {
    catchEvent1(data) {
      doSomething();
    }
  }
});
